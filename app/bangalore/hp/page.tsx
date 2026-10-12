import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Sell HP Laptop in Bangalore | Best Price - Hulumart",
  description: "Sell your used laptop at the best price with free doorstep pickup and instant cash payment.",
  alternates: { canonical: "https://www.hulumart.com/bangalore/hp" },
};

export default function Page() {
  return <PageClient />;
}