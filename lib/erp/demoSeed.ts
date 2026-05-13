import mongoose, { type ClientSession, Types } from "mongoose";
import { randomBytes } from "crypto";
import { connectToDatabase } from "@/lib/db/connect";
import { CategoryModel } from "@/lib/db/models/Category";
import { SupplierModel } from "@/lib/db/models/Supplier";
import { ProductModel } from "@/lib/db/models/Product";
import { PurchaseModel } from "@/lib/db/models/Purchase";
import { SaleModel } from "@/lib/db/models/Sale";
import { DEFAULT_ERP_CATEGORIES } from "@/lib/inventory/defaultErpCategories";
import { slugify } from "@/lib/inventory/productMatch";
import { findProductForPurchaseLine, type PurchaseLinePayload } from "@/lib/inventory/findProductForPurchaseLine";
import { validateCategoryAttributes, compactAttributes } from "@/lib/inventory/validateCategoryAttributes";
import type { CategoryFieldDef } from "@/lib/inventory/categoryFieldTypes";
import { deriveProductNameFromAttributes } from "@/lib/inventory/deriveProductNameFromAttributes";
import { extractCommerceFromAttributes, specAttributesOnly } from "@/lib/inventory/purchaseCommerceAttributes";

const DEMO = true;

/** Demo category URL keys — also used to wipe orphaned rows from older runs before `demoSeed` existed. */
export const DEMO_CATEGORY_SLUGS = ["demo-laptop", "demo-desktop-pc", "demo-accessories", "demo-parts"] as const;

class LineValidationError extends Error {
  constructor(public issues: string[]) {
    super(issues.join("; "));
    this.name = "LineValidationError";
  }
}

function cloneDefs<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

function toPayload(productName: string, attributes: Record<string, unknown>): PurchaseLinePayload {
  return { productName, attributes };
}

function deriveBrand(attrs: Record<string, unknown>): string {
  const b = attrs.brand ?? attrs.accessoryBrand;
  return typeof b === "string" ? b.trim() : "";
}

async function uniqueSku(s: ClientSession): Promise<string> {
  for (let i = 0; i < 50; i++) {
    const sku = `DEMO-${Date.now().toString(36)}${randomBytes(2).toString("hex")}`.toUpperCase();
    const exists = await ProductModel.findOne({ sku }).session(s).lean();
    if (!exists) return sku;
  }
  return `DEMO-${randomBytes(8).toString("hex").toUpperCase()}`;
}

async function uniqueSlug(base: string, s: ClientSession): Promise<string> {
  const root = slugify(base) || "item";
  for (let i = 0; i < 30; i++) {
    const slug = i === 0 ? root : `${root}-${i}`;
    const exists = await ProductModel.findOne({ slug }).session(s).lean();
    if (!exists) return slug;
  }
  return `${root}-${randomBytes(3).toString("hex")}`;
}

async function createDemoProduct(
  session: ClientSession,
  catId: Types.ObjectId,
  productName: string,
  specAttrs: Record<string, unknown>,
  qty: number,
  purchasePrice: number,
  sellingPrice: number,
  gstRate: number,
) {
  const sku = await uniqueSku(session);
  const slug = await uniqueSlug(productName, session);
  const brand = deriveBrand(specAttrs);

  const doc = {
    sku,
    slug,
    categoryId: catId,
    name: productName.trim(),
    attributes: compactAttributes(specAttrs),
    brand: brand || undefined,
    pricing: {
      sellingPrice,
      purchasePriceAvg: purchasePrice,
      gstRate,
    },
    stock: { onHand: qty, lowStockThreshold: 2 },
    status: "active" as const,
    demoSeed: DEMO,
  };

  const [created] = await ProductModel.create([doc], { session });
  return created!;
}

