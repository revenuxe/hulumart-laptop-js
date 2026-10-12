import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Laptop & Desktop Repair Services - Hulumart",
  description: "Get your laptop or desktop repaired by certified technicians. Affordable rates and quick turnaround.",
  alternates: { canonical: "https://www.hulumart.com/repair" },
};

export default function Page() {
  return <PageClient />;
}