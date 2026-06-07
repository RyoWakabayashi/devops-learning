# DevOps Learning Lab

Vue で作った簡易シューティングゲームを題材に、`fork` からブランチ作成、コミット、PR、マージ、GitHub Pages 公開までを一通り体験できる学習用リポジトリです。

新人エンジニア向けに、次の 2 つを同時に学べるようにしています。

- アプリを少しずつ変更しながら、`Vue` と `TypeScript` の基本に触れること
- `CI/CD` の仕組みを、`pre-commit`、単体テスト、`Playwright`、`Storybook`、`GitHub Actions` を通して体験すること

## この教材でできること

- `mise` で Node.js と Python のバージョンをそろえる
- `pre-commit` でコミット前に整形、Lint、型検査を自動実行する
- `gitleaks` で API キーやトークンのような機密情報を検出する
- `pnpm` の lockfile、脆弱性監査、SBOM 生成で OSS 依存関係を安全に扱う
- `Vitest` でゲームロジックの単体テストを回す
- `Playwright` でブラウザ上の操作確認を自動化する
- `Storybook` で UI パーツを単体で確認する
- `GitHub Actions` で CI を動かす
- `GitHub Pages` へ自動デプロイする

## はじめ方

詳しい手順は [docs/setup.md](docs/setup.md) にまとめています。最短の流れだけ先に書くと次の通りです。

### 1. リポジトリをフォークする

GitHub 上でこのリポジトリを `Fork` してください。研修や演習では、元リポジトリを直接壊さずに安全に試せるためです。

### 2. ツールを入れる

このリポジトリでは `mise` を使って、開発に必要なツールのバージョンをそろえます。

- macOS:
  `curl https://mise.run | sh`
- Windows (PowerShell):
  `winget install jdx.mise`

インストール後は、公式ガイドに沿ってシェル連携を有効にしてください。

