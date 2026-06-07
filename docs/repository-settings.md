# GitHub リポジトリ設定ガイド

このページでは、fork したリポジトリで先に見直しておくと学習しやすい GitHub 設定をまとめます。

コードを書くだけでは CI/CD は完成しません。
GitHub 側で「どのブランチを守るか」「何が通ったら merge してよいか」を設定して、はじめて安全な運用になります。

## 1. Actions を有効にする

fork した直後は、GitHub Actions が止まっていることがあります。

1. 自分の fork を開く
2. `Actions` タブを開く
3. 有効化を求められたら `I understand my workflows, go ahead and enable them` を選ぶ

これをしないと、PR を作っても CI が動きません。

## 2. `main` を Rulesets で守る

`main` は公開につながるブランチです。
直接 push できるままだと、レビュー前の変更や CI 未通過の変更が入ってしまいます。

設定例:

1. `Settings` を開く
2. 左メニューの `Rules` を開く
3. `Rulesets` で branch ruleset を作る
4. 対象ブランチを `main` にする
5. 次を有効にする

- Pull Request を必須にする
- 承認を 1 人以上必須にする
- 必須 status check に `quality` と `e2e` を入れる
- force push を禁止する
- branch の削除を禁止する
- 会話の解決を必須にする
- 線形履歴を必須にする

`Rulesets` は「このブランチへどんな変更を許すか」をまとめて決める仕組みです。
branch protection rule より新しい考え方で、複数条件を整理しやすいのが利点です。

## 3. Secret scanning と Push protection を確認する

GitHub には、リポジトリ側でもシークレット混入を検出する機能があります。

使える場合は次を確認してください。

1. `Settings` を開く
2. `Security` または `Security and analysis` を開く
3. `Secret scanning`
4. `Push protection`

`gitleaks` と GitHub の機能は役割が少し違います。

- `gitleaks`: ローカルと CI で自分たちのルールで止める
- GitHub の機能: GitHub 側でも追加で検出する

複数の場所で検出できると、すり抜けに気づきやすくなります。

## 4. Pages の公開元を `GitHub Actions` にする

この教材の公開フローは、ビルドしてから artifact をデプロイする形です。
そのため Pages の `Source` は `GitHub Actions` にします。

手順は [github-pages.md](github-pages.md) に詳しくありますが、設定場所だけ先に書くと次です。

1. `Settings`
2. `Pages`
3. `Build and deployment`
4. `Source: GitHub Actions`

## 5. Workflow を変える PR を慎重に扱う

`.github/workflows/` の変更は、CI やデプロイの動きを直接変えます。
アプリ本体より影響範囲が広いので、レビューをいつもより丁寧に見る価値があります。

チームで運用するときは、次のようなルールが有効です。

- workflow 変更は必ず PR 経由にする
- 承認者を固定する
- 組織リポジトリでは `CODEOWNERS` で workflow 変更の承認者を分ける

## 6. なぜここまで設定するのか

新人のうちは「CI が通れば十分」に見えやすいですが、実運用ではそれだけだと足りません。

- CI が落ちていても merge できる
- レビューなしで `main` に入れられる
- シークレット混入に気づく場所が少ない

この状態だと、せっかく自動化しても事故を止めきれません。
GitHub の設定は、CI/CD を最後まで成立させるための「運用側のガード」です。

## 参考

- GitHub Docs:
  [About rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- GitHub Docs:
  [Enabling secret scanning features](https://docs.github.com/en/code-security/secret-scanning/enabling-secret-scanning-features?learn=secret_scanning)
- GitHub Docs:
  [About push protection](https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection?learn=secret_scanning&learnProduct=code-security)
