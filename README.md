# Keelstone — ERP & Data Consultancy Website

A premium, production-ready B2B marketing site for a vendor-neutral ERP and data
consultancy serving mid-sized businesses. Built with **Astro 5 + Tailwind CSS v4**.

> **Brand is configurable.** All brand, contact, navigation and analytics settings
> live in [`src/config/site.ts`](src/config/site.ts). Change the company name,
> email, phone, and Formspree/Plausible IDs there — no need to touch the pages.

---

## Quick start

```bash
npm install
npm run dev        # local dev server at http://localhost:4321
npm run build      # production build to ./dist
npm run preview    # preview the production build
npm run check      # TypeScript / Astro diagnostics
```

Node 22+ required.

---

## Tech stack & rationale

| Layer | Choice | Why |
|---|---|---|
| Framework | Astro 5 | Content/SEO site → zero JS by default, fast LCP, file-based routing. |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) | Design tokens in CSS `@theme`, no runtime. |
| Content | Astro Content Collections (Markdown) | Case studies & insights are typed, git-versioned content — no CMS to run. |
| Forms | Formspree-compatible endpoint | Works on static hosting; no backend to maintain. |
| Analytics | Plausible (config-gated) | Privacy-first, cookieless, lightweight. |
| Hosting | Vercel/Netlify static + `@astrojs/sitemap` | Zero-config, global CDN, instant rollback. |

**Rejected:** Next.js (SSR/RSC unnecessary), React SPA (poor SEO), Supabase/Postgres
(no app data or auth — a contact form doesn't justify a DB), headless CMS (cost & ops
overhead for content one team edits via git).

---

## Project structure

```
src/
  config/site.ts            ← brand, nav, contact, analytics (single source of truth)
  data/services.ts          ← full editorial copy for all 7 services
  content/
    config.ts               ← content-collection schemas
    caseStudies/*.md         ← case studies (typed front-matter)
    insights/*.md            ← blog/insight articles
  layouts/BaseLayout.astro   ← <head>, SEO meta, OG, JSON-LD, fonts, analytics, skip-link
  components/                ← Header, Footer, Hero, StatBand, ServiceCard, FAQ, CTABand…
  pages/                     ← file-based routes (see sitemap below)
  styles/global.css          ← design tokens + base styles
public/                      ← favicon.svg, og-default.svg, robots.txt
```

## Sitemap

```
/                              Home
/services/                     Services hub
/services/[slug]/              7 service pages (dynamic, from data/services.ts)
/approach/                     Methodology
/industries/                   Sector focus
/case-studies/  + /[slug]/     Case-study index + details (content collection)
/insights/      + /[slug]/     Insights index + articles (content collection)
/about/                        About
/contact/                      Contact + working-session form
/privacy/                      Privacy notice (noindex)
/404                           Custom 404
sitemap-index.xml · robots.txt
```

---

## Brand positioning (summary)

- **Name:** Keelstone — structural stability ("keel" + "keystone"); premium, ownable, vendor-neutral.
- **Tagline:** *ERP and data that hold under pressure.*
- **UVP:** We fix the data before we touch the system — so your ERP launches on time,
  reconciles on day one, and earns trust from the floor to the boardroom.
- **Voice:** Precise, senior, plain-spoken. Banned: "synergy," "leverage," "best-in-class."
  Lead with numbers and consequences.

---

## SEO strategy

**Positioning keyword clusters** (target both ERP-implementation and data-optimization intent):

1. **ERP implementation** — `erp implementation consulting`, `erp implementation partner`,
   `mid-market erp implementation`, `erp go-live`, `erp cutover`.
2. **ERP optimization** — `erp optimization`, `erp health check`, `optimize or replace erp`,
   `erp not being used`.
3. **Data migration** — `erp data migration`, `data migration consulting`,
   `legacy data migration`, `data migration reconciliation`.
4. **Data governance/quality** — `data governance consulting`, `master data management`,
   `data quality`, `mid-sized business data governance`.
5. **Architecture & BI** — `data strategy consulting`, `data architecture`,
   `business intelligence consulting`, `system integration erp`.

