import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Admin Login - Hulumart",
  description: "Hulumart admin login portal.",
  alternates: { canonical: "https://www.hulumart.com/admin" },
};

export default function Page() {
  return <PageClient />;
}