# AGENTS.md

## 概要

- Next.js 16 App Router / React 19 / TypeScript / Tailwind CSS v4 ベースのポートフォリオです。
- 言語は `ja` / `en` の2ロケールで、URL は `/{locale}/...` 形式です。
- Notion は `experience` / `awards` / `publications` / `projects` をデータソースとして使います。
- プロフィール（自己紹介・連絡先・SNS）は `lib/profile.ts` でハードコード管理です。
- フォントは `Oxygen Mono` を使用します（`app/globals.css`）。
- パッケージマネージャーは `pnpm` を使用します。

## ルーティングとページ構成

- `app/page.tsx`: `/` -> `/${defaultLocale}/home` にリダイレクト
- `app/[locale]/page.tsx`: `/{locale}` -> `/{locale}/home` にリダイレクト
- `app/[locale]/home/page.tsx`: Home
- `app/[locale]/about/page.tsx`: About
- `app/[locale]/projects/[id]/page.tsx`: Project detail（`id` は Notion page ID）
- `app/[locale]/layout.tsx`: locale別 metadata と `LanguageSwitcher` を配置
- `proxy.ts`: localeなしパスを `defaultLocale` へリダイレクトし、`x-locale` ヘッダーを付与

## i18n 方針

- `lib/i18n/config.ts`: `locales = ["ja", "en"]`, `defaultLocale = "ja"`
- 文言辞書は `lib/i18n/messages/*.ts` で管理
- `getLocalizedPropertyText()` は `foo_ja` / `foo_en` を優先し、空なら `foo` にフォールバック

## Home Hero 実装方針

- `components/sections/home-hero.tsx` はオーケストレーターです。
- 以下に責務分離しています。
  - `home-hero-profile-pane.tsx`
  - `home-hero-selected-project-card.tsx`
  - `home-hero-project-rail.tsx`
  - `use-project-rail-controller.ts`
- スクロール同期の計算ロジックは `lib/project-rail-math.ts` にあります。
- スクロール同期の契約:
  - ユーザースクロール時は `selectedIndex` のみ更新し、`scrollTop` を強制補正しない
  - プログラム選択時のみ中心へ `scrollTo`
  - 端（最上部/最下部）まで手動スクロールできることを壊さない

## データ取得レイヤー

- `lib/notion/client.ts`: Notion クライアント生成
- `lib/data/getExperience.ts`
- `lib/data/getAwards.ts`
- `lib/data/getPublications.ts`
- `lib/data/getProjects.ts`
- `lib/data/getProjectById.ts`
- すべて fail-soft（エラー時はログ出力 + 空配列/`null` を返す）

## Notion スキーマ（現行コード準拠）

- Experience
  - `time`, `title`, `description`, `experienceName`
- Awards
  - `title`, `description`, `year`, `link`
- Publications
  - `title`, `description`, `year`, `link`
- Projects
  - `time`, `title`, `role`, `description`, `content`, `tags`, `previewLink`

## ISR 再検証

- エンドポイント: `app/api/revalidate/route.ts`
- 必須ヘッダー: `X-Notion-Secret`
- 検証キー: `NOTION_WEBHOOK_KEY`
- 再検証対象:
  - `/{locale}/home`
  - `/{locale}/about`
  - ペイロードから `pageId` が取れた場合は `/{locale}/projects/{pageId}`

## コマンド

- `pnpm dev`: 開発サーバー
- `pnpm lint`: ESLint
- `pnpm build`: 本番ビルド
- `pnpm write`: Prettier整形
- `pnpm check:urls`: リポジトリ内 HTTP(S) URL の到達性検証

## CI

- Workflow: `.github/workflows/url-links.yml`
- `lint` ジョブ:
  - `push` / `workflow_dispatch` で実行（`schedule` はスキップ）
- `check-url-links` ジョブ:
  - `push` / `schedule` / `workflow_dispatch` で実行
  - `scripts/check-urls.mjs` を使用
  - `{name}` などのテンプレートURLと `vercel.com/new/clone?...` は除外

## 編集時の指針

- import は `@/*` エイリアスを維持してください。
- 新しい Notion フィールドを追加したら、最低限以下を同期してください。
  - `lib/notion/types.ts`
  - 対応する `lib/data/*` fetcher
  - 使用する section/item コンポーネント
  - 必要なら `lib/i18n/messages/*` の文言
- `app/globals.css` のトークンと Oxygen Mono 前提を崩す場合は、関連UI全体を合わせて調整してください。
- `.env.local` は絶対にコミットしないでください。

## 検証方針

- 変更後は `pnpm lint` を実行してください。
- ルーティング・データ取得・ビルド設定に触れた場合は `pnpm build` も実行してください。
- URLを含む文言やリンク導線を変更した場合は `pnpm check:urls` も実行してください。
