# Portfolio Next.js + Notion

Next.js 16 App Router と Notion を使ったポートフォリオです。  
`/ja/...` と `/en/...` のロケール付きURLを持ち、Notionのデータを ISR で配信します。

## 主な仕様

- ルーティング
  - `/` -> `/{defaultLocale}/home` へリダイレクト
  - `/{locale}/home`, `/{locale}/about`, `/{locale}/projects/{id}`
  - `id` は Notion のページ ID（slug は不使用）
- 多言語
  - 対応ロケール: `ja`, `en`
  - 画面右上の言語スイッチャーで同一ページのロケールを切替
- Home 画面
  - 右側の縦スクロールリストに連動して中央の `selectedProject` を切替
  - 中央カードをクリックするとプロジェクト詳細へ遷移
- About 画面
  - プロフィールは `lib/profile.ts` のハードコードを使用
  - Experience / Publications / Awards は Notion から取得
- ISR / 再検証
  - `POST /api/revalidate`
  - `X-Notion-Secret` と `NOTION_WEBHOOK_KEY` が一致したときに再検証
  - `/home`, `/about`, `/projects/{id}`（全ロケール）を再検証

## 技術スタック

- Next.js 16 (App Router)
- React 19 + TypeScript
- Notion API (`@notionhq/client`)
- Tailwind CSS v4 + shadcn/ui
- Three.js（ノイズ背景）
- Font: Oxygen Mono (`@fontsource/oxygen-mono`)

## ディレクトリ構成

```txt
app/
  page.tsx                   # / -> /{defaultLocale}/home
  [locale]/
    layout.tsx               # locale別metadata + LanguageSwitcher
    page.tsx                 # /{locale} -> /{locale}/home
    home/page.tsx            # Home
    about/page.tsx           # About
    projects/[id]/page.tsx   # Project detail
  api/revalidate/route.ts    # ISR再検証

components/
  items/                     # List item UI
  sections/
    home-hero.tsx            # Home orchestration
    home-hero/               # Homeを構成する分割コンポーネント + hook
  ui/                        # 共通UI

lib/
  data/                      # Notion fetchers
  i18n/                      # locale設定・辞書
  notion/                    # Notion client / types
  profile.ts                 # Aboutプロフィール（ハードコード）
  project-rail-math.ts       # Home右レールの計算ロジック
  utils.ts                   # Notion property helper
```

## セットアップ

```bash
pnpm install
cp .env.example .env.local
```

`.env.local` に以下を設定してください。

- `NOTION_API_KEY`
- `NOTION_EXPERIENCE_DB_ID`
- `NOTION_AWARDS_DB_ID`
- `NOTION_PUBLICATIONS_DB_ID`
- `NOTION_PROJECTS_DB_ID`
- `NOTION_WEBHOOK_KEY`

## Notion DB スキーマ

`*_ja`, `*_en` のローカライズ列がある場合はそちらを優先し、なければベース列（例: `title`）にフォールバックします。

- Experience
  - `time`, `title`, `description`, `experienceName`
- Publications
  - `title`, `description`, `year`, `link`
- Awards
  - `title`, `description`, `year`, `link`
- Projects
  - `time`, `title`, `role`, `description`, `content`, `tags`, `previewLink`

## 開発コマンド

```bash
pnpm dev
pnpm lint
pnpm build
pnpm write
pnpm check:urls
```

## CI

GitHub Actions: `.github/workflows/url-links.yml`

- `lint` ジョブ（`schedule` 以外）
- URL リンク検証ジョブ（`scripts/check-urls.mjs`）

URL検証では次を除外しています。

- テンプレートURL（`{name}` などを含むURL）
- `https://vercel.com/new/clone?...`（botアクセスで 403 になりやすいため）

## License

MIT
