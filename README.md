# How Much Tho?

A free, no-signup web app that turns an amount of money into tangible comparisons — bottles of water, biryani plates, ambulances, hospital days, and more.

## Stack

- React + Vite + TypeScript
- Tailwind CSS v4
- Framer Motion (count-ups & transitions)
- [Frankfurter](https://www.frankfurter.app/) for live ECB exchange rates
- Static JSON reference dataset (`data/reference-values.json`)

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Updating reference values

Edit `data/reference-values.json` (v1.1+). Each category has a `global_default` and optional per-country `regions` entries with `value`, `currency`, `unit_label`, `source`, and `last_updated`. Unlisted countries fall back to the global default.

**v1 categories:** bottled water, trees, football pitches, schools, hospital bed-days, cancer surgeries, syringes, first aid kits, ambulances, biryani plates.

Prices that vary by state/city use curated **national averages**, clearly labeled as estimates.
