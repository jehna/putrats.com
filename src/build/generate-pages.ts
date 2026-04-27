import { readdirSync, readFileSync, mkdirSync, writeFileSync, rmSync, cpSync } from "node:fs";
import { resolve } from "node:path";
import { renderComic } from "./template.js";
import { renderRss } from "./generate-rss.js";
import type { Comic } from "./types.js";

const ROOT = resolve(import.meta.dirname, "..", "..");
const COMICS_DIR = resolve(ROOT, "comics");
const PUBLIC_DIR = resolve(ROOT, "public");
const DIST_DIR = resolve(ROOT, "dist");
const SITE_URL = "https://putrats.com/";

function loadComics(): Comic[] {
  const files = readdirSync(COMICS_DIR).filter((f) => f.endsWith(".json"));
  const comics = files.map((f) => JSON.parse(readFileSync(resolve(COMICS_DIR, f), "utf8")) as Comic);
  return comics.sort((a, b) => a.id - b.id);
}

function writeFile(relativePath: string, content: string): void {
  const full = resolve(DIST_DIR, relativePath);
  mkdirSync(resolve(full, ".."), { recursive: true });
  writeFileSync(full, content);
}

function main(): void {
  rmSync(DIST_DIR, { recursive: true, force: true });
  mkdirSync(DIST_DIR, { recursive: true });

  cpSync(PUBLIC_DIR, DIST_DIR, { recursive: true });

  const comics = loadComics();
  if (comics.length === 0) throw new Error("No comics found");
  const lastId = comics[comics.length - 1].id;

  for (const comic of comics) {
    const isFirst = comic.id === comics[0].id;
    const isLast = comic.id === lastId;
    const html = renderComic({
      comic,
      isFirst,
      isLast,
      lastId,
      siteUrl: SITE_URL,
      canonicalPath: `comics/${comic.id}/`,
    });
    writeFile(`comics/${comic.id}/index.html`, html);
  }

  const latest = comics[comics.length - 1];
  const indexHtml = renderComic({
    comic: latest,
    isFirst: latest.id === comics[0].id,
    isLast: true,
    lastId,
    siteUrl: SITE_URL,
    canonicalPath: `comics/${latest.id}/`,
  });
  writeFile("index.html", indexHtml);

  writeFile("rss.xml", renderRss(comics, SITE_URL));

  console.log(`Built ${comics.length} comic pages + index + rss.xml into dist/`);
}

main();
