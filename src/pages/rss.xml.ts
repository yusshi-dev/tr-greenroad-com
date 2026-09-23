import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";

import { FEED_MAX_ITEMS, SITE } from "../consts";
import { absolutizeImages, getSortedPosts, postPath } from "../utils/blog";

const parser = new MarkdownIt();

// sanitize-html は既定で img を落としてしまうため、記事で使うタグを明示的に許可する
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "hr",
    "strong",
    "em",
    "b",
    "i",
    "u",
    "s",
    "del",
    "ins",
    "sub",
    "sup",
    "mark",
    "a",
    "img",
    "figure",
    "figcaption",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "dl",
    "dt",
    "dd",
    "blockquote",
    "pre",
    "code",
    "table",
    "thead",
    "tbody",
    "tfoot",
    "tr",
    "th",
    "td",
    "div",
    "span",
  ],
  allowedAttributes: {
    a: ["href", "title"],
    img: ["src", "alt", "title", "width", "height", "loading"],
    "*": ["class"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
};

export async function GET(context: APIContext) {
  const posts = (await getSortedPosts()).slice(0, FEED_MAX_ITEMS);
  const siteUrl = context.site ?? SITE.url;

  const response = await rss({
    title: `${SITE.title} ブログ（施工事例）`,
    description: SITE.description,
    site: siteUrl,
    xmlns: { atom: "http://www.w3.org/2005/Atom" },
    // フィードの自己URL（リーダーが参照するため推奨）
    customData: `<atom:link href="${new URL("rss.xml", siteUrl).href}" rel="self" type="application/rss+xml" />`,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.published_at,
      link: postPath(post),
      // 本文を HTML にして、画像は絶対URLに直してから整える
      content: sanitizeHtml(
        absolutizeImages(parser.render(post.body ?? ""), post),
        SANITIZE_OPTIONS,
      ),
    })),
  });

  response.headers.set("Content-Type", "application/rss+xml; charset=utf-8");
  return response;
}
