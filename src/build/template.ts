import type { RenderContext } from "./types.js";

const escapeHtml = (s: string | number): string =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export function renderComic(ctx: RenderContext): string {
  const { comic, isFirst, isLast, lastId, siteUrl, canonicalPath } = ctx;
  const { id, title, image, desc, width, height, imgtitle } = comic;

  const pagerLink = (
    disabled: boolean,
    href: string,
    rel: string,
    label: string,
    iconLeft?: string,
    iconRight?: string,
  ): string => {
    const left = iconLeft ? `<span class="glyphicon glyphicon-${iconLeft}"></span> ` : "";
    const right = iconRight ? ` <span class="glyphicon glyphicon-${iconRight}"></span>` : "";
    if (disabled) {
      return `<li class="disabled"><a>${left}${label}${right}</a></li>`;
    }
    return `<li><a href="${href}" rel="${rel}">${left}${label}${right}</a></li>`;
  };

  const pager = `
        <ul class="pager">
            ${pagerLink(isFirst, `/comics/1/`, "first", "First", "step-backward")}
            ${pagerLink(isFirst, `/comics/${id - 1}/`, "prev", "Prev", "chevron-left")}
            ${pagerLink(isLast, `/comics/${id + 1}/`, "next", "Next", undefined, "chevron-right")}
            ${pagerLink(isLast, `/comics/${lastId}/`, "last", "Last", undefined, "step-forward")}
        </ul>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${escapeHtml(title)}</title>
    <link rel="stylesheet" href="/css/style.css">
    <link rel="canonical" href="${escapeHtml(siteUrl + canonicalPath)}">
    <link rel="first" href="/comics/1/">
    ${!isLast ? `<link rel="next" href="/comics/${id + 1}/">` : ""}
    ${!isFirst ? `<link rel="prev" href="/comics/${id - 1}/">` : ""}
    <link rel="last" href="/comics/${lastId}/">
    <meta name="viewport" content="initial-scale=1.0, minimum-scale=1.0, width=device-width">
    <meta name="description" content="${escapeHtml(desc)}">
    <link rel="alternate" type="application/rss+xml" href="/rss.xml">
    <meta property="og:image" content="${escapeHtml(siteUrl + image.substring(1))}">
    <meta property="og:description" content="${escapeHtml(comic.share)}">
    <meta name="twitter:card" content="photo">
    <meta name="twitter:creator" content="@luotojesse">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:image" content="${escapeHtml(siteUrl + image.substring(1))}">
    <meta name="twitter:image:width" content="${width}">
    <meta name="twitter:image:height" content="${height}">
</head>
<body class="comics">
    <div class="navbar navbar-default">
      <div class="container">
        <div class="navbar-header">
          <a href="/" class="navbar-brand">
            <strong>Putrats</strong> &ndash;
            <small>Stories about the mind of a startup dev</small>
          </a>
        </div>
      </div>
    </div>

    <div class="container">
        <div class="first-pagination">${pager}
        </div>
        <div class="content">
            <div class="row">
                <div class="col-lg-12">
                    <h1>${escapeHtml(title)}</h1>
                    <img src="${escapeHtml(image)}" class="header-image img-responsive" title="${escapeHtml(imgtitle)}" width="${width}" height="${height}" alt="${escapeHtml(desc)}">
                    <p class="post-cta">
                        Permanent link to this comic: <a href="${escapeHtml(siteUrl + canonicalPath)}" rel="canonical">${escapeHtml(siteUrl + canonicalPath)}</a>
                    </p>
                </div>
            </div>
        </div>
        <div class="last-pagination">${pager}
        </div>

        <footer>
            <div class="row">
                <div class="col-md-12">
                    <ul class="list-unstyled">
                      <li class="pull-right"><a href="#">Back to top</a></li>
                      <li><a href="/comics/${lastId}/">Webcomic</a></li>
                      <li><a href="/rss.xml">RSS</a></li>
                      <li><a href="https://github.com/jehna/putrats.com" rel="nofollow">Fork!</a></li>
                    </ul>
                    <p>Site by <a href="https://www.twitter.com/luotojesse">Jesse Luoto.</a></p>
                    <p>This work is licensed under a <a href="http://creativecommons.org/licenses/by-nc/2.5/" rel="nofollow">Creative Commons Attribution-NonCommercial 2.5 License.</a></p>
                    <p>Code licensed under a MIT license and can be forked at <a href="https://github.com/jehna/putrats.com" rel="nofollow">GitHub project page</a>.</p>
                </div>
            </div>
        </footer>
    </div>
</body>
</html>
`;
}
