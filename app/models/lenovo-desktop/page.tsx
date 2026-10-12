import type { Metadata } from "next";
import { PageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Sell Lenovo Desktop | Best Price for Used Lenovo Desktop - Hulumart",
  description: "Sell your used device at the best price. Free doorstep pickup and instant cash payment from Hulumart.",
  alternates: { canonical: "https://www.hulumart.com/models/lenovo-desktop" },
};

export default function Page() {
  return <PageClient />;
}
