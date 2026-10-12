# Hulumart — Tech Resale & Repair Platform

India's most trusted platform for selling used laptops, desktops, and mobile phones with instant cash payment and free doorstep pickup. Built with Next.js 14, React 18, Tailwind CSS, and Supabase.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, SSR)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [ShadCN/UI](https://ui.shadcn.com/)
- **Backend & Auth**: [Supabase](https://supabase.com/)
- **State & Data**: React Query (TanStack), React Hook Form, Zod

## Getting Started

### Environment Setup

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://snnnurtjzdkjweoewrwf.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_2ZzR1h9_FXo-6P2Bq3Mf-w_2jhN4aHp
```

Use these same values in the hosting environment before rebuilding. Remove any old `NEXT_PUBLIC_SUPABASE_ANON_KEY` override. The new project needs the database schema, catalog data, storage buckets, and Edge Functions used by this app; changing the connection does not transfer them. Configure its Auth Site URL as `https://www.hulumart.com` and allow the site's sign-in redirect URLs.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

```bash
npm run build
npm run start
```
