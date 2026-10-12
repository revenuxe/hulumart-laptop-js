export default function LoadingIndicator({ label = "Loading your page…" }: { label?: string }) {
  return <div role="status" className="flex flex-col items-center gap-4 py-6">
    <img src="/assets/hulumart-logo.avif" width={160} height={32} alt="Hulumart" className="h-auto w-36" />
    <div aria-hidden="true" className="flex gap-1.5">{[0, 1, 2].map(i => <span key={i} className="h-1.5 w-1.5 rounded-full bg-primary motion-safe:animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />)}</div>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>;
}
