# LangChain Slack Bot

Deno Deploy 上で動作する LangChain を使用したインテリジェントな Slack ボットです。OpenAI、Claude、DeepSeek の複数の LLM プロバイダーをサポートしています。

## 🤖 機能

- **マルチ LLM サポート**: OpenAI GPT、Anthropic Claude、DeepSeek から選択可能
- **Slack イベント処理**: メンション、DM、チャンネルメッセージに対応
- **リアルタイム応答**: LangChain を使用した高品質な AI 応答
- **セキュアな通信**: Slack Signing Secret による リクエスト検証
- **スケーラブル**: Deno Deploy でのサーバーレス実行

## 🚀 クイックスタート

### 1. リポジトリのクローン
```bash
git clone https://github.com/your-username/slack-langchain-bot.git
cd slack-langchain-bot
```

### 2. Slack App の作成
詳細な手順は [`SLACK_SETUP.md`](./SLACK_SETUP.md) を参照してください。

### 3. 環境変数の設定
`.env.example` を参考に環境変数を設定:

```bash
# Slack設定
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your-signing-secret

# LLMプロバイダー（いずれか選択）
LLM_PROVIDER=openai  # または claude, deepseek
OPENAI_API_KEY=sk-your-key
```

### 4. ローカル開発
```bash
# 依存関係のテスト
deno test --allow-net --allow-env

# アプリケーション起動
deno task dev
```

### 5. Deno Deploy にデプロイ
詳細な手順は [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) を参照してください。

## 📁 プロジェクト構成

```
├── main.ts                 # エントリーポイント
├── src/
│   ├── handlers/           # イベント・メッセージハンドラ
│   │   ├── slack-events.ts
│   │   └── message.ts
│   ├── services/           # LangChain・Slack サービス
│   │   ├── langchain.ts
│   │   └── slack.ts
│   ├── utils/              # 設定・認証ユーティリティ
│   │   ├── config.ts
│   │   └── auth.ts
│   └── types/              # TypeScript 型定義
│       ├── slack.ts
│       └── llm.ts
├── tests/                  # テストファイル
├── deno.json              # Deno設定・依存関係
├── CLAUDE.md              # Claude Code 向け指示
├── SLACK_SETUP.md         # Slack App セットアップガイド
├── DEPLOYMENT_GUIDE.md    # デプロイメントガイド
└── README.md              # このファイル
```

## 🔧 LLM プロバイダー設定

### OpenAI (デフォルト)
```bash
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-openai-key
```

### Anthropic Claude
```bash
LLM_PROVIDER=claude
CLAUDE_API_KEY=sk-ant-your-claude-key
```

### DeepSeek
```bash
LLM_PROVIDER=deepseek
DEEPSEEK_API_KEY=sk-your-deepseek-key
```

## 🧪 テスト

```bash
# 全テスト実行
deno test --allow-net --allow-env

# 特定テストファイル実行
deno test --allow-net --allow-env tests/config_test.ts
```

## 📚 API エンドポイント

| エンドポイント | メソッド | 説明 |
|--------------|---------|------|
| `/health` | GET | ヘルスチェック |
| `/slack/events` | POST | Slack イベント受信 |

## 🔒 セキュリティ

- **リクエスト検証**: Slack Signing Secret による署名検証
- **環境変数**: API キーは環境変数で安全に管理
- **最小権限**: 必要最小限の Slack 権限のみ使用

## 🛠 開発

### 必要な権限
```bash
deno run --allow-net --allow-env main.ts
```

### 開発コマンド
```bash
# 開発サーバー起動（ファイル監視）
deno task dev

# テスト実行
deno task test

# デプロイ
deno task deploy
```

## 📋 Slack 権限

Bot に必要な Slack 権限:
- `app_mentions:read` - メンション読み取り
- `channels:history` / `channels:read` - チャンネルアクセス
- `chat:write` - メッセージ送信
- `groups:history` / `groups:read` - プライベートチャンネルアクセス
- `im:history` / `im:read` / `im:write` - DM アクセス
- `mpim:history` / `mpim:read` / `mpim:write` - グループ DM アクセス
- `users:read` - ユーザー情報読み取り

## 🐛 トラブルシューティング

### よくある問題

**Bot が応答しない場合:**
1. 環境変数が正しく設定されているか確認
2. Bot がチャンネルに招待されているか確認
3. Deno Deploy のログを確認

**デプロイが失敗する場合:**
1. `deno.json` の imports 設定を確認
2. 環境変数がDeno Deploy で設定されているか確認
3. Slack Request URL が正しく設定されているか確認

詳細は [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) を参照してください。

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. Pull Request を作成

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 🙏 謝辞

- [LangChain](https://langchain.com/) - AI アプリケーションフレームワーク
- [Deno](https://deno.com/) - モダンな JavaScript/TypeScript ランタイム
- [Slack API](https://api.slack.com/) - Slack 統合
- [OpenAI](https://openai.com/), [Anthropic](https://anthropic.com/), [DeepSeek](https://deepseek.com/) - LLM プロバイダー

---
🤖 **Powered by LangChain & Deno Deploy**