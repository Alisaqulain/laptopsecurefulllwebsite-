import { siteConfig } from "@/lib/config";

export type InvoicePrintBranding = {
  company: {
    name: string;
    logoUrl: string | null;
    address: string;
    gstNumber: string | null;
    phone: string | null;
    email: string | null;
  };
  invoice: {
    terms: string[];
    signatureLabel: string;
  };
};

type SettingsLean = {
  company?: {
    name?: string | null;
    logoUrl?: string | null;
    address?: string | null;
    gstNumber?: string | null;
    phone?: string | null;
    email?: string | null;
  } | null;
  invoice?: {
    terms?: string[] | null;
    signatureLabel?: string | null;
  } | null;
} | null;

export function buildInvoicePrintBranding(doc: SettingsLean): InvoicePrintBranding {
  const c = doc?.company;
  const inv = doc?.invoice;
  const name = (c?.name?.trim() || siteConfig.name) as string;
  const logoFromDb = c?.logoUrl?.trim();
  const defaultLogo = (siteConfig.logo as string)?.trim();
  return {
    company: {
      name,
      logoUrl: logoFromDb || defaultLogo || null,
      address: (c?.address?.trim() || siteConfig.contact.address) as string,
      gstNumber: c?.gstNumber?.trim() || null,
      phone: (c?.phone?.trim() || siteConfig.contact.phone) || null,
      email: (c?.email?.trim() || siteConfig.contact.email) || null,
    },
    invoice: {
      terms:
        Array.isArray(inv?.terms) && inv.terms.length > 0
          ? inv.terms.map((t) => String(t).trim()).filter(Boolean)
          : ["Goods once sold will not be taken back.", "Warranty as per manufacturer policy."],
      signatureLabel: inv?.signatureLabel?.trim() || "Authorized Signatory",
    },
  };
}
