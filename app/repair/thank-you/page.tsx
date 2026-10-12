import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Repair Request Submitted - Hulumart",
  description: "Your repair request has been submitted successfully.",
  alternates: { canonical: "https://www.hulumart.com/repair/thank-you" },
};

export default function Page() {
  return <PageClient />;
}