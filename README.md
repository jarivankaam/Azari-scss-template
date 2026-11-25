# Azari-scss-template

Custom SCSS setup built on Dart Sass (`@use` / `@forward` modules) and the
Bootstrap 5 grid, flexbox and CSS Grid styles.

## Getting started

```sh
npm install
npm run watch   # recompile on change (with source maps)
npm run build   # minified + expanded build, then checks dist for broken URLs
```

Output (`dist/` is git-ignored; it only exists in release tags):

| Source               | Minified                | Expanded (readable)              |
| -------------------- | ----------------------- | -------------------------------- |
| `scss/main.scss`     | `dist/css/main.css`     | `dist/css/main.expanded.css`     |
| `scss/checkout.scss` | `dist/css/checkout.css` | `dist/css/checkout.expanded.css` |

`npm run check` fails if the compiled CSS contains an `@import`, an external
URL, or a relative URL to a file that does not exist.

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
fonts/               self-hosted font files (committed, served by jsDelivr)
scripts/             copy-fonts.mjs (npm run fonts), check-dist.mjs (npm run check)
.github/workflows/   release.yml
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

## Fonts

All fonts are self-hosted in `fonts/` (no Google Fonts or other third-party
requests). The `@font-face` rules are in `scss/base/_fonts.scss` and are loaded
once per entry point. URLs are relative to `dist/css/` (`$fontPath:
"../../fonts"`), so they work both locally and from jsDelivr.

- **Poppins** 400–800, latin + latin-ext, from `@fontsource/poppins` (OFL).
- **Font Awesome 6 Free** (Regular, Solid, Brands) from
  `@fortawesome/fontawesome-free` (fonts: OFL, icons: CC BY 4.0). The existing
  family names are kept: `"Font Awesome 6 Pro"` maps weights 100–400 to
  Regular and 500–900 to Solid, `"Font Awesome 6 Duotone"` maps to Solid, and
  `$fontawesome` falls back to Solid for icons that Free Regular lacks. Light,
  Thin and Duotone are not part of Free and render as Regular/Solid.
  **Never add Font Awesome Pro files to this repo**: it is public, and so is
  everything jsDelivr serves from it.

To upgrade the fonts, update the npm package and run `npm run fonts`, then commit
`fonts/`.

## Using it from jsDelivr

```
https://cdn.jsdelivr.net/gh/jarivankaam/Azari-scss-template@<tag>/dist/css/main.css
https://cdn.jsdelivr.net/gh/jarivankaam/Azari-scss-template@<tag>/dist/css/checkout.css
```

For example:

```html
<link rel="stylesheet"
      href="https://cdn.jsdelivr.net/gh/jarivankaam/Azari-scss-template@v1.2.0/dist/css/main.css"
      integrity="sha384-…"
      crossorigin="anonymous">
```

Always pin an exact tag (`@v1.2.0`). Don't use `@main` or a version range
like `@1`: those are not in a tagged release, and their content (and SRI hash)
can change. Swap `.css` for `.expanded.css` to get the readable build.

### SRI (integrity hash)

Every GitHub release lists a ready-to-paste `<link>` tag with the `sha384`
integrity hash for each file. `crossorigin="anonymous"` is required for SRI.
jsDelivr sends `Access-Control-Allow-Origin: *`, which the fonts also need.
To compute a hash yourself:

```sh
curl -s https://cdn.jsdelivr.net/gh/jarivankaam/Azari-scss-template@v1.2.0/dist/css/main.css \
  | openssl dgst -sha384 -binary | openssl base64 -A
```

## Releasing

Day to day, only edit `scss/` and commit to `main`. Compiled CSS is never
committed to `main`.

1. Merge your changes to `main`.
2. Run the **Release** workflow, either from GitHub → Actions → Release → *Run workflow*
   (branch `main`, version e.g. `v1.2.0`), or:

   ```sh
   gh workflow run release.yml -f version=v1.2.0
   ```

The workflow runs `npm ci && npm run build` (including the URL check). It then
creates a release commit on top of `main` that adds `dist/css/`, tags it, pushes
**only the tag**, and publishes a GitHub release with the jsDelivr URLs and SRI
hashes. The release commit is not on any branch. That's intentional: jsDelivr
serves the tag, and `main` stays free of build output.

Tags are immutable. The workflow refuses to run if the tag already exists. To
fix a release, publish a new version instead of moving a tag (jsDelivr caches
tagged files permanently anyway). To make this enforced, add a tag ruleset
(Settings → Rules → Rulesets → target tags `v*`, restrict updates and
deletions; leave creation open so the workflow can tag).

Don't push `v*` tags by hand: a hand-made tag has no `dist/`, and jsDelivr will
return 404 for the CSS.
