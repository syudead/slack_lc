# Deno Deploy デプロイメントガイド

このガイドでは、LangChain Slack BotをDeno Deployにデプロイする完全な手順を説明します。

## 1. 前提条件

### 必要なアカウント
- [GitHub](https://github.com) アカウント
- [Deno Deploy](https://dash.deno.com) アカウント
- [Slack](https://slack.com) ワークスペース

### 必要なAPIキー
以下のいずれか1つ:
- OpenAI API Key
- Anthropic Claude API Key
- DeepSeek API Key

## 2. GitHub リポジトリの準備

### 2.1 リポジトリの作成
```bash
# GitHubで新しいリポジトリを作成
# 例: slack-langchain-bot

# ローカルリポジトリをリモートに接続
git remote add origin https://github.com/YOUR_USERNAME/slack-langchain-bot.git
git branch -M main
git push -u origin main
```

### 2.2 コードの確認
```bash
# 最新のコードがコミットされていることを確認
git status

# 全ての変更がコミットされていることを確認
git log --oneline -5
```

## 3. Deno Deploy でのプロジェクト作成

### 3.1 プロジェクトの作成
1. [Deno Deploy Dashboard](https://dash.deno.com) にアクセス
2. GitHubアカウントでサインイン
3. 「New Project」をクリック
4. 「Deploy from GitHub repository」を選択

### 3.2 リポジトリの設定
1. **Repository**: `YOUR_USERNAME/slack-langchain-bot` を選択
2. **Branch**: `main` を選択
3. **Entry Point**: `main.ts` を入力
4. **Install Command**: 空のまま
5. **Build Command**: 空のまま

### 3.3 プロジェクトの作成
1. 「Deploy」をクリック
2. プロジェクト名を確認（例: `slack-langchain-bot-abc123`）
3. デプロイURLを確認（例: `https://slack-langchain-bot-abc123.deno.dev`）

## 4. 環境変数の設定

### 4.1 Deno Deploy での環境変数設定
1. デプロイ完了後、「Settings」タブをクリック
2. 「Environment Variables」セクションに移動
3. 以下の環境変数を追加:

#### 必須の環境変数
```
SLACK_BOT_TOKEN=xoxb-your-actual-bot-token
SLACK_SIGNING_SECRET=your-actual-signing-secret
```

**注意**: Deno Deploy では `PORT` 環境変数は不要です。Deno Deploy が自動的にHTTPS (443ポート) でリクエストを処理します。

#### LLMプロバイダー設定（いずれか1つ）

**OpenAI を使用する場合:**
```
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-openai-key
```

**Claude を使用する場合:**
```
LLM_PROVIDER=claude
CLAUDE_API_KEY=sk-ant-your-claude-key
```

**DeepSeek を使用する場合:**
```
LLM_PROVIDER=deepseek
DEEPSEEK_API_KEY=sk-your-deepseek-key
```

### 4.2 環境変数の保存
1. 各環境変数を入力後「Add」をクリック
2. 全ての環境変数を追加後「Save」をクリック
3. 自動的に再デプロイが開始されます

## 5. Slack App の設定

### 5.1 Slack App の作成
1. `SLACK_SETUP.md` の手順に従ってSlack Appを作成
2. 必要な権限を設定
3. Bot Token と Signing Secret を取得

### 5.2 Request URL の設定
1. Slack App の「Event Subscriptions」に移動
2. Request URL を設定: `https://your-project-name.deno.dev/slack/events`
3. 「Verify」をクリックして確認

## 6. デプロイメントの確認

### 6.1 ヘルスチェック
```bash
# デプロイメントの基本確認
curl https://your-project-name.deno.dev/health
# 期待される出力: "OK"
```

### 6.2 ログの確認
1. Deno Deploy Dashboard の「Logs」タブを開く
2. リアルタイムログを確認
3. エラーがないことを確認

### 6.3 Slack での動作確認
1. Slack ワークスペースでBot をチャンネルに招待:
   ```
   /invite @LangChain Bot
   ```
2. Bot にメンション:
   ```
   @LangChain Bot Hello!
   ```
3. Bot からの応答を確認

## 7. 継続的デプロイ

### 7.1 自動デプロイの設定
- GitHub の `main` ブランチにプッシュすると自動的にデプロイされます
- デプロイ状況は Deno Deploy Dashboard で確認可能

### 7.2 手動デプロイ
```bash
# コード変更後
git add .
git commit -m "feat: Update bot functionality"
git push origin main
# 自動的にデプロイが開始されます
```

## 8. CLI を使用したデプロイ（オプション）

### 8.1 DeployCtl のインストール
```bash
deno install --allow-read --allow-write --allow-env --allow-net --allow-run --no-check -r -f https://deno.land/x/deploy/deployctl.ts
```

### 8.2 CLI デプロイ
```bash
# 設定済みのタスクを使用
deno task deploy

# または直接コマンド実行
deployctl deploy --project=your-project-name main.ts
```

## 9. トラブルシューティング

### 9.1 よくある問題と解決策

**デプロイが失敗する場合:**
- `deno.json` の imports が正しく設定されているか確認
- Entry Point が `main.ts` に設定されているか確認
- GitHub リポジトリが正しく選択されているか確認

**Slack イベントが受信されない場合:**
- 環境変数 `SLACK_BOT_TOKEN` と `SLACK_SIGNING_SECRET` が正しく設定されているか確認
- Request URL が正しく設定されているか確認
- Bot が適切な権限を持っているか確認

**LLM プロバイダーでエラーが発生する場合:**
- 選択したプロバイダーのAPI キーが正しく設定されているか確認
- `LLM_PROVIDER` 環境変数が正しく設定されているか確認
- API キーが有効で、使用制限に達していないか確認

### 9.2 ログを使用したデバッグ
```bash
# Deno Deploy Dashboard でログを確認
# または CLI でログを表示
deployctl logs --project=your-project-name
```

### 9.3 ローカル開発でのテスト
```bash
# 環境変数を設定してローカルでテスト
export SLACK_BOT_TOKEN=xoxb-your-token
export SLACK_SIGNING_SECRET=your-secret
export LLM_PROVIDER=openai
export OPENAI_API_KEY=sk-your-key

# アプリケーションを起動
deno task dev
```

## 10. パフォーマンスとスケーリング

### 10.1 リクエスト制限
- Deno Deploy の制限を確認
- 必要に応じて Deno Deploy Pro を検討

### 10.2 モニタリング
- Deno Deploy Dashboard でメトリクスを確認
- 応答時間とエラー率を監視

## 11. セキュリティ

### 11.1 環境変数の管理
- API キーは環境変数として設定
- .env ファイルをリポジトリにコミットしない
- 定期的にAPI キーをローテーション

### 11.2 アクセス制御
- Slack App の権限を最小限に設定
- Request URL の検証を実装済み

---

これでDeno Deployでの完全なデプロイメントが完了です！
質問やトラブルが発生した場合は、ログを確認して適切な対処を行ってください。