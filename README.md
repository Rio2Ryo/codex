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
 
## CI/CD (Vercel ゼロタッチ運用)
 
本リポジトリには GitHub Actions でのVercel本番デプロイが含まれます。
`/.github/workflows/deploy-vercel.yml` を使用し、`main` へのpushで自動デプロイされます。
 
必要なGitHub Secrets（リポジトリに登録）：
 
- `VERCEL_TOKEN`: Vercel Personal Access Token（最低限: Projects/Deployments権限）
- `VERCEL_ORG_ID`: 対象のOrg ID（個人の場合は個人アカウントID）
- `VERCEL_PROJECT_ID`: Vercel上のProject ID（新規作成時は `vercel link` 後に取得）
 
Secrets 登録例（ローカルに gh CLI がある場合）:
 
```bash
gh secret set VERCEL_TOKEN --body "<your_vercel_token>"
gh secret set VERCEL_ORG_ID --body "<your_org_id>"
gh secret set VERCEL_PROJECT_ID --body "<your_project_id>"
```
 
初回だけ必要な作業：
 
1) Vercelにプロジェクト作成（プロジェクト名は `codex` 推奨）
2) 上記3つのSecretsを登録
3) `main` にpush → 自動で `vercel build` → `vercel deploy --prebuilt --prod`
 
備考：VercelダッシュボードでGit連携を有効にする場合、Secrets不要で運用可能です。
ただし本Workflowでも安定運用できます。
