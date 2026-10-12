import { unstable_cache } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const catalogMetadataName = unstable_cache(async (table: "brands" | "series" | "models", slug: string) => {
  const { data, error } = await createServerSupabaseClient().from(table).select("name").eq("slug", slug).abortSignal(AbortSignal.timeout(5000)).maybeSingle();
  if (error) throw new Error("Catalog metadata unavailable");
  return data?.name ?? null;
}, ["catalog-metadata-name"], { revalidate: 60 });
