import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Sell MacBook Air | Best Price for Used MacBook Air - Hulumart",
  description: "Sell your used device at the best price. Free doorstep pickup and instant cash payment from Hulumart.",
  alternates: { canonical: "https://www.hulumart.com/models/macbook-air" },
};

export default function Page() {
  return <PageClient />;
}
