# putrats.com

> A small webcomic — *Stories about the mind of a startup dev.*

Static site built with TypeScript and deployed to GitHub Pages. Each comic is a JSON file under `comics/`; a small build step renders one HTML page per comic plus an `rss.xml` feed.

## Project layout

```
comics/                 # one <id>.json per comic — content source of truth
public/                 # static assets copied verbatim into dist/
  css/style.css         #   site styles
  images/               #   comic images
  fonts/                #   icon fonts
  favicon.ico, robots.txt
src/build/              # build-time TypeScript
  types.ts              #   Comic / RenderContext types
  template.ts           #   renderComic() → HTML string
  generate-rss.ts       #   renderRss()   → RSS 2.0 string
  generate-pages.ts     #   reads comics/*.json + public/, writes dist/
.github/workflows/      # GitHub Pages deploy workflow
```

`dist/` is generated and gitignored.

## Develop

```shell
npm install
npm run dev      # builds dist/, then serves it locally
```

## Build

```shell
npm run build    # writes dist/
```

The output in `dist/` is a fully static site — zero runtime JavaScript shipped to the browser.

## Add a new comic

1. Drop the image into `public/images/`.
2. Create `comics/<next-id>.json`:

   ```json
   {
     "id": 15,
     "title": "Comic title",
     "image": "/images/your-image.png",
     "desc": "Alt text / meta description",
     "width": 600,
     "height": 400,
     "imgtitle": "Image hover tooltip",
     "share": "Tweet text"
   }
   ```

3. Run `npm run build`. The homepage automatically points at the highest-id comic.

## Deploy

Pushes to `main` (or `master`) trigger `.github/workflows/deploy.yml`, which builds and publishes `dist/` to GitHub Pages.

To enable: in the repo settings, set **Pages → Build and deployment → Source** to *GitHub Actions*.

## Licensing

- Code is MIT-licensed (see `LICENSE-MIT`).
- Comic content (images and texts in `comics/*.json`) is licensed under [CC BY-NC 2.5](http://creativecommons.org/licenses/by-nc/2.5/) (see `LICENSE-CC`).