**On-page implementation:**
- Unique `<title>` + meta description per page (set in each page; defaults in `BaseLayout`).
- Canonical URLs, Open Graph + Twitter cards, default OG image.
- JSON-LD: `ProfessionalService` (sitewide), `Service` + `FAQPage` (service pages),
  `FAQPage` (home), `Article`/`BlogPosting` (case studies & insights).
- Auto-generated `sitemap-index.xml`; `robots.txt` references it.
- Semantic headings (one `<h1>` per page), descriptive link text.

**Internal linking:** Home → services hub → each service → related services + case studies +
CTA. Case studies tag the services used; insights map to service clusters. Every page funnels to `/contact/`.

**Content expansion opportunities (roadmap):** per-platform pages (NetSuite, Business Central,
SAP B1), per-industry deep dives, comparison pages ("optimise vs replace"), a glossary,
and a steady insights cadence targeting long-tail queries.

---

## Design system

- **Type:** Fraunces (serif headings) + Inter (UI/body); modular 1.25 scale.
- **Color:** Ink navy `#0b1f33`, Signal teal `#0fb5a6`, warm Sand neutrals. AA+ contrast.
- **Spacing:** 8-point rhythm, generous whitespace.
- **Components:** Header, Footer, Hero/PageHero, Section, Eyebrow, Button, StatBand,
  ServiceCard, ProcessStep, FAQ, CaseStudyCard, CTABand.
- **A11y (WCAG 2.2 AA):** skip link, semantic landmarks, `:focus-visible` rings,
  `prefers-reduced-motion`, labelled form fields, `aria-current` nav state.
- **Responsive:** mobile-first; disclosure-based mobile menu; fluid grids at `md`/`lg`.

---

## Forms & analytics setup (before launch)

1. **Contact form** — create a [Formspree](https://formspree.io) form and set
   `formEndpoint` in `src/config/site.ts`. Includes a honeypot field and JS-enhanced
   submit with a no-JS native fallback.
2. **Analytics** — `analyticsDomain` in `site.ts` enables the Plausible snippet. Clear
   it to disable. Swap for GA4/Fathom if preferred.

---

## Testing

- `npm run build` — all 22 pages build clean.
- `npm run check` — 0 errors.
- **Manual/Playwright (recommended pre-launch):** the Playwright MCP was not available in
  the build environment, so cross-browser E2E was not automated here. Run
  Lighthouse + axe + Playwright against the preview build before go-live (see checklist).

---

## Launch checklist

- [ ] Set real brand name/contact in `src/config/site.ts`
- [ ] Point `PUBLIC_SITE_URL` / `site` to the production domain
- [ ] Create Formspree form, set `formEndpoint`; send a test submission
- [ ] Confirm Plausible (or chosen analytics) domain
- [ ] Replace placeholder case-study clients/metrics with approved, real ones
- [ ] Legal review of `/privacy/` and add cookie/terms pages if required
- [ ] Replace SVG OG image with a branded raster (1200×630) if desired
- [ ] Run Lighthouse (target 95+ Perf/SEO/Best-Practices/A11y)
- [ ] Run axe / keyboard-only pass; verify focus order and skip link
- [ ] Cross-browser + mobile device check via Playwright
- [ ] Verify `sitemap-index.xml` and `robots.txt` on the live domain
- [ ] Submit sitemap to Google Search Console; verify domain
- [ ] Set up 301s from any legacy URLs
- [ ] Configure hosting (Vercel/Netlify config included)

---

## Deployment

**Vercel:** import the repo — `vercel.json` sets build command, output dir, clean URLs.
**Netlify:** `netlify.toml` sets `npm run build` → `dist` on Node 22.
Static output deploys to any CDN/static host.

---

## Future roadmap

1. **Phase 1 (launch):** real content/clients, form + analytics live, Search Console.
2. **Phase 2 (SEO depth):** platform & industry landing pages, comparison pages, glossary,
   2–4 insights/month on long-tail queries.
3. **Phase 3 (conversion):** A/B test hero & CTA copy, add testimonial/logo proof,
   gated diagnostic ("ERP health-check scorecard") as a lead magnet.
4. **Phase 4 (scale):** lightweight CMS (Keystatic/Decap on top of the collections) if
   non-technical editors need it; localisation (EN/DA) given the Nordic footprint;
   case-study video.
```
