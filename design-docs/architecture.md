# Architecture

## 目的

ポートフォリオを Next.js App Router で運用し、以下を満たす。

- `ja/en` の URL を持つ i18n 構成
- Notion を CMS としたデータ表示
- プロジェクト詳細を Notion ページ `id` ベースで表示
- ISR webhook による再検証

## 現在の構成

```txt
app/
  layout.tsx
  page.tsx                   # / -> /ja/home redirect
  [locale]/
    layout.tsx               # locale ごとの metadata / 言語切替UI
    home/page.tsx
    about/page.tsx
    projects/[id]/page.tsx
  api/revalidate/route.ts

proxy.ts                     # locale なし URL の補正

lib/i18n/
  config.ts
  get-dictionary.ts
  messages/
    ja.ts
    en.ts
    types.ts

lib/data/
  getHomeData.ts
  getAbout.ts
  getExperience.ts
  getPublications.ts
  getProjects.ts
  getProjectById.ts

components/sections/
  home-hero.tsx
  about-profile.tsx
  experience.tsx
  publications.tsx
  project-detail.tsx

components/ui/
  language-switcher.tsx
```

## ルーティング設計

### `/`

- `app/page.tsx` で `/${defaultLocale}/home` へリダイレクトする
- 現在の `defaultLocale` は `ja`

### `/{locale}`

- `app/[locale]/page.tsx` で `/{locale}/home` へリダイレクトする
- 例: `/ja` -> `/ja/home`, `/en` -> `/en/home`

### `/{locale}/home`

- ランディングページ
- 右側プロジェクトリストを縦スクロールし、中央の表示プロジェクトを切り替える
- URL は変更しない

### `/{locale}/about`

- 自己紹介、経験、出版物の集約ページ

### `/{locale}/projects/{id}`

- プロジェクト詳細ページ
- `id` は Notion レコードのデフォルトページ ID を使う
- slug は使わない

### locale 補正

- `proxy.ts` で locale なし URL を `/${defaultLocale}/...` にリダイレクト
- 例:
  - `/home` -> `/ja/home`
  - `/about` -> `/ja/about`
  - `/projects/{id}` -> `/ja/projects/{id}`

## i18n 設計

### 基盤

- `lib/i18n/config.ts`
  - `locales = ["ja", "en"]`
  - `defaultLocale = "ja"`
  - `Locale` 型
- `lib/i18n/messages/{ja,en}.ts`
  - UI 文言辞書
- `lib/i18n/get-dictionary.ts`
  - locale から辞書を取得

### 文言の辞書化対象

- 言語切替 UI (`JA / EN`)
- Home の固定文言
- About のセクション見出し
- Project 詳細の固定ラベル
- Publication のリンクラベル

### 言語切替 UI

- `components/ui/language-switcher.tsx`
- 現在の `pathname` の locale セグメントだけを差し替えて遷移
- 例:
  - `/ja/home` -> `/en/home`
  - `/ja/projects/{id}` -> `/en/projects/{id}`

## データレイヤ設計

全データ取得関数は `locale` を受け取る。

- `getHomeData(locale)`
- `getAbout(locale)`
- `getExperience(locale)`
- `getPublications(locale)`
- `getProjects(locale)`
- `getProjectById(id, locale)`

### ローカライズされたプロパティ取得

- `lib/utils.ts` の `getLocalizedPropertyText(properties, key, locale)` を利用
- 解決順:
  1. `${key}_${locale}` を取得
  2. 空なら `key` をフォールバック

## Notion スキーマ方針

多言語は同一 DB の列追加で管理する。

- 推奨列:
  - `title_ja`, `title_en`
  - `role_ja`, `role_en`
  - `description_ja`, `description_en`
  - `content_ja`, `content_en`
  - 必要に応じて `authors_ja`, `authors_en` など
- 既存単一列 (`title`, `role`, `description`, `content`) はフォールバックとして利用

### order の扱い

- `Experience` と `Project` には `order` を追加しない
- `Publications` のみ `order` を使って昇順ソート

## ISR / 再検証

- `app/api/revalidate/route.ts` で Notion webhook を受ける
- 常に再検証するパス:
  - `/ja/home`, `/ja/about`
  - `/en/home`, `/en/about`
- `projectId` または payload から解決した page ID がある場合:
  - `/ja/projects/{id}`
  - `/en/projects/{id}`

## メタデータ

- `app/[locale]/layout.tsx` の `generateMetadata` で locale ごとの title/description を返す
- `openGraph` / `twitter` も同じ辞書値を利用する

## 検証項目

- `pnpm lint`
- `pnpm build`
- 手動確認:
  - `/` アクセス時に `/ja/home` へ遷移する
  - locale なし URL が補正される
  - 言語トグルで URL と文言が切り替わる
  - `/ja/projects/{id}` と `/en/projects/{id}` の両方で詳細が表示される
