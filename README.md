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
| Sprint reports, meeting minutes | `src/data/reports.yaml` (PDFs go to `public/docs/`) |
| Methodologies and other documents | `src/data/documents.yaml` (PDFs go to `public/docs/`) |
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
