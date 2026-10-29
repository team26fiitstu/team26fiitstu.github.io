# Project website

Website of Team 26, FIIT STU. Built with [Astro](https://astro.build).

## Run locally

Requires Node 22 (`nvm use` picks it up from `.nvmrc`).

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in dist/
```

## Editing content

Most changes do not touch any component.

| What | Where |
|---|---|
| Team members, roles, photos | `src/data/team.yaml` (photos go to `public/team/`) |
| Progress timeline | `src/data/progress.yaml` |
| Website-managed reports and pending entries | `src/data/reports.yaml` (PDFs go to `public/docs/`) |
| Website-managed documents | `src/data/documents.yaml` (PDFs go to `public/docs/`) |
| LaTeX documents published from `naomi-documents` | `public/documents.json` and PDF files in `public/docs/` (generated automatically) |
| Interface texts in English / Slovak | `src/i18n/en.json`, `src/i18n/sk.json` |
| Email, team number, map location | `src/site.ts` |

Each YAML file explains its fields at the top. Entries appear on the site in the order they are written.

Adding a report:

```yaml
- id: sprint-02
  kind: sprint
  date: 2026-11-10
  file: docs/sprint-02.pdf
  title:
    en: Sprint 02 report
    sk: Správa zo šprintu 02
```

## Structure

```
src/
  assets/             logos and the hero animation used on the site
  components/         page sections (Hero, Progress, Team, Contact, ...)
  data/               content in YAML
  i18n/               translation dictionaries
  layouts/            HTML skeleton
  lib/                helpers
  pages/              routes: / (English) and /sk/ (Slovak)
  styles/             design tokens and base styles
  content.config.ts   schemas of the YAML files
brand/                source files of logos, fonts and illustrations (not used by the build)
```

## Deployment

Every push to `main` builds and publishes the site via `.github/workflows/deploy.yml`.

The documents repository compiles LaTeX, updates `public/documents.json` and its PDFs here, and commits only changed generated files. The index supplies the name, type, date, and PDF link; the Astro build groups documents by type. `src/data/documents.yaml` and `src/data/reports.yaml` retain entries maintained directly on the website. Do not duplicate a generated document in these YAML files.

Website pull requests run `.github/workflows/validate.yml`. Locally, run `npm run check:documents` to verify every local PDF link and the generated index before `npm run build`.
