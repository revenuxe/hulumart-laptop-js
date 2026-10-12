import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Contact Us - Hulumart | Get in Touch for Selling Your Laptop",
  description: "Contact Hulumart for queries about selling your used laptop or desktop. We're available via email, phone, and WhatsApp.",
  alternates: { canonical: "https://www.hulumart.com/contact" },
};

export default function Page() {
  return <PageClient />;
}