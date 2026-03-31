# CC Switch Web

[English](README.md) | [中文](README_ZH.md) | 日本語

## 概要

CC Switch Web は [cc-switch](https://github.com/farion1231/cc-switch) の Web ブランチ用リポジトリです。

このリポジトリは、CC Switch に関する Web 向け実装、関連する実験、そしてブランチ固有の調整を管理するために使用されます。

現在の想定アーキテクチャは次の通りです。

- フロントエンド: Web
- バックエンド: ローカル Rust サービス
- アクセス方法: ブラウザで `http://localhost:xxxx` を開く

この方向は、通常の Windows / Linux 環境に加えて、デスクトップのない Linux サーバーも対象にしています。

## アップストリームとの関係

- アップストリームプロジェクト: [cc-switch](https://github.com/farion1231/cc-switch)
- このリポジトリは CC Switch の Web ブランチ方向に焦点を当てています
- プロジェクトの位置付けや外部向け説明が変わった場合は、このリポジトリ内の各言語版 README を同期して更新してください

## 補足

元の CC Switch プロジェクト、デスクトップアプリ、またはアップストリームのリリース情報を確認したい場合は、上流リポジトリを直接参照してください。

## 実行方法

### ローカル実行

1. 依存関係をインストールします。

   ```bash
   pnpm install --frozen-lockfile
   ```

2. 開発モードをワンコマンドで起動します。

   ```bash
   pnpm dev:web
   ```

   その後、[http://localhost:3000](http://localhost:3000) を開いてください。フロントエンドはローカル Rust サービス `http://127.0.0.1:8788` に接続します。

3. 本番に近い形でローカル実行する場合:

   ```bash
   pnpm build:web
   pnpm start:web
   ```

   その後、[http://localhost:8788](http://localhost:8788) を開いてください。

### Docker 実行

1. ビルドして起動します。

   ```bash
   docker compose up --build -d
   ```

2. [http://localhost:8788](http://localhost:8788) を開きます。

3. 停止します。

   ```bash
   docker compose down
   ```

4. 永続データは `cc-switch-web-data` volume に保存されます。

コンテナ内のサービスからホスト側の CLI 設定ディレクトリを直接管理したい場合は、`docker-compose.yml` に `.claude`、`.codex`、`.gemini`、`opencode`、`openclaw` などの bind mount を追加してください。
