// Copies the self-hosted font files from node_modules into fonts/ (committed).
// Run after upgrading @fontsource/poppins or @fortawesome/fontawesome-free:
//   npm run fonts
import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const copy = (fromDir, toDir, files) => {
  mkdirSync(toDir, { recursive: true });
  for (const file of files) copyFileSync(join(fromDir, file), join(toDir, file));
  console.log(`Copied ${files.length} file(s) to ${toDir}`);
};

const weights = [400, 500, 600, 700, 800];
const subsets = ["latin", "latin-ext"];
copy(
  "node_modules/@fontsource/poppins/files",
  "fonts/poppins",
  subsets.flatMap((s) => weights.map((w) => `poppins-${s}-${w}-normal.woff2`)),
);

copy("node_modules/@fortawesome/fontawesome-free/webfonts", "fonts/fontawesome", [
  "fa-brands-400.woff2",
  "fa-regular-400.woff2",
  "fa-solid-900.woff2",
]);
copy("node_modules/@fortawesome/fontawesome-free", "fonts/fontawesome", ["LICENSE.txt"]);
