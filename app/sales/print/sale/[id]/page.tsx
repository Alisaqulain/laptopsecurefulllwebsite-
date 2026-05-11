"use client";

import { use } from "react";
import { SalePrintContent } from "@/components/erp/SalePrintContent";

export default function SalesPrintSalePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <SalePrintContent saleId={id} />;
}
