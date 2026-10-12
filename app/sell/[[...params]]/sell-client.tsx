"use client";

import { useEffect, useLayoutEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Laptop, Monitor, Search } from "lucide-react";
import LoadingIndicator from "@/components/LoadingIndicator";
import { cachedCatalog } from "@/lib/catalog-cache";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SimpleForm from "@/components/SimpleForm";
import { ModelBookingCard } from "@/components/ModelBookingCard";
import { SellMethodSelector } from "@/components/SellMethodSelector";
import { supabase } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Category = "laptop" | "desktop";
type CatalogItem = { id: string; name: string; slug: string; logo_url?: string; image_url?: string; thumbnail_url?: string };

// Deterministic step derived from URL segments — the ONLY source of truth for navigation
type Step = "category" | "method" | "brand" | "series" | "model" | "booking";
function deriveStep(route: string[], catalog: boolean): Step {
  if (!route[0] || (route[0] !== "laptop" && route[0] !== "desktop")) return "category";
  if (!route[1] && !catalog) return "method";
  if (!route[1]) return "brand";
  if (!route[2]) return "series";
  if (!route[3]) return "model";
  return "booking";
}

export const SellClient = () => {
  const params = useParams() as { params?: string[] };
  const route = useMemo(() => Array.isArray(params.params) ? params.params : [], [params.params]);
  const router = useRouter();

  // catalog flag: whether user chose "Select device" from the method selector
  // (only relevant when there's no brand slug in the URL yet)
  const [catalog, setCatalog] = useState(Boolean(route[1]));
  const [formOpen, setFormOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Data arrays — fetched based on URL slugs
  const [brands, setBrands] = useState<CatalogItem[]>([]);
  const [series, setSeries] = useState<CatalogItem[]>([]);
  const [models, setModels] = useState<CatalogItem[]>([]);

  // Resolved objects — looked up from the fetched arrays
  const [brandObj, setBrandObj] = useState<CatalogItem | null>(null);
  const [seriesObj, setSeriesObj] = useState<CatalogItem | null>(null);
  const [modelObj, setModelObj] = useState<CatalogItem | null>(null);

  // Loading states — per data fetch
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingSeries, setLoadingSeries] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);

  // Derive current step from URL — deterministic, no flicker
  const categorySlug = (route[0] === "laptop" || route[0] === "desktop") ? route[0] as Category : null;
  const brandSlug = route[1] || null;
  const seriesSlug = route[2] || null;
  const modelSlug = route[3] || null;
  const urlStep = deriveStep(route, catalog);

  // Optimistic step override: set instantly on user click, before router.push takes effect.
  // This eliminates the 1-3 frame gap where useParams() still returns the old URL.
  const [stepOverride, setStepOverride] = useState<Step | null>(null);
  const step = stepOverride ?? urlStep;

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [step]);

  // Clear the override once the URL catches up
  useEffect(() => {
    if (stepOverride && urlStep === stepOverride) {
      setStepOverride(null);
    }
  }, [urlStep, stepOverride]);

  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const routeKey = route.join("/");
  const [resolvedRoute, setResolvedRoute] = useState<string | null>(null);
  const awaitingRoute = Boolean(stepOverride) || (Boolean(categorySlug) && resolvedRoute !== routeKey);
  const [loadingCatalog, setLoadingCatalog] = useState(Boolean(categorySlug));

  // Resolve the complete URL in one request sequence. Never leave a failed
  // lookup indistinguishable from a request that is still running.
  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    const timeout = window.setTimeout(() => {
      cancelled = true;
      controller.abort();
      setCatalogError("Loading took too long. Check your connection and try again, or request a callback.");
      setResolvedRoute(routeKey);
      setLoadingCatalog(false);
      setLoadingBrands(false); setLoadingSeries(false); setLoadingModels(false);
    }, 15000);
    setCatalogError(null);
    setBrands([]); setSeries([]); setModels([]);
    setBrandObj(null); setSeriesObj(null); setModelObj(null);
    setLoadingCatalog(Boolean(categorySlug));
    setLoadingBrands(Boolean(categorySlug));
    setLoadingSeries(Boolean(brandSlug));
    setLoadingModels(Boolean(seriesSlug));

    async function loadCatalog() {
      try {
        if (!categorySlug) return;
        const categoryResult = await cachedCatalog(`category:${categorySlug}`, () => supabase.from("categories").select("id").eq("slug", categorySlug).abortSignal(controller.signal).maybeSingle(), controller.signal);
        if (!categoryResult) throw new Error("This device category is not available. Please choose another category.");
        const brandResult = await cachedCatalog(`brands:${categoryResult.id}`, () => supabase.from("brands").select("id,name,slug,logo_url").eq("category_id", categoryResult.id).order("name").abortSignal(controller.signal), controller.signal);
        if (cancelled) return;
        const brandItems = (brandResult || []) as CatalogItem[];
        setBrands(brandItems);
        if (!brandSlug) return;
        const selectedBrand = brandItems.find(item => item.slug === brandSlug);
        if (!selectedBrand) throw new Error("This brand is not available in the selected category. Please choose your device again.");
        setBrandObj(selectedBrand);
        const seriesResult = await cachedCatalog(`series:${selectedBrand.id}`, () => supabase.from("series").select("id,name,slug,image_url").eq("brand_id", selectedBrand.id).order("name").abortSignal(controller.signal), controller.signal);
        if (cancelled) return;
        const seriesItems = (seriesResult || []) as CatalogItem[];
        setSeries(seriesItems);
        if (!seriesSlug) return;
        const selectedSeries = seriesItems.find(item => item.slug === seriesSlug);
        if (!selectedSeries) throw new Error("This series is no longer available. Please choose a series from the catalog.");
        setSeriesObj(selectedSeries);
        const modelResult = await cachedCatalog(`models:${selectedSeries.id}`, () => supabase.from("models").select("id,name,slug,thumbnail_url").eq("series_id", selectedSeries.id).eq("active", true).order("name").abortSignal(controller.signal), controller.signal);
        if (cancelled) return;
        const modelItems = (modelResult || []) as CatalogItem[];
        setModels(modelItems);
        if (!modelSlug) return;
        const selectedModel = modelItems.find(item => item.slug === modelSlug);
        if (!selectedModel) throw new Error("This model is no longer available for booking. Please choose an available model or request a callback.");
        setModelObj(selectedModel);
      } catch (error) {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : "";
        setCatalogError(message.startsWith("This ") ? message : "We couldn’t load the device catalog. Check your connection and try again, or request a callback.");
      } finally {
        window.clearTimeout(timeout);
        if (!cancelled) {
          setResolvedRoute(routeKey);
          setLoadingCatalog(false);
          setLoadingBrands(false); setLoadingSeries(false); setLoadingModels(false);
        }
      }
    }
    void loadCatalog();
    return () => { cancelled = true; window.clearTimeout(timeout); controller.abort(); };
  }, [categorySlug, brandSlug, seriesSlug, modelSlug, retryCount, routeKey]);

  // ── Navigation handlers ──
  // Set stepOverride FIRST so the UI updates instantly, then push to router.
  const pickCategory = (value: Category) => {
    setStepOverride("method");
    setCatalog(false);
    setSearch("");
    router.push(`/sell/${value}`);
  };
  const pickBrand = (value: CatalogItem) => {
    setLoadingSeries(true);
    setCatalogError(null);
    setStepOverride("series");
    setBrandObj(value);
    setSearch("");
    setCatalog(true);
    router.push(`/sell/${categorySlug}/${value.slug}`);
  };
  const pickSeries = (value: CatalogItem) => {
    setLoadingModels(true);
    setCatalogError(null);
    setStepOverride("model");
    setSeriesObj(value);
    setSearch("");
    router.push(`/sell/${categorySlug}/${brandSlug}/${value.slug}`);
  };
  const pickModel = (value: CatalogItem) => {
    setLoadingCatalog(true);
    setCatalogError(null);
    setStepOverride("booking");
    setModelObj(value);
    router.push(`/sell/${categorySlug}/${brandSlug}/${seriesSlug}/${value.slug}`);
  };
  const onEvaluate = () => { setStepOverride("brand"); setCatalog(true); };
  const onForm = () => { setFormOpen(true); };

  // ── Rendering helpers ──
  const loadingSpinner = <div className="col-span-full"><LoadingIndicator label="Finding your device options…" /><div aria-hidden="true" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <div key={i} className="h-36 rounded-2xl border bg-card p-4"><div className="mx-auto h-16 w-20 rounded-xl bg-muted motion-safe:animate-pulse" /><div className="mx-auto mt-4 h-3 w-24 rounded bg-muted motion-safe:animate-pulse" /></div>)}</div></div>;

  const catalogCards = (items: CatalogItem[], choose: (item: CatalogItem) => void, imageField: "logo_url" | "image_url" | "thumbnail_url", isLoading: boolean) => {
    const isBrand = imageField === "logo_url";
    const filtered = items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
    return (
      <div className={isBrand ? "grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6" : "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"}>
        {isLoading || awaitingRoute ? loadingSpinner : filtered.length === 0 ? (
          <div className="col-span-full py-10 text-center text-sm text-muted-foreground">
            {items.length === 0 ? "No options available." : "No results found."}
          </div>
        ) : filtered.map((item) => (
          <Card
            key={item.id}
            onClick={() => choose(item)}
            className={isBrand
              ? "flex h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-6 shadow-[0_3px_12px_rgba(15,23,42,0.13)] transition hover:-translate-y-0.5 hover:border-primary hover:shadow-lg"
              : "flex min-h-[124px] cursor-pointer flex-col justify-center p-3 transition hover:border-primary hover:shadow-md"
            }
          >
            {item[imageField] && (
              <div className={isBrand ? "mb-5 flex h-[72px] w-full items-center justify-center" : "mb-2 flex h-14 items-center justify-center"}>
                <img src={item[imageField]} alt={`${item.name} logo`} className={isBrand ? "max-h-[62px] max-w-[130px] object-contain" : "max-h-full max-w-[82%] object-contain"} />
              </div>
            )}
            <p className={isBrand ? "w-full truncate text-center text-[15px] font-medium text-black" : "truncate text-center text-sm font-semibold leading-tight sm:text-base"} title={item.name}>
              {item.name}
            </p>
          </Card>
        ))}
      </div>
    );
  };

  // ── Main render — step is derived from URL, never from nullable state combos ──
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/20 py-10">
        <div className="container max-w-7xl px-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Sell your device</h1>
            <p className="mt-2 text-muted-foreground">Quick, simple and convenient.</p>
          </div>

          {catalogError && <section role="alert" className="mx-auto mb-6 max-w-xl rounded-2xl border bg-card p-6 text-center"><h2 className="text-xl font-semibold">Let’s get your device selected</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{catalogError}</p><div className="mt-5 flex flex-wrap justify-center gap-3"><button type="button" className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground" onClick={() => setRetryCount(count => count + 1)}>Try again</button><button type="button" className="rounded-xl border px-4 py-3 text-sm font-semibold" onClick={() => { setStepOverride(null); setCatalog(true); router.push(categorySlug ? "/sell/" + categorySlug : "/sell"); }}>Choose another device</button><button type="button" className="rounded-xl border px-4 py-3 text-sm font-semibold" onClick={onForm}>Request a callback</button></div></section>}

          {step === "category" && (
            <div className="mx-auto grid max-w-xl gap-4 sm:grid-cols-2">
              <Card className="cursor-pointer p-8 text-center" onClick={() => pickCategory("laptop")}>
                <Laptop className="mx-auto mb-3 text-primary" /><b>Sell laptop</b>
              </Card>
              <Card className="cursor-pointer p-8 text-center" onClick={() => pickCategory("desktop")}>
                <Monitor className="mx-auto mb-3 text-primary" /><b>Sell desktop</b>
              </Card>
            </div>
          )}

          {step === "method" && categorySlug && (
            <SellMethodSelector category={categorySlug} onEvaluate={onEvaluate} onForm={onForm} />
          )}

          {step === "brand" && (
            <section>
              <h2 className="mb-5 text-xl font-bold">Choose brand</h2>
              {catalogCards(brands, pickBrand, "logo_url", loadingBrands)}
            </section>
          )}

          {step === "series" && (
            <section>
              <h2 className="mb-4 text-xl font-bold">
                Choose {brandObj?.name || brandSlug} series
              </h2>
              {catalogCards(series, pickSeries, "image_url", loadingSeries)}
            </section>
          )}

          {step === "model" && (
            <section>
              <h2 className="mb-4 text-xl font-bold">Choose model</h2>
              <div className="relative mb-5">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search model" />
              </div>
              {catalogCards(models, pickModel, "thumbnail_url", loadingModels)}
            </section>
          )}

          {!catalogError && !loadingCatalog && !awaitingRoute && step === "booking" && modelObj && brandObj && categorySlug && (
            <ModelBookingCard key={modelObj.id} category={categorySlug} brand={brandObj.name} model={modelObj.name} modelId={modelObj.id} modelImage={modelObj.image_url || modelObj.thumbnail_url} />
          )}
          {/* If booking step but objects not yet resolved from URL, show spinner */}
          {!catalogError && step === "booking" && (loadingCatalog || awaitingRoute) && (
            <div className="flex items-center justify-center py-20">
              <LoadingIndicator label="Preparing your booking…" />
            </div>
          )}

          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Get a quick callback</DialogTitle>
                <DialogDescription>Fill in your details and we&apos;ll contact you.</DialogDescription>
              </DialogHeader>
              <SimpleForm defaultSellingType={categorySlug || undefined} onSuccess={() => setFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </main>
      <Footer />
    </div>
  );
};
