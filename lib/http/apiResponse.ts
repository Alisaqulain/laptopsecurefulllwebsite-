import { NextResponse } from "next/server";
import { z } from "zod";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true as const, data }, init);
}

export function fail(message: string, init?: ResponseInit & { code?: string; details?: unknown }) {
  const status = init?.status ?? 400;
  return NextResponse.json(
    { ok: false as const, error: { message, code: init?.code, details: init?.details } },
    { status, headers: init?.headers },
  );
}

export function zodFail(err: z.ZodError, status: number = 422) {
  return fail("Validation error", { status, code: "VALIDATION_ERROR", details: err.flatten() });
}

