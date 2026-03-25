# Architecture

## 目的

現在の単一ページ構成を、以下の App Router 構成へ移行するための実装計画を定義する。

```txt
app/
  page.tsx                   # / -> /home redirect
  home/page.tsx              # ランディング
  about/page.tsx             # 自己紹介ページ
  projects/[slug]/page.tsx   # プロジェクト詳細
  api/revalidate/route.ts    # ISR再検証

lib/data/
  getHomeData.ts
  getAbout.ts
  getExperience.ts
  getPublications.ts
  getProjects.ts
  getProjectBySlug.ts

components/sections/
  home-hero.tsx
  about-profile.tsx
  experience.tsx
  publications.tsx
  project-detail.tsx
```

## 現状

- 現在は [`app/page.tsx`](/Users/amanokatsutoshi/study/portfolio-nextjs-notion/app/page.tsx) で `about` / `experience` / `projects` をまとめて表示する単一ページ構成。
- データ取得は [`lib/data/getData.ts`](/Users/amanokatsutoshi/study/portfolio-nextjs-notion/lib/data/getData.ts) で集約している。
- Notion 側は `About DB`、`Experience DB`、`Projects DB` を利用している。
- `Publications DB` は未実装。
- ISR 再検証は [`app/api/revalidate/route.ts`](/Users/amanokatsutoshi/study/portfolio-nextjs-notion/app/api/revalidate/route.ts) で `/` のみを対象としている。

## ゴール

- `/` は `redirect("/home")` に変更する。
- `/home` はランディングページとして再設計する。
- `/about` は自己紹介、経歴、出版物をまとめたプロフィールページにする。
- `/projects/[slug]` は個別プロジェクト詳細ページにする。
- Notion の `Publications DB` を新設し、`/about` に統合する。
- `Projects DB` に `slug` を追加し、個別ページのルーティングキーにする。
- `Projects DB` に `content` を追加し、個別ページ本文のソースにする。
- 既存の ISR webhook を複数ページ構成に対応させる。

## ルーティング設計

### `/`

- 役割: エントリーポイント
- 実装: `next/navigation` の `redirect("/home")`
- 理由: 公開 URL のホーム導線を固定しつつ、実体のページは `/home` に集約するため

### `/home`

- 役割: ランディングページ
- 主な表示内容:
  - ヒーロー
  - 自己紹介の要約
  - プロジェクト一覧
  - `/about` への導線
- データソース:
  - `About DB` の 1 レコード
  - `Projects DB` の全レコード

### `/about`

- 役割: 自己紹介ページ
- 主な表示内容:
  - プロフィール
  - 経歴
  - 出版物
- データソース:
  - `About DB`
  - `Experience DB`
  - `Publications DB`

### `/projects/[slug]`

- 役割: 個別プロジェクト詳細ページ
- 主な表示内容:
  - タイトル
  - 概要
  - 本文
  - 技術スタック
  - GitHub / Preview などの外部リンク
- データソース:
  - `Projects DB` の 1 レコード

## データレイヤ設計

### `lib/data/getHomeData.ts`

- 責務:
  - `About DB` から `/home` 用の自己紹介データを取得する
  - `Projects DB` から `/home` に掲載する一覧データを取得する
- 戻り値:

```ts
{
  about: About | null
  projects: Project[]
}
```

- 実装:
  - `getAbout()` と `getProjects()` を `Promise.all` でまとめる

### `lib/data/getAbout.ts`

- 既存実装を継続利用
- `About DB` の 1 レコードを返す

### `lib/data/getExperience.ts`

- 既存実装を継続利用
- `Experience DB` 一覧を返す
- Notion query の返却順をそのまま使う

### `lib/data/getPublications.ts`

- 新規追加
- `Publications DB` 一覧を返す
- `order` 昇順でソートする

### `lib/data/getProjects.ts`

- 既存実装を拡張
- `/home` 用のプロジェクト一覧を返せるようにする
- `slug` を必須フィールドとして扱う
- Notion query の返却順をそのまま使う

### `lib/data/getProjectBySlug.ts`

- 新規追加
- `slug` をキーに `Projects DB` から 1 件取得する
- 該当なしの場合は `null` を返し、ページ側で `notFound()` を使う
- 返却対象は `title`, `description`, `content`, `tags`, `githubLink`, `previewLink`, `slug`

## 型設計

[`lib/notion/types.ts`](/Users/amanokatsutoshi/study/portfolio-nextjs-notion/lib/notion/types.ts) を次の方向で拡張する。

### `About`

- 既存を維持

### `Experience`

- 既存を維持

### `Publication`

- 新規追加
- 想定フィールド:

```ts
interface Publication {
  id: string
  title: string
  authors: string
  venue: string
  year: string
  publicationUrl: string
  order: number
}
```

### `Project`

- 既存を拡張
- 想定フィールド:

```ts
interface Project {
  id: string
  title: string
  slug: string
  description: string
  content: string
  tags: string[]
  githubLink?: string
  previewLink?: string
}
```

### 補助関数

- `lib/utils.ts` の `getPropertyText()` は、`rich_text` / `title` の先頭要素だけでなく全文を連結して返す実装に更新する
- 理由:
  - `Projects DB.content` を本文として使うため
  - `Publications DB.authors` など複数テキスト断片を安全に扱うため

## Notion スキーマ設計

### About DB

- 継続利用するプロパティ:
  - `title`
  - `description`
  - `contact`
  - `tags`
  - `githubUrl`
  - `linkedinUrl`

### Experience DB

- 継続利用するプロパティ:
  - `time`
  - `title`
  - `description`
  - `experienceUrl`
  - `experienceName`

### Publications DB

