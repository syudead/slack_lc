# Documentation

このディレクトリには、LangChain Slack Bot のセットアップとデプロイに関するドキュメントが含まれています。

## 📚 ドキュメント一覧

### 🔧 セットアップガイド

- **[SLACK_SETUP.md](./SLACK_SETUP.md)** - Slack App の作成とワークスペースへの設定方法
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Deno Deploy を使用したデプロイメント手順

### 📄 設定ファイル

- **[slack-app-manifest.json](./slack-app-manifest.json)** - Slack App を自動作成するためのマニフェストファイル

### 📋 仕様書

- **[PROJECT_SPEC.md](./PROJECT_SPEC.md)** - プロジェクトの詳細仕様とアーキテクチャ

## 🚀 クイックスタート

1. **Slack App の作成**: `SLACK_SETUP.md` の手順に従って Slack App を作成
2. **デプロイメント**: `DEPLOYMENT_GUIDE.md` の手順に従って Deno Deploy にデプロイ
3. **動作確認**: Slack ワークスペースでボットをテスト

## 📋 セットアップチェックリスト

### Slack App 設定
- [ ] Slack App を作成（マニフェストまたは手動）
- [ ] Bot Token Scopes を設定
- [ ] Event Subscriptions を有効化
- [ ] Request URL を設定
- [ ] ワークスペースにインストール

### Deno Deploy 設定
- [ ] GitHub リポジトリと連携
- [ ] 環境変数を設定
- [ ] デプロイメントを実行
- [ ] ヘルスチェックで動作確認

### 環境変数
- [ ] `SLACK_BOT_TOKEN`
- [ ] `SLACK_SIGNING_SECRET`
- [ ] `LLM_PROVIDER`
- [ ] 対応する LLM API キー

## 🔗 関連リンク

- [Slack API Documentation](https://api.slack.com/)
- [Deno Deploy Documentation](https://deno.com/deploy/docs)
- [LangChain Documentation](https://js.langchain.com/docs/)

## 💡 ヒント

- Slack App Manifest を使用すると、設定を自動化できます
- 環境変数は Deno Deploy Dashboard で安全に管理されます
- トラブルシューティング情報は各ガイドに含まれています

---

問題が発生した場合は、該当するドキュメントのトラブルシューティングセクションを確認してください。