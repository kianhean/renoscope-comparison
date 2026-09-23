# RenoScope

RenoScope is a responsive renovation quote comparison dashboard for a residential renovation project.

The app compares quoted totals, illustrative scope-gap allowances, inclusions, risks, and contractor terms across CX Reno, Kang Sheng, Polibuild, and Essenwoods. It standardizes the home's sole bathroom as the Main Ensuite. The tile-material calculator starts at $6/sqft and lets you enter a different price and measured Main Ensuite/balcony tile areas. “Export view” opens a two-page A4 print report using the current calculator inputs.

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
