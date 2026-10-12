import { ArrowUpRight, Check, Laptop, ShieldCheck } from 'lucide-react';

export function BlogCover({ category, image, large = false }: { category: string; image?: string | null; large?: boolean }) {
  const buying = category === 'Buying Guide' || category === 'Comparison';
  return <div className={`relative flex w-full items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50 ${large ? 'min-h-[260px] sm:min-h-[340px]' : 'h-48'}`}>
    {image ? <img src={image} alt="" width={800} height={500} loading={large ? 'eager' : 'lazy'} className="absolute inset-0 h-full w-full object-cover" /> : <>
      <div aria-hidden="true" className="absolute h-56 w-56 rounded-full border border-blue-100 bg-white/60" />
      <img src="/assets/sell-laptop-cutout.webp" alt="" width={400} height={300} loading={large ? 'eager' : 'lazy'} className={`relative object-contain ${large ? 'h-60 w-80 p-4 sm:h-72' : 'h-40 w-56 p-3'}`} />
      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-xl border border-blue-100 bg-white px-3 py-2 text-[11px] font-medium text-slate-800 shadow-sm">{buying ? <ShieldCheck aria-hidden="true" className="h-4 w-4 text-emerald-600" /> : <Laptop aria-hidden="true" className="h-4 w-4 text-blue-600" />}{buying ? 'Choose with confidence' : 'A fresh start for your tech'}</div>
      <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-xl border border-emerald-100 bg-white px-3 py-2 text-[11px] text-slate-800 shadow-sm"><Check aria-hidden="true" className="h-4 w-4 text-emerald-600" />{buying ? 'Know what to check' : 'Know your next step'}<ArrowUpRight aria-hidden="true" className="h-3 w-3 text-blue-600" /></div>
    </>}
  </div>;
}
