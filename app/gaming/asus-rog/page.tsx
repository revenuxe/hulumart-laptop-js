import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Sell ASUS ROG Gaming Laptop | Best Price - Hulumart",
  description: "Sell your used device at the best price. Free doorstep pickup and instant cash payment from Hulumart.",
  alternates: { canonical: "https://www.hulumart.com/gaming/asus-rog" },
};

export default function Page() {
  return <PageClient />;
}
