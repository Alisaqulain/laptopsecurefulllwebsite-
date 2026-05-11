import type { CategoryFieldDef } from "@/lib/inventory/categoryFieldTypes";

export type DefaultErpCategorySeed = {
  name: string;
  slug: string;
  sortOrder: number;
  status: "active";
  fieldDefinitions: CategoryFieldDef[];
};

const condOpts = ["new", "refurbished", "used"];
const yesNo = ["Yes", "No"];

const commerceTail: CategoryFieldDef[] = [
  { id: "quantity", label: "Quantity", type: "number", required: true, order: 100, isMatchKey: false },
  { id: "purchasePrice", label: "Purchase price (₹)", type: "number", required: true, order: 101, isMatchKey: false },
  { id: "sellingPrice", label: "Selling price (₹)", type: "number", required: true, order: 102, isMatchKey: false },
  { id: "gstPercent", label: "GST %", type: "number", required: true, order: 103, isMatchKey: false },
  { id: "notes", label: "Notes", type: "textarea", required: false, order: 104, isMatchKey: false },
  { id: "purchaseDate", label: "Purchase date", type: "date", required: false, order: 105, isMatchKey: false },
];

export const DEFAULT_ERP_CATEGORIES: DefaultErpCategorySeed[] = [
  {
    name: "Laptop",
    slug: "laptop",
    sortOrder: 10,
    status: "active",
    fieldDefinitions: [
      { id: "brand", label: "Brand", type: "text", required: true, order: 0, isMatchKey: true },
      { id: "laptopModel", label: "Laptop model", type: "text", required: true, order: 1, isMatchKey: true },
      { id: "processor", label: "Processor", type: "text", required: true, order: 2, isMatchKey: true },
      { id: "ram", label: "RAM", type: "text", required: true, order: 3, isMatchKey: true },
      { id: "ssdHdd", label: "SSD / HDD", type: "text", required: true, order: 4, isMatchKey: true },
      { id: "gpu", label: "GPU", type: "text", required: false, order: 5, isMatchKey: false },
      { id: "displaySize", label: "Display size", type: "text", required: false, placeholder: 'e.g. 15.6"', order: 6, isMatchKey: false },
      { id: "color", label: "Color", type: "text", required: false, order: 7, isMatchKey: false },
      {
        id: "condition",
        label: "Condition",
        type: "select",
        required: true,
        options: condOpts,
        order: 8,
        isMatchKey: true,
      },
      { id: "serialNumber", label: "Serial number", type: "text", required: false, order: 9, isMatchKey: false },
      { id: "batteryHealth", label: "Battery health", type: "text", required: false, placeholder: "e.g. 85%", order: 10, isMatchKey: false },
      ...commerceTail.map((c, i) => ({ ...c, order: 11 + i })),
    ],
  },
  {
    name: "Desktop PC",
    slug: "desktop-pc",
    sortOrder: 20,
    status: "active",
    fieldDefinitions: [
      { id: "brand", label: "Brand", type: "text", required: true, order: 0, isMatchKey: true },
      { id: "cabinet", label: "Cabinet", type: "text", required: false, order: 1, isMatchKey: true },
      { id: "processor", label: "Processor", type: "text", required: true, order: 2, isMatchKey: true },
      { id: "ram", label: "RAM", type: "text", required: true, order: 3, isMatchKey: true },
      { id: "ssdHdd", label: "SSD / HDD", type: "text", required: true, order: 4, isMatchKey: true },
      { id: "gpu", label: "GPU", type: "text", required: false, order: 5, isMatchKey: false },
      { id: "motherboard", label: "Motherboard", type: "text", required: false, order: 6, isMatchKey: true },
      { id: "smps", label: "SMPS", type: "text", required: false, order: 7, isMatchKey: true },
      { id: "rgb", label: "RGB", type: "text", required: false, order: 8, isMatchKey: false },
      {
        id: "condition",
        label: "Condition",
        type: "select",
        required: true,
        options: condOpts,
        order: 9,
        isMatchKey: true,
      },
      ...commerceTail.map((c, i) => ({ ...c, order: 10 + i })),
    ],
  },
  {
    name: "Accessories",
    slug: "accessories",
    sortOrder: 30,
    status: "active",
    fieldDefinitions: [
      { id: "accessoryName", label: "Accessory name", type: "text", required: true, order: 0, isMatchKey: true },
      { id: "accessoryBrand", label: "Brand", type: "text", required: false, order: 1, isMatchKey: true },
      { id: "model", label: "Model", type: "text", required: true, order: 2, isMatchKey: true },
      { id: "color", label: "Color", type: "text", required: false, order: 3, isMatchKey: false },
      {
        id: "wireless",
        label: "Wireless",
        type: "select",
        required: false,
        options: yesNo,
        order: 4,
        isMatchKey: false,
      },
      { id: "warranty", label: "Warranty", type: "text", required: false, placeholder: "e.g. 1 year", order: 5, isMatchKey: false },
      ...commerceTail.map((c, i) => ({ ...c, order: 6 + i })),
    ],
  },
  {
    name: "Parts",
    slug: "parts",
    sortOrder: 40,
    status: "active",
    fieldDefinitions: [
      {
        id: "compatibleLaptopBrand",
        label: "Compatible laptop brand",
        type: "text",
        required: true,
        order: 0,
        isMatchKey: true,
      },
      {
        id: "compatibleLaptopModel",
        label: "Compatible laptop model",
        type: "text",
        required: true,
        order: 1,
        isMatchKey: true,
      },
      { id: "partName", label: "Part name", type: "text", required: true, order: 2, isMatchKey: true },
      { id: "partNumber", label: "Part number", type: "text", required: true, order: 3, isMatchKey: true },
      { id: "brand", label: "Brand", type: "text", required: false, order: 4, isMatchKey: false },
      {
        id: "condition",
        label: "Condition",
        type: "select",
        required: false,
        options: condOpts,
        order: 5,
        isMatchKey: true,
      },
      ...commerceTail.map((c, i) => ({ ...c, order: 6 + i })),
    ],
  },
];
