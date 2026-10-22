import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';
import { parse } from 'yaml';

// keep yaml order
const ordered = (path: string) =>
  file(path, {
    parser: (text) => parse(text).map((entry: object, order: number) => ({ ...entry, order })),
  });

const localized = z.object({ en: z.string(), sk: z.string() });

// no file = pending
const document = {
  order: z.number(),
  title: localized,
  date: z.coerce.date().optional(),
  file: z.string().optional(),
  label: z.string().optional(),
};

const team = defineCollection({
  loader: ordered('src/data/team.yaml'),
  schema: z.object({
    order: z.number(),
    titleBefore: z.string().optional(),
    name: z.string(),
    surname: z.string(),
    titleAfter: z.string().optional(),
    role: localized,
    photo: z.string().optional(),
  }),
});

const progress = defineCollection({
  loader: ordered('src/data/progress.yaml'),
  schema: z.object({
    order: z.number(),
    title: localized,
    semester: z.enum(['winter', 'summer']),
    week: z.number().int().positive(),
    status: z.enum(['done', 'current', 'planned']),
  }),
});

const reports = defineCollection({
  loader: ordered('src/data/reports.yaml'),
  schema: z.object({ ...document, kind: z.enum(['sprint', 'meeting', 'other']) }),
});

const documents = defineCollection({
  loader: ordered('src/data/documents.yaml'),
  schema: z.object({ ...document, group: z.enum(['methodology', 'analysis', 'deliverable']) }),
});

export const collections = { team, progress, reports, documents };
