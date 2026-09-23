import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

import { parseJstDateTime } from "./utils/jst";

// 日時は「JST の壁時計・オフセット無し」で保存し、読み込み時に正しい瞬間へ正規化する。
// z.date() は文字列を実行環境のタイムゾーンで解釈しうるため使わない。
const jstDateTime = z
  .union([z.date(), z.string()])
  .transform((value) => parseJstDateTime(value))
  .refine((date) => !Number.isNaN(date.getTime()), {
    message: "日時として解釈できません",
  });

/** エントリ直下の画像パスを `./` 付きに正規化する（Sveltia は `sample.png` 形式で保存するため） */
const normalizeImagePath = (value: unknown) =>
  typeof value === "string" && !value.startsWith(".") && !value.startsWith("/")
    ? `./${value}`
    : value;

const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      image: z.preprocess(normalizeImagePath, image()),
      hero: z.preprocess(normalizeImagePath, image()),
      /** ページ上部の画像に重ねるマスキングの色（既定は緑） */
      hero_overlay: z.enum(["green", "black", "beige", "navy"]).default("green"),
      /** ビフォーアフターの施工例（ページ下部で比較スライダーとして表示する） */
      before_after: z
        .array(
          z.object({
            label: z.string(),
            before: z.preprocess(normalizeImagePath, image()),
            after: z.preprocess(normalizeImagePath, image()),
          }),
        )
        .optional(),
      /** 料金表（note は「損傷状態」列。全行に無ければ列ごと省略する） */
      price_table: z
        .array(
          z.object({
            item: z.string(),
            note: z.string().optional(),
            price: z.string(),
          }),
        )
        .optional(),
      order: z.number(),
    }),
});

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    published_at: jstDateTime,
    category: z.string(),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: z.object({
    title: z.string(),
    date: jstDateTime,
    label: z.string(),
  }),
});

export const collections = { services, posts, news };
