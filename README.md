# RenoScope

RenoScope is a responsive renovation quote comparison dashboard for the 51 Bedok Ria Crescent project.

The app compares normalized totals, scope coverage, inclusions, risks, and contractor terms across CX Reno, Polibuild, and Essenwoods.

## Run locally

```bash
npm install
npm run dev
```

Build the production bundle with:

```bash
npm run build
```

## GitHub Pages

The repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml`. GitHub Pages should be configured to use **GitHub Actions** as its source. Pushes to `main` build and deploy the app automatically.

The source quote PDFs and `comparison.md` are intentionally excluded from version control.
