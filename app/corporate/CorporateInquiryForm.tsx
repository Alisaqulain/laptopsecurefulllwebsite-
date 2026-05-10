"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function CorporateInquiryForm() {
  const [form, setForm] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
    qty: "",
    timeline: "Within 30 days",
    notes: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `🏢 Corporate Inquiry — LaptopSecure

Company: *${form.company}*
Contact: ${form.name}
Email: ${form.email}
Phone: ${form.phone}

Units required: *${form.qty}*
Timeline: ${form.timeline}

Notes:
${form.notes}`;
    window.open(buildWhatsAppLink(msg), "_blank", "noopener,noreferrer");
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl glass-strong border border-electric-500/20 p-7 md:p-12"
    >
      <SectionHeading
        align="left"
        title={
          <>
            Request a{" "}
            <span className="gradient-text">corporate quote</span>
          </>
        }
        subtitle="Fill in your requirements — our enterprise team will respond within 4 business hours."
      />

      <div className="mt-10 grid md:grid-cols-2 gap-5">
        <Field label="Company name" required>
          <Input
            required
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            placeholder="Acme Inc."
          />
        </Field>
        <Field label="Your name" required>
          <Input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Jane Doe"
          />
        </Field>
        <Field label="Work email" required>
          <Input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="jane@company.com"
          />
        </Field>
        <Field label="Phone" required>
          <Input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+91 ..."
          />
        </Field>
        <Field label="Number of units" required>
          <Input
            required
            type="number"
            min={1}
            value={form.qty}
            onChange={(e) => setForm({ ...form, qty: e.target.value })}
            placeholder="50"
          />
        </Field>
        <Field label="Timeline">
          <select
            value={form.timeline}
            onChange={(e) => setForm({ ...form, timeline: e.target.value })}
            className="flex h-11 w-full rounded-lg border border-border bg-secondary/40 px-4 py-2 text-sm text-foreground"
          >
            <option>Immediately</option>
            <option>Within 30 days</option>
            <option>1-3 months</option>
            <option>3-6 months</option>
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Project details">
          <Textarea
            rows={4}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Use-case, OS preference, configuration, delivery locations, etc."
          />
        </Field>
      </div>

      <Button type="submit" size="lg" className="mt-7 w-full md:w-auto">
        <Send className="h-5 w-5" />
        Send inquiry via WhatsApp
      </Button>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-semibold mb-2 block">
        {label}
        {required && <span className="text-electric-400"> *</span>}
      </label>
      {children}
    </div>
  );
}
