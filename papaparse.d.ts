declare module "papaparse" {
  export function unparse(data: unknown[], options?: { quotes?: boolean }): string;
}
