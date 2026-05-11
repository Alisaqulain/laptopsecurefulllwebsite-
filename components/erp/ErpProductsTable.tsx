"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErpPanel } from "@/components/erp/ErpPanel";
import { formatPrice } from "@/lib/utils";

type PopulatedCategory = { _id: string; name: string; slug?: string };

type Product = {
  _id: string;
  sku: string;
  name: string;
  categoryId?: string | PopulatedCategory;
  attributes?: Record<string, unknown>;
  brand?: string;
  status: string;
  pricing?: { sellingPrice: number; purchasePriceAvg?: number };
  stock?: { onHand: number; lowStockThreshold?: number };
};

const columnHelper = createColumnHelper<Product>();

function categoryName(p: Product) {
  const c = p.categoryId;
  if (c && typeof c === "object" && "name" in c) return (c as PopulatedCategory).name;
  return "—";
}

function specsSummary(p: Product) {
  const a = p.attributes;
  if (!a || typeof a !== "object") return "—";
  const entries = Object.entries(a).filter(([, v]) => v !== undefined && v !== null && v !== "");
  if (entries.length === 0) return "—";
  return entries
    .slice(0, 6)
    .map(([k, v]) => `${k}: ${String(v)}`)
    .join(" · ");
}

function stockLabel(onHand: number, threshold: number) {
  if (onHand <= 0) return "Out";
  if (onHand <= threshold) return "Low";
  return "OK";
}

export function ErpProductsTable({
  showCost = true,
  showSellingPrice = true,
  readOnly = false,
}: {
  showCost?: boolean;
  /** When false, list/selling amounts are hidden (e.g. sales staff stock view). */
  showSellingPrice?: boolean;
  readOnly?: boolean;
}) {
  const [rows, setRows] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    (async () => {
      setLoading(true);
      const url = new URL("/api/products", window.location.origin);
      if (q.trim()) url.searchParams.set("q", q.trim());
      const res = await fetch(url.toString(), { cache: "no-store" });
      const json = (await res.json().catch(() => null)) as any;
      setRows(res.ok ? json?.data?.products ?? [] : []);
      setLoading(false);
    })();
  }, [q]);

  const columns = useMemo(
    () => [
      ...(readOnly
        ? []
        : [
            columnHelper.display({
              id: "select",
              header: ({ table }) => (
                <input
                  type="checkbox"
                  checked={table.getIsAllPageRowsSelected()}
                  onChange={table.getToggleAllPageRowsSelectedHandler()}
                />
              ),
              cell: ({ row }) => (
                <input type="checkbox" checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />
              ),
              size: 36,
            }),
          ]),
      columnHelper.accessor("sku", { header: "SKU", cell: (i) => <span className="font-mono text-xs">{i.getValue()}</span> }),
      columnHelper.accessor("name", { header: "Product" }),
      columnHelper.accessor((r) => categoryName(r), {
        id: "category",
        header: "Category",
        cell: (i) => <span className="text-xs">{i.getValue()}</span>,
      }),
      columnHelper.accessor((r) => specsSummary(r), {
        id: "specs",
        header: "Attributes",
        cell: (i) => (
          <span className="max-w-[240px] truncate text-xs text-muted-foreground" title={i.getValue()}>
            {i.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("brand", { header: "Brand", cell: (i) => i.getValue() ?? "—" }),
      columnHelper.accessor((r) => r.stock?.onHand ?? 0, {
        id: "stock",
        header: () => <span className="block text-right">Stock</span>,
        cell: (i) => <span className="tabular-nums">{i.getValue()}</span>,
      }),
      columnHelper.accessor((r) => stockLabel(r.stock?.onHand ?? 0, r.stock?.lowStockThreshold ?? 2), {
        id: "level",
        header: "Level",
        cell: (i) => {
          const v = i.getValue();
          const cls = v === "Out" ? "text-destructive" : v === "Low" ? "text-amber-700" : "text-muted-foreground";
          return <span className={`text-xs font-medium ${cls}`}>{v}</span>;
        },
      }),
      ...(showSellingPrice
        ? [
            columnHelper.accessor((r) => r.pricing?.sellingPrice ?? 0, {
              id: "price",
              header: () => <span className="block text-right">Selling</span>,
              cell: (i) => <span className="tabular-nums">{formatPrice(i.getValue())}</span>,
            }),
          ]
        : []),
      ...(showCost
        ? [
            columnHelper.accessor((r) => r.pricing?.purchasePriceAvg ?? 0, {
              id: "cost",
              header: () => <span className="block text-right">Avg cost</span>,
              cell: (i) => <span className="tabular-nums">{formatPrice(i.getValue())}</span>,
            }),
          ]
        : []),
      columnHelper.accessor("status", { header: "Status" }),
    ],
    [showCost, showSellingPrice, readOnly],
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: !readOnly,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } },
    getRowId: (r) => r._id,
  });

  function exportCsv() {
    const data = table.getSelectedRowModel().rows.length ? table.getSelectedRowModel().rows.map((r) => r.original) : rows;
    const flat = data.map((p) => {
      const row: Record<string, string | number> = {
        sku: p.sku,
        name: p.name,
        category: categoryName(p),
        specs: specsSummary(p),
        brand: p.brand ?? "",
        stock: p.stock?.onHand ?? 0,
        status: p.status,
      };
      if (showSellingPrice) row.selling = p.pricing?.sellingPrice ?? 0;
      if (showCost) row.cost = p.pricing?.purchasePriceAvg ?? 0;
      return row;
    });
    const csv = Papa.unparse(flat);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "products.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function exportExcel() {
    const data = table.getSelectedRowModel().rows.length ? table.getSelectedRowModel().rows.map((r) => r.original) : rows;
    const flat = data.map((p) => {
      const row: Record<string, string | number> = {
        sku: p.sku,
        name: p.name,
        category: categoryName(p),
        specs: specsSummary(p),
        brand: p.brand ?? "",
        stock: p.stock?.onHand ?? 0,
        status: p.status,
      };
      if (showSellingPrice) row.selling = p.pricing?.sellingPrice ?? 0;
      if (showCost) row.cost = p.pricing?.purchasePriceAvg ?? 0;
      return row;
    });
    const ws = XLSX.utils.json_to_sheet(flat);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "products.xlsx");
  }

  function bulkDelete() {
    const ids = table.getSelectedRowModel().rows.map((r) => r.original._id);
    if (!ids.length) return;
    alert(`Bulk delete for ${ids.length} row(s) — connect DELETE /api/products/bulk when ready.`);
  }

  return (
    <ErpPanel>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-md flex-1">
          <Input className="h-9" placeholder="Search products…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        {!readOnly ? (
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={exportCsv}>
              Export CSV
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={exportExcel}>
              Export Excel
            </Button>
            <Button type="button" variant="destructive" size="sm" onClick={bulkDelete}>
              Bulk delete
            </Button>
          </div>
        ) : null}
      </div>

      <div className="mt-4 overflow-x-auto rounded-md border border-border">
        {loading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading…</div>
        ) : (
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="bg-muted/80 text-xs uppercase text-muted-foreground">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th key={h.id} className="px-3 py-2 font-medium" style={{ width: h.getSize() }}>
                      {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t border-border hover:bg-muted/30">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-2 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Prev
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </ErpPanel>
  );
}
