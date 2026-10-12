import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Terms of Service - Hulumart",
  description: "Read Hulumart's terms of service for selling used laptops and desktops.",
  alternates: { canonical: "https://www.hulumart.com/terms" },
};

export default function Page() {
  return <PageClient />;
}