# ♔ チェスアプリ ♚

React + Vite + TypeScript で作成されたシンプルなチェスアプリです。

![Chess App](https://img.shields.io/badge/React-18.3-blue)
![Vite](https://img.shields.io/badge/Vite-6.0-purple)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)

## 📋 機能

- ✅ 完全なチェスルールの実装
  - 全ての駒の移動ルール（キング、クイーン、ルーク、ビショップ、ナイト、ポーン）
  - チェック検出
  - チェックメイト検出
  - ステイルメイト検出
  - ポーンの自動プロモーション（クイーンに昇格）
- ✅ 有効な移動先のハイライト表示
- ✅ 取られた駒の表示
- ✅ ターン表示
- ✅ ゲームリセット機能
- ✅ レスポンシブデザイン
- ✅ ダークモード対応

## 🚀 ローカルでの起動方法

### 必要な環境

- [Node.js](https://nodejs.org/) (v18以上推奨)
- yarn

### インストールと起動

```bash
# リポジトリをクローン（または直接ダウンロード）
cd RenderSample

# 依存関係をインストール
yarn install

# 開発サーバーを起動
yarn dev
```

開発サーバーが起動したら、ブラウザで [http://localhost:5173](http://localhost:5173) を開いてください。

### ビルド

本番用にビルドする場合：

```bash
yarn build
```

ビルド結果は `dist` フォルダに出力されます。

### ビルド結果のプレビュー

```bash
yarn preview
```

## 🎮 遊び方

1. **駒を選択**: 自分のターンの色の駒をクリックして選択します
2. **移動先を選択**: 有効な移動先（薄い円で表示）をクリックして駒を移動します
3. **駒の取得**: 相手の駒がある有効な移動先をクリックすると、その駒を取ることができます
4. **ゲームリセット**: 「新しいゲーム」ボタンをクリックすると、最初からやり直せます

### ルール

- 白が先攻です
- 自分のキングがチェック状態になる移動はできません
- チェックメイト（キングが逃げられない状態）になったら負けです
- ステイルメイト（有効な移動がない状態でチェックではない）は引き分けです

## 🌐 Render.com へのデプロイ

### 手順

1. [Render.com](https://render.com/) にアカウントを作成/ログイン

2. ダッシュボードで「New +」→「Static Site」を選択

3. GitHubリポジトリを接続するか、パブリックリポジトリのURLを入力

4. 以下の設定を行います：

   | 項目 | 値 |
   |------|-----|
   | Name | chess-app（任意） |
   | Branch | main |
   | Build Command | `corepack enable && yarn install && yarn build` |
   | Publish Directory | `dist` |

5. 「Create Static Site」をクリック

6. デプロイが完了すると、自動生成されたURLでアプリにアクセスできます

### 環境変数

このアプリではサーバーサイドの環境変数は不要です。

## 📁 プロジェクト構成

```
RenderSample/
├── public/
│   └── vite.svg          # ファビコン
├── src/
│   ├── components/       # UIコンポーネント
│   │   ├── Board.tsx     # チェスボード
│   │   ├── GameInfo.tsx  # ゲーム情報パネル
│   │   ├── Piece.tsx     # 駒
│   │   └── Square.tsx    # マス目
│   ├── hooks/
│   │   └── useChess.ts   # チェスゲームのカスタムフック
│   ├── types/
│   │   └── chess.ts      # TypeScript型定義
│   ├── utils/
│   │   └── chessLogic.ts # チェスのルールロジック
│   ├── App.tsx           # メインコンポーネント
│   ├── App.css           # スタイル
│   ├── main.tsx          # エントリーポイント
│   └── index.css         # グローバルスタイル
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

## 🛠️ 技術スタック

- **フレームワーク**: [React](https://react.dev/) 18.3
- **ビルドツール**: [Vite](https://vitejs.dev/) 6.0
- **言語**: [TypeScript](https://www.typescriptlang.org/) 5.6
- **ホスティング**: [Render.com](https://render.com/) (Static Sites)

## 📝 ライセンス

MIT License
