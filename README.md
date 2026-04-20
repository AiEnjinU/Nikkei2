# NIKKEI 225 Orbital Structure - Vercelデプロイガイド

ターミナル不要で、ブラウザ操作のみでデプロイできます。所要時間は10〜15分です。

## ファイル構成

```
vercel/
├── api/
│   └── jquants.js          ← J-Quants APIプロキシ（Serverless Function）
├── public/
│   └── index.html          ← アート本体
├── vercel.json             ← Vercel設定
└── README.md               ← このファイル
```

## デプロイ手順

### ステップ1: GitHubにアカウント作成（持っていれば飛ばす）

1. https://github.com/ にアクセス
2. Sign up でアカウント作成

### ステップ2: このフォルダをGitHubリポジトリに上げる

**Webブラウザだけで完結する方法**:

1. GitHubにログイン
2. 右上の `+` → `New repository`
3. リポジトリ名: `nikkei-orbital`（何でもOK）
4. `Public` を選択 → `Create repository`
5. 新しくできたリポジトリページの `uploading an existing file` リンクをクリック
6. `vercel/` フォルダの中身（`api/`, `public/`, `vercel.json`）を全部ドラッグ&ドロップ
7. ページ下部の `Commit changes` をクリック

### ステップ3: Vercelにアカウント作成

1. https://vercel.com/ にアクセス
2. `Sign Up` → `Continue with GitHub` （GitHubアカウントで認証）

### ステップ4: プロジェクトをデプロイ

1. Vercelダッシュボードで `Add New...` → `Project`
2. 先ほど作成した `nikkei-orbital` リポジトリを `Import`
3. **重要**: `Environment Variables` セクションを開いて、以下を追加:
   - **Name**: `JQUANTS_API_KEY`
   - **Value**: J-Quantsダッシュボードから取得したAPIキー（FNUBoxhc...）
4. `Deploy` をクリック

2〜3分でデプロイ完了。`https://nikkei-orbital-xxxxx.vercel.app` のようなURLが発行されます。

### ステップ5: 動作確認

1. 発行されたURLをブラウザで開く
2. 中央のログイン画面で `CONNECT` をクリック
3. データ取得が始まり、アートに実データが反映されれば成功

## 失敗時の切り分け

ログイン画面に診断ログが表示されます:

| ログ内容 | 意味と対処 |
|---|---|
| `server error: JQUANTS_API_KEY environment variable not set` | Vercel環境変数が未設定。Settings → Environment Variables で追加してRedeploy |
| `API key invalid or expired` | キーが無効または期限切れ。J-Quantsダッシュボードで確認 |
| `got 200 quotes` | 成功 |
| `0 quotes, trying previous day` | その日のデータがない（祝日等）→ 自動で前日を試している |

## 環境変数の更新方法

APIキーを変更する場合:
1. Vercelダッシュボード → プロジェクト選択 → `Settings` → `Environment Variables`
2. `JQUANTS_API_KEY` を編集
3. `Deployments` タブ → 最新デプロイの `...` メニュー → `Redeploy`

## 費用

- Vercel Hobby プラン: **無料**
- 月100GB帯域、100Serverless関数実行秒/日まで無料
- このアート規模なら十分に収まる

## セキュリティ

- APIキーはVercel環境変数に保存され、ブラウザには一切露出しません
- URLは誰でもアクセスできるので、本当に秘匿したい場合は Vercel の `Password Protection` 機能を利用可能（Pro プラン）

## 展示用URLの共有

デプロイ後のURLは好きな端末で開けます。展示会で大画面に映す、SNSでシェアする、等々自由に使えます。

## カスタムドメイン（任意）

独自ドメイン（例: `nikkei.yourname.com`）を使いたい場合:
1. Vercelダッシュボード → `Settings` → `Domains` → ドメインを追加
2. ドメイン管理画面でDNS設定（Vercelが案内してくれる）
