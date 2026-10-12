import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "About Us - Hulumart | India's Trusted Platform for Selling Used Laptops",
  description: "Learn about Hulumart's mission to make selling used laptops and desktops easy, fast, and transparent. Trusted by thousands across Bangalore.",
  alternates: { canonical: "https://www.hulumart.com/about" },
};

export default function Page() {
  return <PageClient />;
}