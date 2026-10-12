import SellingLanding from "@/components/SellingLanding";
import { sellingLandings } from "@/lib/selling-landings";

export function PageClient() {
  return <SellingLanding data={sellingLandings["bangalore"]} />;
}
