import type { Comic } from "./types.js";

const escapeXml = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export function renderRss(comics: Comic[], siteUrl: string): string {
  const sorted = [...comics].sort((a, b) => b.id - a.id);
  const items = sorted
    .map((c) => {
      const link = `${siteUrl}comics/${c.id}/`;
      const imgUrl = siteUrl + c.image.substring(1);
      const description = `<![CDATA[<p>${c.desc}</p><img src="${imgUrl}" width="${c.width}" height="${c.height}" alt="${c.desc}" />]]>`;
      return `    <item>
      <title>${escapeXml(c.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description>${description}</description>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Putrats</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>Stories about the mind of a startup dev</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;
}
