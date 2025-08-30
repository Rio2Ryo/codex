# GaiaNova IEO LP (Astro)

シンプルに編集・拡張しやすいAstroベースのIEO用LP雛形です。主要なテキストは `src/data/site.json` にまとまっています。

## セットアップ

1. Node.js 18+ を用意
2. 依存関係をインストール

```bash
npm i
```

3. 開発用サーバ

```bash
npm run dev
```

4. ビルド

```bash
npm run build && npm run preview
```

## 編集ポイント

- サイト本文・IEO情報・トークノミクス: `src/data/site.json`
- レイアウト/ナビ/メタ: `src/layouts/BaseLayout.astro`
- トップページ: `src/pages/index.astro`
- スタイル: `src/styles/global.css`
- トークノミクスのドーナツ図: `src/components/TokenomicsChart.astro`
- ヒーローセクション: `src/components/Hero.astro`

Whitepaper は `public/whitepaper.pdf` に置いてリンクします(現在はプレースホルダ)。

## デザイン方針

- 未来感 × 自然: オーロラ/ネオングリーンのグラデ、温かい緑の背景
- 編集容易性: JSON駆動で文言/配分/日付を即変更可能
- 機械可読性: schema.org(Organization)のJSON-LD埋め込み、OG/Twitterカード
- セクション: Hero, About, Sustainability, Tokenomics, IEO, Roadmap, Team, FAQ, CTA

## 注意事項(免責)

本LPは投資助言を目的としません。暗号資産にはリスクがあります。必ず各地域の規制に従い、自己判断でご参加ください。

---
Made with Astro.