async function processPurchase(
  session: ClientSession,
  userId: Types.ObjectId,
  supplierId: Types.ObjectId,
  date: Date,
  invoiceNumber: string,
  lines: Array<{ categorySlug: string; attributes: Record<string, unknown> }>,
  catBySlug: Map<string, { _id: Types.ObjectId; slug?: string; fieldDefinitions?: CategoryFieldDef[] }>,
) {
  const items: Array<Record<string, unknown>> = [];
  let totalQty = 0;
  let subTotal = 0;
  let gstTotal = 0;

  for (const line of lines) {
    const key = line.categorySlug.trim().toLowerCase();
    const cat = catBySlug.get(key);
    if (!cat) {
      const keys = [...catBySlug.keys()].sort().join(", ");
      throw new Error(`BAD_CATEGORY: unknown slug "${key}" (known: ${keys || "none"})`);
    }

    const catId = cat._id;
    const defs = (cat.fieldDefinitions ?? []) as CategoryFieldDef[];
    if (!defs.length) throw new Error("BAD_CATEGORY_SCHEMA");

    const validated = validateCategoryAttributes(defs, line.attributes ?? {});
    if (!validated.ok) throw new LineValidationError(validated.errors);

    const attrs = compactAttributes(validated.normalized);
    const catSlug = cat.slug;
    const productName = deriveProductNameFromAttributes(catSlug, attrs);
    const commerce = extractCommerceFromAttributes(attrs);
    const { quantity: qty, purchasePrice, sellingPrice, gstPercent: gstRate, notes: lineNotes } = commerce;
    const specAttrs = compactAttributes(specAttributesOnly(attrs));
    const payload = toPayload(productName, attrs);

    const catLean = {
      _id: catId,
      slug: catSlug,
      fieldDefinitions: defs,
    };

    const { product: found, legacy } = await findProductForPurchaseLine(catLean, payload, session);
    let product = found;

    if (!product) {
      product = await createDemoProduct(session, catId, productName, specAttrs, qty, purchasePrice, sellingPrice, gstRate);
    } else {
      const oldOn = product.stock?.onHand ?? 0;
      const oldAvg = product.pricing?.purchasePriceAvg ?? 0;
      const newAvg = oldOn + qty === 0 ? purchasePrice : (oldOn * oldAvg + qty * purchasePrice) / (oldOn + qty);

      const $set: Record<string, unknown> = {
        "pricing.purchasePriceAvg": newAvg,
        "pricing.sellingPrice": sellingPrice,
        "pricing.gstRate": gstRate,
        name: productName.trim(),
        brand: deriveBrand(specAttrs) || "",
        attributes: specAttrs,
      };

      const $unset: Record<string, string> = {};
      if (legacy) {
        ["processor", "ram", "storage", "graphics", "color", "condition", "model", "productType", "capacity", "version"].forEach((k) => {
          $unset[k] = "";
        });
      }

      await ProductModel.findByIdAndUpdate(
        product._id,
        { $inc: { "stock.onHand": qty }, $set: $set, ...(Object.keys($unset).length ? { $unset } : {}) },
        { session },
      );
    }

    const base = qty * purchasePrice;
    const gstAmount = (base * gstRate) / 100;
    const lineTotal = base + gstAmount;

    items.push({
      productId: product!._id,
      categoryId: catId,
      name: productName.trim(),
      attributes: attrs,
      quantity: qty,
      purchasePrice,
      sellingPrice,
      gstRate,
      gstAmount,
      lineTotal,
      notes: lineNotes || undefined,
    });

    totalQty += qty;
    subTotal += base;
    gstTotal += gstAmount;
  }

  await PurchaseModel.create(
    [
      {
        date,
        invoiceNumber,
        supplierId,
        items,
        totals: {
          quantity: totalQty,
          subTotal,
          gstTotal,
          finalTotal: subTotal + gstTotal,
        },
        notes: "LaptopSecure demo purchase",
        createdByUserId: userId,
        demoSeed: DEMO,
      },
    ],
    { session },
  );
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(12, 0, 0, 0);
  return d;
}

function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Rows whose every line references one of these product ids (e.g. demo catalogue stock). */
function allLineItemsUseProductIds(productIds: Types.ObjectId[]) {
  return {
    $expr: {
      $and: [
        { $gt: [{ $size: { $ifNull: ["$items", []] } }, 0] },
        {
          $eq: [
            { $size: { $ifNull: ["$items", []] } },
            {
              $size: {
                $filter: {
                  input: { $ifNull: ["$items", []] },
                  as: "it",
                  cond: { $in: ["$$it.productId", productIds] },
                },
              },
            },
          ],
        },
      ],
    },
  };
}

