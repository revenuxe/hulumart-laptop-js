import type { Metadata } from "next";
import { TrackClient } from "./track-client";

export const metadata: Metadata = {
  title: "Track Your Order - Hulumart",
  description: "Track the status of your sell order on Hulumart.",
};

export default function TrackPage() {
  return <TrackClient />;
}