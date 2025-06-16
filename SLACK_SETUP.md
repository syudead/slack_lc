# Slack App セットアップガイド

このガイドでは、LangChain AI BotをSlackワークスペースにセットアップする手順を説明します。

## 1. Slack アプリの作成

### 方法A: App Manifest を使用（推奨）

1. [Slack API](https://api.slack.com/apps) にアクセス
2. 「Create New App」をクリック
3. 「From an app manifest」を選択
4. ワークスペースを選択
5. `slack-app-manifest.json` の内容をコピー&ペースト
6. 「Next」→「Create」をクリック

### 方法B: 手動設定

1. [Slack API](https://api.slack.com/apps) にアクセス
2. 「Create New App」→「From scratch」を選択
3. App Name: `LangChain AI Bot`
4. ワークスペースを選択して「Create App」

## 2. OAuth & Permissions の設定

### Bot Token Scopes
以下の権限を追加:

**Bot Token Scopes:**
- `app_mentions:read` - メンションの読み取り
- `channels:history` - パブリックチャンネルのメッセージ履歴
- `channels:read` - パブリックチャンネル情報の読み取り
- `chat:write` - メッセージの送信
- `groups:history` - プライベートチャンネルのメッセージ履歴
- `groups:read` - プライベートチャンネル情報の読み取り
- `im:history` - DMのメッセージ履歴
- `im:read` - DM情報の読み取り
- `im:write` - DMでのメッセージ送信
- `mpim:history` - グループDMのメッセージ履歴
- `mpim:read` - グループDM情報の読み取り
- `mpim:write` - グループDMでのメッセージ送信
- `users:read` - ユーザー情報の読み取り

## 3. Event Subscriptions の設定

1. 「Event Subscriptions」に移動
2. 「Enable Events」をオンにする
3. **Request URL**: `https://your-project-name.deno.dev/slack/events`
   - ⚠️ **重要**: `your-project-name` をDenoプロジェクト名に置き換える
4. 「Subscribe to bot events」で以下を追加:
   - `app_mention` - @メンションされた時
   - `message.channels` - パブリックチャンネルでのメッセージ
   - `message.groups` - プライベートチャンネルでのメッセージ  
   - `message.im` - ダイレクトメッセージ
   - `message.mpim` - グループダイレクトメッセージ

## 4. App Home の設定（オプション）

1. 「App Home」に移動  
2. 「Home Tab」をオンにする
3. 「Messages Tab」をオンにする
4. 「Allow users to send Slash commands and messages from the messages tab」をオンにする

## 5. Bot User の設定

1. 「App Home」に移動
2. Display Name: `LangChain Bot`
3. Default Username: `langchain-bot`
4. 「Always Show My Bot as Online」をオンにする

## 6. API Keys の取得

### Bot Token
1. 「OAuth & Permissions」に移動
2. 「Bot User OAuth Token」をコピー
   - 形式: `xoxb-...`
   - これが `SLACK_BOT_TOKEN` 環境変数になります

### Signing Secret  
1. 「Basic Information」に移動
2. 「App Credentials」セクションの「Signing Secret」を表示
3. 値をコピー
   - これが `SLACK_SIGNING_SECRET` 環境変数になります

## 7. ワークスペースへのインストール

1. 「Install App」に移動
2. 「Install to Workspace」をクリック
3. 権限を確認して「Allow」をクリック

## 8. 環境変数の設定

Deno Deploy で以下の環境変数を設定:

```bash
# 必須
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_SIGNING_SECRET=your-signing-secret-here

# LLM Provider設定（いずれか1つ）
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-openai-key

# または
LLM_PROVIDER=claude  
CLAUDE_API_KEY=sk-ant-your-claude-key

# または
LLM_PROVIDER=deepseek
DEEPSEEK_API_KEY=sk-your-deepseek-key
```

## 9. 動作確認

### Request URL の検証
1. Event Subscriptions の Request URL が正しく設定されているか確認
2. Deno Deploy のログでイベントが受信されているか確認

### Bot の動作テスト
1. Slackワークスペースで Bot をチャンネルに招待:
   ```
   /invite @LangChain Bot
   ```

2. メンションしてテスト:
   ```
   @LangChain Bot こんにちは！
   ```

3. ダイレクトメッセージでテスト:
   - Bot にDMを送信

## 10. トラブルシューティング

### よくある問題

**Request URL の検証が失敗する場合:**
- Deno Deploy のデプロイが完了しているか確認
- 環境変数が正しく設定されているか確認
- URLが正しいか確認（https://your-project-name.deno.dev/slack/events）

**Bot が応答しない場合:**
- Bot Token と Signing Secret が正しいか確認
- 必要な権限が設定されているか確認
- Deno Deploy のログでエラーを確認

**Event が受信されない場合:**
- Event Subscriptions が有効になっているか確認
- 適切なイベントタイプが設定されているか確認
- Bot がチャンネルに招待されているか確認

### ログの確認方法
1. Deno Deploy Dashboard にアクセス
2. プロジェクトを選択
3. 「Logs」タブでリアルタイムログを確認

## 11. セキュリティ考慮事項

- API Keys は安全に管理し、公開リポジトリにコミットしない
- Signing Secret は必ず設定し、リクエストの検証を行う
- 最小限の権限のみを付与する
- 定期的にトークンをローテーションする

## サポート

問題が発生した場合は、以下を確認してください:
1. Deno Deploy のログ
2. Slack API のイベント配信ログ
3. 環境変数の設定
4. ネットワーク接続

---

これでSlack Botの設定が完了です！Bot と会話を楽しんでください。