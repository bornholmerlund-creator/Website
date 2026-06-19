import { defineCollection, z } from "astro:content";

const caseStudies = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    client: z.string(),
    industry: z.string(),
    services: z.array(z.string()),
    summary: z.string(),
    metric: z.string(),
    metricLabel: z.string(),
    results: z.array(z.object({ value: z.string(), label: z.string() })),
    order: z.number().default(99),
    publishDate: z.coerce.date(),
  }),
});

const insights = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string().default("Keelstone"),
    publishDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { caseStudies, insights };
