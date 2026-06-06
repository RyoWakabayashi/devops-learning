# ハンズオン: ブランチ作成から PR、マージまで

この手順では、CI/CD を学ぶための一連の流れを自分で実行します。

## ゴール

- ブランチを切る
- 小さな変更を 1 つ入れる
- `pre-commit` とローカルチェックを通す
- push して PR を作る
- CI の結果を確認する
- `main` へマージする
- GitHub Pages へ反映されることを確認する

## 0. 事前準備

先に [docs/setup.md](setup.md) を終わらせてください。

## 1. 自分の作業ブランチを作る

```bash
git switch -c feature/change-theme
```

`branch` は「作業の分かれ道」です。
本番用の `main` を直接触らずに、安全に作業するために使います。

## 2. 小さな変更を入れる

最初は分かりやすい変更がおすすめです。

- `src/App.vue` の見出しを少し変える
- `src/style.css` の色を少し変える
- `src/content/missions.ts` の文言を変える

学習の最初は、ロジック変更よりも「差分が読みやすい変更」のほうが PR の流れを追いやすいです。

## 3. ローカルで確認する

```bash
npm run check
```

時間を短くしたいときは、まず次だけでも大丈夫です。

```bash
npm run lint
npm run typecheck
npm run test:unit
```

## 4. コミットする

```bash
git status
git add .
git commit -m "Change the game theme for learning mission"
```

コミットは「ここまでの変更をひとかたまりとして保存すること」です。
メッセージは、あとから読んで何を変えたか分かるように書きます。

## 5. push する

```bash
git push -u origin feature/change-theme
```

これで GitHub 上の自分のフォークへブランチが送られます。

## 6. Pull Request を作る

GitHub を開くと、送ったブランチから `Compare & pull request` を出せます。

PR には次の内容を書くと、レビューしやすくなります。

- 何を変えたか
- なぜ変えたか
- どう確認したか

このリポジトリには PR テンプレートも入っているので、それに沿って埋めてください。

## 7. CI の結果を見る

PR を作ると `Actions` タブ、または PR 画面から CI の状態が見られます。

見るポイント:

- `quality` ジョブが通っているか
- `e2e` ジョブが通っているか
- 落ちたときはどのステップで止まったか

もし `Playwright` が失敗したら、アーティファクトとして保存されたレポートをダウンロードして確認できます。

## 8. 修正して再 push する

CI が落ちたら、ローカルで直して同じブランチへ push し直します。

```bash
git add .
git commit -m "Fix CI failure in theme update"
git push
```

PR は作り直さなくて大丈夫です。
同じブランチへ push すると、PR が自動で更新されます。

## 9. `main` へマージする

CI が通ってレビューも終わったら、PR をマージします。

この教材では、`main` へ入った変更だけが GitHub Pages に公開されます。

## 10. Pages の公開を確認する

マージ後、`deploy-pages` ワークフローが成功したら、公開 URL を確認します。

詳しくは [docs/github-pages.md](github-pages.md) を見てください。

## おすすめの 3 ミッション

### ミッション 1

- ブランチ名:
  `feature/change-theme`
- 内容:
  色や見出しを変える

### ミッション 2

- ブランチ名:
  `feature/tune-game-balance`
- 内容:
  `src/game/constants.ts` の敵配置や残機数を変える
- 追加学習:
  `src/game/engine.test.ts` も直す

### ミッション 3

- ブランチ名:
  `feature/deploy-verification`
- 内容:
  ドキュメントを更新して `main` へマージし、Pages 反映まで確認する