export async function clearDemoData(session?: ClientSession) {
  await connectToDatabase();
  const opts = session ? { session } : {};

  const catFilter: Record<string, unknown> = {
    $or: [{ demoSeed: true }, { slug: { $in: [...DEMO_CATEGORY_SLUGS] } }],
  };
  let catQ = CategoryModel.find(catFilter).select("_id");
  if (session) catQ = catQ.session(session);
  const demoCats = await catQ.lean();
  const demoCatIds = demoCats.map((c) => c._id);

  const demoProductParts: Array<Record<string, unknown>> = [{ demoSeed: true }];
  if (demoCatIds.length) demoProductParts.push({ categoryId: { $in: demoCatIds } });
  let prodQ = ProductModel.find({ $or: demoProductParts }).select("_id");
  if (session) prodQ = prodQ.session(session);
  const demoProductRows = await prodQ.lean();
  const demoProductIds = demoProductRows.map((p) => p._id as Types.ObjectId);

  const saleClearFilter: Record<string, unknown> =
    demoProductIds.length > 0
      ? { $or: [{ demoSeed: true }, allLineItemsUseProductIds(demoProductIds)] }
      : { demoSeed: true };
  const purchaseClearFilter: Record<string, unknown> =
    demoProductIds.length > 0
      ? { $or: [{ demoSeed: true }, allLineItemsUseProductIds(demoProductIds)] }
      : { demoSeed: true };

  await SaleModel.deleteMany(saleClearFilter, opts);
  await PurchaseModel.deleteMany(purchaseClearFilter, opts);
  await ProductModel.deleteMany(
    demoCatIds.length ? { $or: [{ demoSeed: true }, { categoryId: { $in: demoCatIds } }] } : { demoSeed: true },
    opts,
  );
  await SupplierModel.deleteMany({ demoSeed: true }, opts);
  await CategoryModel.deleteMany(catFilter, opts);
}

export type DemoSeedResult = {
  categories: number;
  suppliers: number;
  purchases: number;
  sales: number;
  products: number;
};