- `mise` 公式: [Getting Started](https://mise.jdx.dev/getting-started)

### 3. 依存関係をセットアップする

```bash
mise install
mise run setup
mise exec -- python -m pre_commit install --hook-type pre-commit --hook-type pre-push
```

`mise run setup` を使う理由は、ローカルでも CI でも「ほぼ同じコマンド」で動く状態を作るためです。手順が 1 つにまとまっていると、トラブル時の切り分けもしやすくなります。

### 4. 開発サーバーを起動する

```bash
pnpm run dev
```

ブラウザで表示された URL を開くと、学習用のシューティングゲームを確認できます。

## 日常的に使うコマンド

```bash
pnpm run dev              # アプリを起動
pnpm run lint             # ESLint
pnpm run lint:docs        # Markdown のチェック
pnpm run secret-scan      # シークレット混入の検査
pnpm run audit            # OSS 依存関係の脆弱性監査
pnpm run typecheck        # TypeScript の型検査
pnpm run test:unit        # Vitest
pnpm run test:e2e         # Playwright
pnpm run storybook        # Storybook を起動
pnpm run storybook:build  # Storybook を静的ビルド
pnpm run sbom             # SBOM を生成
pnpm run check            # 主要な確認をまとめて実行
```

## 学習の進め方

次の順番で進めると、CI/CD の流れが追いやすくなります。

1. [docs/handson.md](docs/handson.md) を読み、フォークとブランチ作成を行う
2. `src/` の小さな変更を 1 つ入れる
3. `pre-commit` と `pnpm run check` を通す
4. GitHub に push して PR を作る
5. `Actions` タブで CI の結果を確認する
6. `main` へマージして GitHub Pages の公開を確認する

## ドキュメント一覧

- [docs/setup.md](docs/setup.md): macOS / Windows の初期セットアップ
- [docs/cicd-explained.md](docs/cicd-explained.md): CI/CD と各ツールの役割
- [docs/handson.md](docs/handson.md): ブランチ、コミット、PR、マージの演習手順
- [docs/github-pages.md](docs/github-pages.md): GitHub Pages の設定と公開確認
- [docs/repository-settings.md](docs/repository-settings.md): fork 後に見直したい GitHub リポジトリ設定
- [docs/security/secrets-management.md](docs/security/secrets-management.md): `.env`、GitHub Secrets、漏えい時の初動
- [docs/security/oss-dependencies.md](docs/security/oss-dependencies.md): OSS 依存関係を安全に扱う理由と設定

## ディレクトリ構成

```text
src/
  components/   UI コンポーネント
  content/      学習ミッションの文言
  game/         テストしやすいゲームロジック
tests/e2e/      Playwright の E2E テスト
.storybook/     Storybook 設定
.github/
  workflows/    GitHub Actions の CI/CD 定義
```

## このリポジトリの CI/CD がどう動くか

- `pre-commit`:
  コミット前に `gitleaks`、整形、Lint、Markdown チェック、型検査、大きすぎる追加ファイルの検査を走らせます。
- `pre-push`:
  push 前に単体テストを走らせます。
- `CI` ワークフロー:
  GitHub 上で、同じチェックとリポジトリ全体への `gitleaks` スキャンをもう一度実行します。あわせて `pnpm audit` と SBOM 生成も行います。ローカルで `--no-verify` を使っても、ここで止まります。
- `Deploy Pages` ワークフロー:
  `main` ブランチへ入った変更だけを GitHub Pages に公開します。

## なぜ `gitleaks` が必要か

`gitleaks` は、パスワード、API キー、アクセストークンのような「外に出てはいけない値」が Git に入っていないかを確認するツールです。

これが必要な理由は、シークレット漏えいは普通のコードミスより後始末が重いからです。

- コミットした瞬間に Git の履歴へ残る
- いったん push すると、PR や fork に広がることがある
- ファイルを消すだけでは足りず、履歴の書き換えやキーの失効が必要になる

この教材では、次の 3 段階で止めるようにしています。

- `pre-commit`: いちばん早く気づくため
- `pnpm run secret-scan`: 自分でまとめて確認できるようにするため
- GitHub Actions: フックを飛ばしても最終的に止めるため

この構成にしている理由は、「早く失敗を見つける段階」と「最終的に守る段階」を分けるためです。

- ローカル: 自分ですぐ直せる
- CI: チーム全体に入る前に止める
- CD: 安全確認が終わったものだけ公開する

## なぜ OSS 依存関係の安全設定が必要か

アプリ本体のコードだけでなく、外部から入れるパッケージもソフトウェアの一部です。
そのため、便利だからといって最新をすぐ取り込むだけだと、脆弱性や不正な公開の影響を受けることがあります。

この教材では、依存関係について次の考え方を学べるようにしています。

- `pnpm-lock.yaml` をコミットして、全員が同じ依存バージョンを使う
- `minimumReleaseAge` で、公開されたばかりのパッケージをすぐには採用しない
- `pnpm run audit` で、既知の脆弱性がないか確認する
- `Dependabot` の `cooldown` で、更新 PR が出るタイミングにも待ち時間を入れる
- `pnpm run sbom` で、どの OSS を使っているか一覧化する

それぞれの仕組みは [docs/security/oss-dependencies.md](docs/security/oss-dependencies.md) で詳しく説明しています。

## GitHub 側の設定も学習対象

CI/CD は YAML を書くだけでは完成しません。
GitHub の設定画面で有効にする項目もあり、そこまで含めて初めて「安全に merge して公開する流れ」が作れます。

この教材では次も一緒に確認できるようにしています。

- `Rulesets` で `main` への直接 push を防ぐ
- 必須の status check を設定して、CI が通らない変更を merge しない
- `Secret scanning` や `Push protection` が使える場合は有効にする
- GitHub Pages の公開元を `GitHub Actions` にする

設定手順は [docs/repository-settings.md](docs/repository-settings.md) にまとめています。

## 参考にした公式ドキュメント

- `mise`: [Getting Started](https://mise.jdx.dev/getting-started)
- `pnpm`: [pnpm](https://pnpm.io/)
- `gitleaks`: [gitleaks/gitleaks](https://github.com/gitleaks/gitleaks)
- GitHub Pages: [Using custom workflows with GitHub Pages](https://docs.github.com/ja/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- GitHub Pages: [Configuring a publishing source for your GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
