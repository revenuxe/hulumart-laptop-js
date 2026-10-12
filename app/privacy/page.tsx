import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Privacy Policy - Hulumart",
  description: "Read Hulumart's privacy policy. We protect your personal data and information.",
  alternates: { canonical: "https://www.hulumart.com/privacy" },
};

export default function Page() {
  return <PageClient />;
}