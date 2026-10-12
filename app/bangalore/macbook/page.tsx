import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Sell MacBook in Bangalore | Best Price for Used MacBook - Hulumart",
  description: "Sell your used laptop at the best price with free doorstep pickup and instant cash payment.",
  alternates: { canonical: "https://www.hulumart.com/bangalore/macbook" },
};

export default function Page() {
  return <PageClient />;
}