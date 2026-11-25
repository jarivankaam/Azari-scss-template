# Azari-scss-template

Custom SCSS setup built on Dart Sass (`@use` / `@forward` modules) and the
Bootstrap 5 grid, flexbox and CSS Grid styles.

## Getting started

```sh
npm install
npm run watch   # recompile on change (with source maps)
npm run build   # compressed production build
```

Output:

| Source              | Output                  |
| ------------------- | ----------------------- |
| `scss/main.scss`     | `dist/css/main.css`     |
| `scss/checkout.scss` | `dist/css/checkout.css` |

Open `index.html` for a quick grid / flex preview.

## Structure

```
scss/
├── abstracts/       variables (no CSS output) — load with @use "<path>/abstracts" as *;
├── vendors/
│   ├── _bootstrap.scss  Bootstrap grid, CSS Grid, display/flex/gap/spacing utilities
│   └── _swiper.scss
├── base/            fonts, base, text, buttons, form, icons, tables, grid extras, media queries
├── template-parts/  sections and parts per feature (hero, product, cart, …)
├── checkout/        checkout-only base, global and template parts
├── main.scss        main entry point
└── checkout.scss    checkout entry point
```

## Bootstrap

Only the grid-related parts of Bootstrap are compiled (see
`scss/vendors/_bootstrap.scss`):

- containers, `.row`, `.col-*`, offsets, gutters (`g-*`, incl. the extra
  `g-4-s`, `g-6`, `g-7`, `g-8`)
- CSS Grid (`.grid`, `.g-col-*`, `.g-start-*`)
- utilities: display, flex, order, justify/align, gap, margin and padding

Bootstrap is installed from npm, so it can be updated with `npm update bootstrap`.
It still uses `@import` internally; its deprecation warnings are silenced in the
npm scripts (`--quiet-deps --silence-deprecation=import`).

Theme additions to the grid (`.flex`, `.col-lg-20/25`, `.pt-100/150`,
`.text-*`) live in `scss/base/_grid-extras.scss`.

## Adding a partial

1. Create `scss/template-parts/<feature>/_my-part.scss`.
2. If it uses variables, start it with `@use "../../abstracts" as *;`.
3. Add `@use "template-parts/<feature>/my-part";` to `main.scss`.
