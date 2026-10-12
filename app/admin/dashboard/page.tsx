import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Admin Dashboard - Hulumart",
  description: "Hulumart admin dashboard.",
  alternates: { canonical: "https://www.hulumart.com/admin/dashboard" },
};

export default function Page() {
  return <PageClient />;
}