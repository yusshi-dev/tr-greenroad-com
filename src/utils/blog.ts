import { getCollection, type CollectionEntry } from "astro:content";
import type { ImageMetadata } from "astro";

import { SITE } from "../consts";
import { getJstParts } from "./date";

export const POSTS_PER_PAGE = 9;

export type Post = CollectionEntry<"posts">;

/** コンテンツ内の画像。本文の先頭画像をアイキャッチに使うため、ビルド時に解決しておく */
const contentImages = import.meta.glob<ImageMetadata>(
  "/src/content/**/*.{jpg,jpeg,png,webp,gif}",
  { eager: true, import: "default" },
);

/**
 * アイキャッチ画像。本文の最初の画像をそのまま使う（frontmatter での指定は廃止）。
 * 本文に画像が無い場合は undefined（一覧ではサムネイル無し、OGP は既定画像になる）。
 */
export function getEyecatch(entry: {
  collection: string;
  id: string;
  body?: string;
}): ImageMetadata | undefined {
  const [, file] =
    entry.body?.match(/!\[[^\]]*\]\((?:\.\/)?([^)\s]+)\)/) ??
    entry.body?.match(/<img[^>]+src=["'](?:\.\/)?([^"']+)["']/) ??
    [];
  if (!file || /^(?:https?:)?\/\//i.test(file)) return undefined;

  return contentImages[`/src/content/${entry.collection}/${entry.id}/${file}`];
}

/** アイキャッチの絶対URL（OGP 用）。本文に画像が無ければ undefined */
export function getEyecatchUrl(entry: {
  collection: string;
  id: string;
  body?: string;
}): string | undefined {
  const image = getEyecatch(entry);
  return image ? new URL(image.src, SITE.url).href : undefined;
}

/**
 * 本文 HTML（Markdown 変換後）の中の画像パスを、ビルド後の絶対URLに置き換える。
 * RSS フィードでは相対パスが解決できないため。
 */
export function absolutizeImages(
  html: string,
  entry: { collection: string; id: string },
): string {
  return html.replace(/<img([^>]*?)src="([^"]+)"([^>]*?)>/g, (whole, before, src, after) => {
    if (/^(?:https?:)?\/\//i.test(src) || src.startsWith("/")) return whole;
    const file = decodeURIComponent(src.replace(/^\.\//, ""));
    const image = contentImages[`/src/content/${entry.collection}/${entry.id}/${file}`];
    if (!image) return whole;
    return `<img${before}src="${new URL(image.src, SITE.url).href}"${after}>`;
  });
}

export interface Category {
  /** カテゴリ名。URLにもそのまま使う（日本語を許容） */
  name: string;
  count: number;
}

export interface YearMonth {
  year: string;
  month: string;
  count: number;
}

/** 公開日の降順で記事を取得する */
export async function getSortedPosts(): Promise<Post[]> {
  const posts = await getCollection("posts");
  return posts.sort((a, b) => b.data.published_at.valueOf() - a.data.published_at.valueOf());
}

/** 記事に存在するカテゴリを集計する */
export function getCategories(posts: Post[]): Category[] {
  const map = new Map<string, Category>();
  for (const post of posts) {
    const name = post.data.category;
    const existing = map.get(name);
    if (existing) existing.count += 1;
    else map.set(name, { name, count: 1 });
  }
  return [...map.values()];
}

/** 記事に存在する年月を集計する（新しい順） */
export function getYearMonths(posts: Post[]): YearMonth[] {
  const map = new Map<string, YearMonth>();
  for (const post of posts) {
    const { year, month } = getJstParts(post.data.published_at);
    const key = `${year}/${month}`;
    const existing = map.get(key);
    if (existing) existing.count += 1;
    else map.set(key, { year, month, count: 1 });
  }
  return [...map.values()].sort((a, b) =>
    a.year === b.year ? Number(b.month) - Number(a.month) : Number(b.year) - Number(a.year),
  );
}

/** カテゴリページのベースパス（日本語はそのままURLエンコードする） */
export function categoryPath(name: string): string {
  return `/blog/category/${encodeURIComponent(name)}/`;
}

/** 記事URL（はてなブログ形式: /blog/YYYY/MM/DD/HHMMSS/） */
export function postPath(post: Post): string {
  const { year, month, day, hour, minute, second } = getJstParts(post.data.published_at);
  return `/blog/${year}/${month}/${day}/${hour}${minute}${second}/`;
}

/** 月別アーカイブのURL（/blog/YYYY/MM/） */
export function monthPath(year: string | number, month: string | number): string {
  return `/blog/${year}/${String(month).padStart(2, "0")}/`;
}

/** ページ番号で切り出す */
export function paginate<T>(items: T[], page: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / POSTS_PER_PAGE));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * POSTS_PER_PAGE;
  return {
    items: items.slice(start, start + POSTS_PER_PAGE),
    page: current,
    totalPages,
  };
}

/** ページ番号からURLを作る（1ページ目は basePath そのもの） */
export function pageUrl(basePath: string, page: number): string {
  return page <= 1 ? basePath : `${basePath}page/${page}/`;
}
