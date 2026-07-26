import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// 記事は src/content/blog に .md / .mdx を追加するだけでページ化される
// （.mdx は astro-embed の <Tweet> などコンポーネント埋め込みが必要な記事用）
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    // 想定カテゴリ。新カテゴリを追加する場合はここに足す
    category: z.enum([
      "雑記",
      "試合感想",
      "制作裏話",
      "考察",
      "イベントレポート",
    ]),
  }),
});

export const collections = { blog };
