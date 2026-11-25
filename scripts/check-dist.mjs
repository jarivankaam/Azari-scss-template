// Fails if the compiled CSS contains anything that would break when served
// from jsDelivr: external URLs, CSS @import, or relative URLs to missing files.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const cssDir = "dist/css";
const files = readdirSync(cssDir).filter((f) => f.endsWith(".css"));
const problems = [];

for (const file of files) {
  const css = readFileSync(join(cssDir, file), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  if (/@import/i.test(css)) problems.push(`${file}: contains @import`);
  for (const [, raw] of css.matchAll(/url\(\s*([^)]*?)\s*\)/gi)) {
    const url = raw.replace(/^["']|["']$/g, "");
    if (url.startsWith("data:") || url.startsWith("#")) continue;
    if (/^([a-z]+:)?\/\//i.test(url) || url.startsWith("/")) {
      problems.push(`${file}: external/absolute URL ${url}`);
      continue;
    }
    const target = resolve(dirname(join(cssDir, file)), url.split(/[?#]/)[0]);
    if (!existsSync(target)) problems.push(`${file}: missing file ${url}`);
  }
}

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`OK: ${files.join(", ")} contain no external or broken URLs.`);
