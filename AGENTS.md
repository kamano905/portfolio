# AGENTS.md

## 概要
- このリポジトリは、Next.js 16 App Router、React 19、TypeScript、Tailwind CSS v4、Notion を CMS として使ったミニマルなポートフォリオです。
- トップページは Notion の 3 つのデータソース `about`、`experience`、`projects` をもとに描画されます。
- パッケージマネージャーは `pnpm` を使ってください。依存関係の正は `pnpm-lock.yaml` です。

## セットアップ
- 依存関係のインストールは `pnpm install` を使います。
- `.env.example` を `.env.local` にコピーし、以下を設定します。
  - `NOTION_API_KEY`
  - `NOTION_ABOUT_DB_ID`
  - `NOTION_EXPERIENCE_DB_ID`
  - `NOTION_PROJECTS_DB_ID`
  - `NOTION_WEBHOOK_KEY`
- `.env.local` の秘密情報は絶対にコミットしないでください。

## よく使うコマンド
- `pnpm dev` でローカル開発サーバーを起動します。
- `pnpm lint` で ESLint を実行します。
- `pnpm build` で本番ビルドを作成します。
- `pnpm write` で Prettier と Tailwind 用プラグインによる整形を実行します。

## アーキテクチャ
- `app/page.tsx` は唯一のページで、ポートフォリオ各セクションを組み立てます。
- `app/layout.tsx` では metadata、フォント、theme provider、theme toggle、固定表示の `NotionBadge` を設定しています。
- `app/api/revalidate/route.ts` はオンデマンド ISR 用のエンドポイントです。`X-Notion-Secret` ヘッダーが `NOTION_WEBHOOK_KEY` と一致する前提です。
- `lib/notion/client.ts` で Notion クライアントを生成しています。
- `lib/data/*.ts` に Notion への問い合わせ処理があります。`getData()` は 3 つのフェッチ関数を `Promise.all` でまとめています。
- `components/sections/*` はページ全体のセクションを描画します。
- `components/items/*` は experience / project の個別行を描画します。
- `components/ui/*` は shadcn 系の再利用 UI コンポーネントです。

## データモデルの前提
- Notion のプロパティ名は現行コードに合わせて維持してください。既存フェッチャーは次のフィールドを前提にしています。
  - About: `title`, `description`, `contact`, `tags`, `githubUrl`, `linkedinUrl`
  - Experience: `time`, `title`, `description`, `experienceUrl`, `experienceName`
  - Projects: `title`, `description`, `tags`, `githubLink`, `previewLink`
- マッピングの追加や変更では、`lib/utils.ts` の `getPropertyText()` と `getPropertyMultiSelect()` を再利用してください。
- 現在のフェッチャーは fail-soft です。エラー時は例外を投げず、ログを出して空データを返します。

## スタイリング上の注意
- Tailwind は `app/globals.css` を使う CSS-first 構成です。`tailwind.config.*` はありません。
- このプロジェクトは `radix-vega` スタイルの shadcn と、`app/globals.css` で定義された neutral 系トークンを使っています。
- 既存の見た目は、ミニマルなレイアウト、詰めた余白、モノクロ基調、控えめなモーションです。変更時もこの方向性を保ってください。

## 編集時の指針
- クライアント側状態が本当に必要な場合を除き、server component を優先してください。
- Notion をソースにした新しいセクションを追加する場合は、次をまとめて更新してください。
  - `lib/notion/types.ts`
  - `lib/data/` 配下の新しい fetcher
  - `lib/data/getData.ts`
  - `app/page.tsx`
  - 対応する section / item コンポーネント
- import は `tsconfig.json` の `@/*` エイリアスを維持してください。
- フォーマットは既存ルールに合わせてください。セミコロンなし、Tailwind の class 順は Prettier に任せます。
- `app/layout.tsx` のコメントは意図的に残されています。ユーザーが明示的に維持したいと言わない限り、本番公開時は `NotionBadge` を外す前提で考えてください。

## 検証
- コード変更後は `pnpm lint` を実行してください。
- アプリ構造、データ取得、設定を変更した場合は `pnpm build` も実行してください。
- このリポジトリには自動テストがありません。`pnpm dev` での手動確認と lint を基本の検証手段とします。