- 新規に必要なプロパティ:
  - `title`
  - `authors`
  - `venue`
  - `year`
  - `publicationUrl`
  - `order`

### Projects DB

- 既存プロパティ:
  - `title`
  - `description`
  - `tags`
  - `githubLink`
  - `previewLink`
- 追加必須:
  - `slug`
  - `content`

## ページ実装設計

### `app/page.tsx`

- 実装内容:

```ts
import { redirect } from "next/navigation"

export default function Page() {
  redirect("/home")
}
```

- 目的: URL 正規化

### `app/home/page.tsx`

- 取得データ: `getHomeData()`
- 主な構成:
  - `HomeHero`
  - project cards の一覧
  - `/about` への CTA
- プロジェクト一覧は各カードから `/projects/[slug]` に遷移する

### `app/about/page.tsx`

- 取得データ:

```ts
const [about, experience, publications] = await Promise.all([
  getAbout(),
  getExperience(),
  getPublications(),
])
```

- 主な構成:
  - `AboutProfile`
  - `ExperienceSection`
  - `PublicationsSection`

### `app/projects/[slug]/page.tsx`

- 取得データ: `getProjectBySlug(slug)`
- 追加実装:
  - `notFound()` 対応
  - `slug` は request 時に解決する
  - `generateStaticParams()` は実装しない
  - `generateMetadata()` は実装しない

## コンポーネント設計

### `components/sections/home-hero.tsx`

- `/home` のファーストビュー専用
- 表示要素:
  - 名前
  - 概要
  - GitHub / LinkedIn / Contact
  - `/about` への CTA

### `components/sections/about-profile.tsx`

- `About DB` の全文表示を担当する
- 既存の `about.tsx` を `/about` 用に移行する

### `components/sections/experience.tsx`

- `/about` で Experience 一覧を描画する
- 既存の `experience.tsx` を継続利用する

### `components/sections/publications.tsx`

- 新規追加
- 出版物一覧を描画する
- `components/items/publication-item.tsx` を追加して 1 件表示を分離する

### `components/sections/project-detail.tsx`

- 新規追加
- 個別プロジェクトページの本文表示を担当する
- `Project` 型を props で受け取る
- `description` は導入文、`content` は本文として描画する

## データ取得の実装方針

- 既存の fail-soft 方針を維持する
  - Notion API エラー時はログを出し、ページ自体は落とさない
- ただし `getProjectBySlug()` だけは個別ページのため `null` を返せるようにする
- `getData.ts` は新構成では使わないため削除する
- `lib/data/index.ts` は次のエクスポート構成に更新する
  - `getHomeData`
  - `getAbout`
  - `getExperience`
  - `getPublications`
  - `getProjects`
  - `getProjectBySlug`

## ISR / 再検証設計

### 現状の課題

- 現在の webhook は `/` のみを再検証している
- ページ分割後は `/home`、`/about`、`/projects/[slug]` の更新が必要

### 推奨実装

- `X-Notion-Secret` による認証は維持する
- すべての有効な webhook で `revalidatePath("/home")` と `revalidatePath("/about")` を実行する
- Projects 更新時だけ、追加で `revalidatePath("/projects/${slug}")` を実行する

### 実装メモ

- 初期フェーズでは `revalidatePath()` ベースで十分
- webhook から `slug` が直接取れない場合は、更新された Notion page id からプロジェクトを 1 件取得して slug を解決する
- page id を解決できない場合は `/home` と `/about` の再検証だけで終了する
- `/` は redirect ページなので再検証対象に含めない

## 実装手順

### Phase 1: 型とデータモデル

1. `Publication` 型を追加する
2. `Project` 型に `slug`, `content` を追加する
3. Notion の `Projects DB` に `slug`, `content` を追加する
4. `Publications DB` を新設する

### Phase 2: データ取得層

1. `getPublications.ts` を追加する
2. `getProjects.ts` を `slug`, `content` 対応に更新する
3. `getProjectBySlug.ts` を追加する
4. `getHomeData.ts` を追加する
5. `lib/data/index.ts` を更新する
6. `getData.ts` を削除する

### Phase 3: ルーティング移行

1. `app/page.tsx` を redirect 実装へ変更する
2. `app/home/page.tsx` を追加する
3. `app/about/page.tsx` を追加する
4. `app/projects/[slug]/page.tsx` を追加する

### Phase 4: UI 分割

1. `home-hero.tsx` を追加する
2. `about-profile.tsx` を追加する
3. `publications.tsx` を追加する
4. `project-detail.tsx` を追加する
5. `components/items/publication-item.tsx` を追加する
6. 既存 `components/items/project-item.tsx` を `/home` の一覧で再利用する

### Phase 5: 再検証

1. `app/api/revalidate/route.ts` を複数ページ対応に変更する
2. Projects 更新時の slug 解決処理を追加する

### Phase 6: 検証

1. `pnpm lint`
2. `pnpm build`
3. `/` アクセス時に `/home` へ遷移することを確認
4. `/about` が 3 つの DB を正しく描画することを確認
5. `/projects/[slug]` が Notion の slug と一致することを確認
6. webhook からの再検証が期待通りに動くことを確認

## リスクと注意点

- `slug` が重複すると `/projects/[slug]` の一意性が壊れるため、Notion 側で一意運用が必要
- `Projects DB.content` が空の場合、個別ページ本文を描画できない

## 完了条件

- 指定したファイル構成が追加されている
- `Publications DB` を含むデータ取得が成立している
- `/`, `/home`, `/about`, `/projects/[slug]` の導線が成立している
- `pnpm lint` と `pnpm build` が成功する
- Notion webhook による ISR 再検証が新構成に対応している
