# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## 🗳 MVP投票（ファンが選ぶ イタリア大会MVP）

読者参加型の投票機能。TOPページと `/tournaments/kings-world-cup-clubs-2026` の
2か所に同じコンポーネントを設置しており、投票先は共通（`poll_id = kwcc2026-italy`）。

### セットアップ

1. **Supabase のテーブルを作る**
   `supabase/migrations/0001_mvp_votes.sql` の中身をそのまま Supabase の
   SQL Editor に貼って実行する。RLS は有効・ポリシーなしの状態にしてあり、
   読み書きはサーバー側の API ルートから Service Role キーでのみ行う。

2. **環境変数を設定する**
   `.env.example` を `.env` にコピーして値を入れる（ローカル）。
   本番は **Vercel のプロジェクト設定 → Environment Variables** に同じ3つを登録する。

   | 変数 | 用途 |
   | :-- | :-- |
   | `SUPABASE_URL` | Supabase プロジェクトの URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | サーバー側からの読み書き用。**ブラウザに出さない** |
   | `VOTE_HASH_SALT` | 投票者ハッシュのソルト（`openssl rand -hex 32` 等で生成） |

   3つが未設定でもビルド・表示は通る（「結果は20票から公開します」の状態になる）。

### 設定値の変更箇所

締切・公開閾値・候補・理由タグはすべて `src/data/mvp-poll.ts` に集約している。

- `VOTE_DEADLINE_ISO` … 受付期限（初期値 2026-08-31 23:59 JST）
- `REVEAL_THRESHOLD` … 何票から％・票数を公開するか（初期値 20）
- `REASON_TAGS` … 理由タグ。DB には `id` が入るので、表示名は自由に変えてよい
- 候補は `players.ts` の `status: "confirmed"` 16名＋首脳陣5名から自動生成される

### プライバシー

`mvp_votes` に保存するのは `candidate_slug` / `reason_tags` / `voter_hash` のみ。
`voter_hash` は `sha256(IP + User-Agent + VOTE_HASH_SALT)` で、
**IPアドレスと User-Agent は生のまま保存しない。**
