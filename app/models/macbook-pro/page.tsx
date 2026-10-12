import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Sell MacBook Pro | Best Price for Used MacBook Pro - Hulumart",
  description: "Sell your used device at the best price. Free doorstep pickup and instant cash payment from Hulumart.",
  alternates: { canonical: "https://www.hulumart.com/models/macbook-pro" },
};

export default function Page() {
  return <PageClient />;
}
