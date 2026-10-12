import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Sell ASUS Laptop | Best Price for Used ASUS Laptop - Hulumart",
  description: "Sell your used device at the best price. Free doorstep pickup and instant cash payment from Hulumart.",
  alternates: { canonical: "https://www.hulumart.com/models/asus-laptop" },
};

export default function Page() {
  return <PageClient />;
}
