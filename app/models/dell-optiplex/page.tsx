import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Sell Dell OptiPlex | Best Price for Used Dell Desktop - Hulumart",
  description: "Sell your used device at the best price. Free doorstep pickup and instant cash payment from Hulumart.",
  alternates: { canonical: "https://www.hulumart.com/models/dell-optiplex" },
};

export default function Page() {
  return <PageClient />;
}
