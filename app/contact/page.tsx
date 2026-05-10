import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { ContactForm } from "./ContactForm";
import { ContactInfo } from "./ContactInfo";

export const metadata: Metadata = {
  title: "Contact LaptopSecure — Call, WhatsApp, or Visit",
  description:
    "Talk to our laptop experts via WhatsApp, phone, or email. Visit our flagship store in Gurugram or schedule a free pickup from your home.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        title={
          <>
            Let's talk{" "}
            <span className="gradient-text">tech.</span>
          </>
        }
        subtitle="Buy, sell, repair, or just say hi — our team is here, 7 days a week. Average response time: under 5 minutes."
        breadcrumbs={[{ name: "Contact" }]}
      />

      <section className="container pb-24 grid lg:grid-cols-2 gap-10">
        <ContactInfo />
        <ContactForm />
      </section>
    </>
  );
}