export async function seedDemoErp(userId: string): Promise<DemoSeedResult> {
  await connectToDatabase();
  const userOid = new Types.ObjectId(userId);

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      await clearDemoData(session);

      const catDocs = DEFAULT_ERP_CATEGORIES.filter((c) => ["laptop", "desktop-pc", "accessories", "parts"].includes(c.slug)).map((seed) => ({
        name: seed.name,
        slug: `demo-${seed.slug}`,
        fieldDefinitions: cloneDefs(seed.fieldDefinitions),
        sortOrder: seed.sortOrder,
        status: "active" as const,
        demoSeed: DEMO,
        createdByUserId: userOid,
        description: "Demo dataset — remove with “Clear demo data” on the dashboard.",
      }));

      const insertedCats = (await CategoryModel.insertMany(catDocs, {
        session,
      })) as Array<{ _id: Types.ObjectId; slug?: string; fieldDefinitions?: CategoryFieldDef[] }>;

      const catBySlug = new Map(
        insertedCats.map((c) => [String(c.slug ?? "").toLowerCase(), { _id: c._id, slug: c.slug, fieldDefinitions: c.fieldDefinitions }]),
      );

      const supplierRows = [
        { name: "Ali Computers", phone: "+91 98100 10001", address: "Nehru Place, New Delhi", status: "active" as const, demoSeed: DEMO },
        { name: "Delhi Laptop Hub", phone: "+91 98100 10002", address: "Karol Bagh, New Delhi", status: "active" as const, demoSeed: DEMO },
        { name: "Tech Parts India", phone: "+91 98100 10003", address: "SP Road, Bengaluru", status: "active" as const, demoSeed: DEMO },
        { name: "Laptop Secure Vendor", phone: "+91 98100 10004", address: "Andheri East, Mumbai", status: "active" as const, demoSeed: DEMO },
      ];
      const suppliers = await SupplierModel.insertMany(supplierRows, { session });
      const s0 = suppliers[0]!._id as Types.ObjectId;
      const s1 = suppliers[1]!._id as Types.ObjectId;
      const s2 = suppliers[2]!._id as Types.ObjectId;
      const s3 = suppliers[3]!._id as Types.ObjectId;

      const d1 = daysAgo(45);
      const d2 = daysAgo(32);
      const d3 = daysAgo(18);
      const d4 = daysAgo(8);

      const commerce = (q: number, buy: number, sell: number, gst: number, purchaseDate: Date) => ({
        quantity: q,
        purchasePrice: buy,
        sellingPrice: sell,
        gstPercent: gst,
        notes: "",
        purchaseDate: isoDay(purchaseDate),
      });

      await processPurchase(
        session,
        userOid,
        s0,
        d1,
        "DEMO-PUR-ALI-001",
        [
          {
            categorySlug: "demo-laptop",
            attributes: {
              brand: "Dell",
              laptopModel: "Latitude 5410",
              processor: "Intel Core i5-10310U",
              ram: "16 GB",
              ssdHdd: "512 GB SSD",
              gpu: "Intel UHD",
              displaySize: '14"',
              color: "Gray",
              condition: "used",
              batteryHealth: "88%",
              ...commerce(5, 22000, 28999, 18, d1),
            },
          },
          {
            categorySlug: "demo-laptop",
            attributes: {
              brand: "HP",
              laptopModel: "EliteBook 840 G5",
              processor: "Intel Core i7-8650U",
              ram: "16 GB",
              ssdHdd: "512 GB SSD",
              gpu: "Intel UHD 620",
              displaySize: '14"',
              color: "Silver",
              condition: "refurbished",
              ...commerce(3, 26500, 32999, 18, d1),
            },
          },
          {
            categorySlug: "demo-laptop",
            attributes: {
              brand: "Lenovo",
              laptopModel: "ThinkPad T480",
              processor: "Intel Core i5-8350U",
              ram: "8 GB",
              ssdHdd: "256 GB SSD",
              gpu: "Intel UHD 620",
              displaySize: "14 inch",
              color: "Black",
              condition: "used",
              ...commerce(4, 18500, 23999, 18, d1),
            },
          },
        ],
        catBySlug,
      );

      await processPurchase(
        session,
        userOid,
        s1,
        d2,
        "DEMO-PUR-DLH-001",
        [
          {
            categorySlug: "demo-accessories",
            attributes: {
              accessoryName: "Logitech Mouse",
              accessoryBrand: "Logitech",
              model: "M185",
              color: "Black",
              wireless: "Yes",
              warranty: "1 year",
              ...commerce(10, 420, 699, 18, d2),
            },
          },
          {
            categorySlug: "demo-accessories",
            attributes: {
              accessoryName: "Dell Keyboard",
              accessoryBrand: "Dell",
              model: "KB216",
              color: "Black",
              wireless: "No",
              ...commerce(10, 550, 899, 18, d2),
            },
          },
          {
            categorySlug: "demo-accessories",
            attributes: {
              accessoryName: "HP Charger",
              accessoryBrand: "HP",
              model: "65W USB-C",
              color: "Black",
              wireless: "No",
              ...commerce(8, 890, 1399, 18, d2),
            },
          },
        ],
        catBySlug,
      );

      await processPurchase(
        session,
        userOid,
        s2,
        d3,
        "DEMO-PUR-TPI-001",
        [
          {
            categorySlug: "demo-parts",
            attributes: {
              compatibleLaptopBrand: "Dell",
              compatibleLaptopModel: "Latitude 5410",
              partName: "LCD Screen",
              partNumber: "SCR-D5410-FHD",
              brand: "InnoLux",
              condition: "new",
              ...commerce(6, 3200, 4999, 18, d3),
            },
          },
          {
            categorySlug: "demo-parts",
            attributes: {
              compatibleLaptopBrand: "Lenovo",
              compatibleLaptopModel: "ThinkPad T480",
              partName: "LCD Hinges (pair)",
              partNumber: "HNG-T480-01",
              brand: "Generic",
              condition: "new",
              ...commerce(10, 450, 799, 18, d3),
            },
          },
          {
            categorySlug: "demo-parts",
            attributes: {
              compatibleLaptopBrand: "HP",
              compatibleLaptopModel: "EliteBook 840 G5",
              partName: "Charging jack",
              partNumber: "PJ-HP840-DC",
              brand: "OEM",
              condition: "used",
              ...commerce(12, 280, 550, 18, d3),
            },
          },
        ],
        catBySlug,
      );

      await processPurchase(
        session,
        userOid,
        s3,
        d4,
        "DEMO-PUR-LSV-001",
        [
          {
            categorySlug: "demo-desktop-pc",
            attributes: {
              brand: "Custom",
              cabinet: "RGB Mid Tower",
              processor: "AMD Ryzen 5 5600",
              ram: "16 GB",
              ssdHdd: "512 GB NVMe",
              gpu: "RTX 3060",
              motherboard: "B550M",
              smps: "650W 80+ Bronze",
              rgb: "ARGB fans",
              condition: "new",
              ...commerce(2, 52000, 68999, 18, d4),
            },
          },
          {
            categorySlug: "demo-desktop-pc",
            attributes: {
              brand: "OfficeBuild",
              cabinet: "Micro ATX",
              processor: "Intel Core i3-12100",
              ram: "8 GB",
              ssdHdd: "256 GB SSD",
              gpu: "Intel UHD 730",
              motherboard: "H610",
              smps: "450W",
              condition: "new",
              ...commerce(3, 18500, 24999, 18, d4),
            },
          },
        ],
        catBySlug,
      );

      const demoProducts = await ProductModel.find({ demoSeed: true }).session(session).lean();
      const findProduct = (substr: string) =>
        demoProducts.find((p) => String(p.name).toLowerCase().includes(substr.toLowerCase())) as
          | { _id: Types.ObjectId; categoryId: Types.ObjectId; name: string; pricing?: { sellingPrice?: number } }
          | undefined;

      const pLaptop = findProduct("latitude 5410");
      const pMouse = findProduct("logitech mouse");
      const pKeyboard = findProduct("dell keyboard");
      if (!pLaptop || !pMouse || !pKeyboard) throw new Error("DEMO_PRODUCT_LOOKUP_FAILED");

      async function createSale(productId: Types.ObjectId, categoryId: Types.ObjectId, name: string, qty: number, price: number, inv: string) {
        const discount = 0;
        const gstRate = 18;
        const lineNet = qty * price - discount;
        const gstAmount = (lineNet * gstRate) / 100;
        const lineTotal = lineNet + gstAmount;

        const product = await ProductModel.findById(productId).session(session);
        if (!product) throw new Error("NO_PRODUCT");
        const onHand = product.stock?.onHand ?? 0;
        if (onHand < qty) throw new Error("NO_STOCK");

        await ProductModel.findByIdAndUpdate(
          productId,
          { $inc: { "stock.onHand": -qty, "stock.sold": qty } },
          { session },
        );

        await SaleModel.create(
          [
            {
              date: daysAgo(3),
              invoiceNumber: inv,
              paymentMode: "upi",
              customerSnapshot: { name: "Walk-in Customer", phone: "+919876543210" },
              items: [
                {
                  productId,
                  categoryId,
                  name,
                  quantity: qty,
                  sellingPrice: price,
                  discount,
                  gstRate,
                  gstAmount,
                  lineTotal,
                },
              ],
              totals: {
                quantity: qty,
                subTotal: qty * price,
                discountTotal: discount,
                gstTotal: gstAmount,
                finalTotal: lineTotal,
              },
              notes: "Demo sale",
              createdByUserId: userOid,
              demoSeed: DEMO,
            },
          ],
          { session },
        );
      }

      await createSale(
        pLaptop._id,
        pLaptop.categoryId,
        pLaptop.name,
        1,
        pLaptop.pricing?.sellingPrice ?? 28999,
        `DEMO-SALE-${randomBytes(3).toString("hex").toUpperCase()}-A`,
      );
      await createSale(
        pMouse._id,
        pMouse.categoryId,
        pMouse.name,
        2,
        pMouse.pricing?.sellingPrice ?? 699,
        `DEMO-SALE-${randomBytes(3).toString("hex").toUpperCase()}-B`,
      );
      await createSale(
        pKeyboard._id,
        pKeyboard.categoryId,
        pKeyboard.name,
        1,
        pKeyboard.pricing?.sellingPrice ?? 899,
        `DEMO-SALE-${randomBytes(3).toString("hex").toUpperCase()}-C`,
      );
    });
  } finally {
    await session.endSession();
  }

  const [pc, sc, prc, sac] = await Promise.all([
    CategoryModel.countDocuments({ demoSeed: true }),
    SupplierModel.countDocuments({ demoSeed: true }),
    PurchaseModel.countDocuments({ demoSeed: true }),
    SaleModel.countDocuments({ demoSeed: true }),
  ]);
  const prodCount = await ProductModel.countDocuments({ demoSeed: true });

  return {
    categories: pc,
    suppliers: sc,
    purchases: prc,
    sales: sac,
    products: prodCount,
  };
}
