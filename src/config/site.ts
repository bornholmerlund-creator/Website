/**
 * SITE CONFIG — single source of truth.
 * Rename the brand, swap contact details, or re-point analytics here.
 */
export const site = {
  name: "Northbound Data",
  legalName: "Northbound Data Ltd.",
  tagline: "ERP and data that hold under pressure.",
  description:
    "Northbound Data is a vendor-neutral ERP and data consultancy for mid-sized businesses. We fix the data before we touch the system — so your implementation launches on time, reconciles on day one, and earns trust across the business.",
  url: "https://www.northbounddata.com",
  email: "hello@northbounddata.com",
  phone: "+44 20 4538 1190",
  phoneHref: "+442045381190",
  location: "London · Copenhagen · Remote",
  founded: 2016,
  // Privacy-first analytics (Plausible). Leave empty to disable the snippet.
  analyticsDomain: "northbounddata.com",
  // Contact form endpoint (Formspree-compatible — works on static hosting).
  // Replace with your real endpoint id before launch.
  formEndpoint: "https://formspree.io/f/your-form-id",
  social: {
    linkedin: "https://www.linkedin.com/company/northbound-data",
  },
} as const;

export type NavItem = { label: string; href: string };

export const services: {
  slug: string;
  title: string;
  short: string;
  blurb: string;
}[] = [
  {
    slug: "erp-implementation",
    title: "ERP Implementation",
    short: "Launch a system that reconciles on day one.",
    blurb:
      "End-to-end delivery — selection, configuration, migration, and cutover — run by people who have done it before and stay accountable to the go-live date.",
  },
  {
    slug: "erp-optimization",
    title: "ERP Optimization",
    short: "Reclaim the value of the system you already own.",
    blurb:
      "Most ERPs run at a fraction of their capability. We audit configuration, processes, and adoption, then close the gaps that cost you hours and accuracy every week.",
  },
  {
    slug: "data-strategy",
    title: "Data Strategy & Architecture",
    short: "A blueprint your systems can actually be built on.",
    blurb:
      "We design the data model, ownership, and flow across your stack so every downstream report, integration, and decision starts from one trusted source.",
  },
  {
    slug: "data-governance",
    title: "Data Quality & Governance",
    short: "Make clean data the default, not a project.",
    blurb:
      "Ownership, validation rules, and stewardship that keep master data accurate after we leave — because 75% of ERP failures trace back to data nobody owned.",
  },
  {
    slug: "data-migration",
    title: "Data Migration",
    short: "Move decades of data without losing a record.",
    blurb:
      "A tested, reconciled, auditable migration — profiling, cleansing, mapping, and dry runs — so cutover weekend is boring, which is exactly what you want.",
  },
  {
    slug: "system-integration",
    title: "System Integration",
    short: "One connected stack instead of ten silos.",
    blurb:
      "We connect ERP, CRM, e-commerce, WMS, and finance with resilient, monitored integrations — no more re-keying, no more reconciliation by spreadsheet.",
  },
  {
    slug: "business-intelligence",
    title: "Business Intelligence",
    short: "Reporting leaders trust enough to act on.",
    blurb:
      "Governed metrics, clear definitions, and dashboards built on migrated, reconciled data — so the number in the boardroom matches the number on the floor.",
  },
];

export const mainNav: NavItem[] = [
  { label: "Services", href: "/services/" },
  { label: "Approach", href: "/approach/" },
  { label: "Industries", href: "/industries/" },
  { label: "Case Studies", href: "/case-studies/" },
  { label: "Insights", href: "/insights/" },
  { label: "About", href: "/about/" },
];

export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Services",
    items: services.map((s) => ({ label: s.title, href: `/services/${s.slug}/` })),
  },
  {
    heading: "Company",
    items: [
      { label: "Approach", href: "/approach/" },
      { label: "Industries", href: "/industries/" },
      { label: "Case Studies", href: "/case-studies/" },
      { label: "Insights", href: "/insights/" },
      { label: "About", href: "/about/" },
      { label: "Contact", href: "/contact/" },
    ],
  },
];
