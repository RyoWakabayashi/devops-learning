# GitHub Pages 公開ガイド

このリポジトリでは、`main` ブランチへマージされた内容を GitHub Actions でビルドし、その成果物を GitHub Pages に公開します。

## GitHub Pages とは

GitHub が提供している静的サイト公開機能です。
HTML、CSS、JavaScript のような「ビルド済みファイル」を公開するのに向いています。

この教材では、Vue アプリを `vite build` で静的ファイルへ変換し、その結果を Pages に置いています。

## 最初にやる設定

自分のフォークでも公開したい場合は、次を 1 回行ってください。

1. GitHub で自分のフォークリポジトリを開く
2. `Settings` を開く
3. 左メニューの `Pages` を開く
4. `Build and deployment` の `Source` を `GitHub Actions` にする

ここを `GitHub Actions` にする理由は、`gh-pages` ブランチへファイルを直接 push する方式よりも、ビルドとデプロイの流れをワークフローで追いやすいからです。

## このリポジトリのデプロイフロー

`deploy-pages.yml` では次の順番で動きます。

1. リポジトリを checkout する
2. `mise` でツールをそろえる
3. `npm run build` で Vue アプリをビルドする
4. `dist/` を Pages 用の artifact としてアップロードする
5. `actions/deploy-pages` で公開する

## `base` 設定が必要な理由

GitHub Pages の project site は、たとえば次のような URL になります。

```text
https://<user>.github.io/<repository-name>/
```

このとき、アプリ内の CSS や JavaScript の参照先も `/<repository-name>/...` になる必要があります。
そのため `vite.config.ts` では、GitHub Actions 上でビルドしているときだけ、リポジトリ名を使って `base` を切り替えています。

これを入れないと、公開後に `404` になって画面が真っ白になることがあります。

## 公開 URL の確認方法

`deploy-pages` ワークフローが成功したら、次のどちらかで確認できます。

- `Actions` タブで `deploy-pages` を開く
- `Settings` → `Pages` を開く

公開 URL は次の形になります。

```text
https://<your-github-user>.github.io/<your-repository-name>/
```

## うまく公開されないときの確認ポイント

### 1. `Pages` の `Source` が違う

`Deploy from a branch` になっていると、Actions のデプロイ結果が使われません。
`GitHub Actions` に切り替えてください。

### 2. `main` へマージしていない

この教材では `main` への push だけでデプロイが走ります。
PR だけでは公開されません。

### 3. `build` は成功したが画面が真っ白

`vite.config.ts` の `base` が合っていない可能性があります。
自分のフォーク名に応じてパスが変わるため、手で固定値を書いてしまうと壊れやすいです。

## 参考

- GitHub Docs:
  [Using custom workflows with GitHub Pages](https://docs.github.com/ja/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- GitHub Docs:
  [Configuring a publishing source for your GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
