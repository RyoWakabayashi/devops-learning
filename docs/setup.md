# セットアップガイド

このページでは、macOS と Windows のどちらでも学習を始められるように、最初のセットアップ手順をまとめています。

## 1. `mise` をインストールする

`mise` は、Node.js や Python のバージョンをプロジェクトごとにそろえるためのツールです。

これを使う理由は次の通りです。

- 人によって Node.js のバージョンが違っても、同じコマンドで開発できる
- CI でも同じバージョンを使える
- 「自分の PC では動くのに CI では落ちる」を減らせる

### macOS

```bash
curl https://mise.run | sh
```

インストール後、`zsh` を使っているなら次を `~/.zshrc` に追加します。

```bash
eval "$(~/.local/bin/mise activate zsh)"
```

`~/.local/bin/mise` の場所は環境によって異なることがあります。うまくいかないときは公式ドキュメントを確認してください。

### Windows (PowerShell)

```powershell
winget install jdx.mise
mise activate pwsh | Out-String | Invoke-Expression
```

PowerShell を再起動してから `mise --version` を実行し、バージョンが表示されることを確認してください。

## 2. リポジトリを clone する

自分のフォークを clone します。

```bash
git clone <your-fork-url>
cd devops-learning
```

## 3. ツールと依存関係を入れる

```bash
mise install
mise run setup
```

`mise install` は `.mise.toml` を読み、必要な Node.js と Python をそろえます。
`mise run setup` は `pnpm install --frozen-lockfile`、Python パッケージのインストール、Playwright のブラウザ準備をまとめて実行します。
このとき `gitleaks` も `mise` でそろうので、macOS と Windows で別々の導入手順を覚えなくて済みます。

`--frozen-lockfile` を使う理由は、`pnpm-lock.yaml` に書かれた依存関係を勝手に変えないためです。
学習者ごとに違うバージョンが入ると、「自分の PC では通るのに CI では落ちる」が起きやすくなります。

外部 API を使う課題に広げたいときは、`.env.example` を `copy` して `.env` を作る形にしてください。
本物の値を `.env.example` やソースコードに直接書かないのは、Git 履歴へ秘密情報を残さないためです。

## 4. `pre-commit` を有効にする

```bash
mise exec -- python -m pre_commit install --hook-type pre-commit --hook-type pre-push
mise exec -- python -m pre_commit run --all-files
```

ここでやっていること:

- `pre-commit`:
  コミット前に `gitleaks`、formatter、lint、大きすぎる追加ファイルの検査を自動実行する
- `pre-push`:
  push 前に単体テストを自動実行する

つまり、「GitHub に送る前に、自分の PC で気づけるミスは先に止める」ための仕組みです。

特に `gitleaks` は大事です。API キーやトークンのような値は、push したあとに消すのが大変だからです。
コードのバグは修正コミットで直せますが、漏えいしたシークレットは失効やローテーションまで必要になることがあります。

## 5. 動作確認をする

```bash
pnpm run dev
```

別ターミナルで次も試してください。

```bash
pnpm run check
```

シークレット検査だけ先に試したいときは、次でも確認できます。

```bash
pnpm run secret-scan
pnpm run audit
```

`pnpm run audit` は、使っている OSS に「既知の脆弱性」がないか調べるコマンドです。
ここでいう脆弱性は、攻撃に悪用される可能性がある既知の弱点のことです。

## よくある詰まりポイント

### `mise` が見つからない

- macOS:
  シェル設定を追加したあとに、ターミナルを開き直してください。
- Windows:
  PowerShell を再起動してください。

### `pre-commit` が見つからない

`mise run setup` が成功しているか確認してください。成功していれば、次のコマンドでも動きます。

```bash
mise exec -- python -m pre_commit --version
```

### commit 時に `pnpm` や `gitleaks` が見つからない

`pre-commit` は通常のターミナルとは少し違う実行環境で hook を動かします。
そのため、ターミナルでは `pnpm` を打てても、hook 側では PATH が足りずに見つからないことがあります。

この教材では hook から `mise` 経由でツールを起動するようにしています。
最新の状態を取り込んだあと、必要なら一度次を実行してください。

```bash
mise exec -- python -m pre_commit clean
mise exec -- python -m pre_commit run --all-files
```

### Playwright のブラウザ準備で失敗する

もう一度次を実行してください。

```bash
pnpm exec playwright install chromium
```

Linux の CI では OS 依存パッケージも必要なので、GitHub Actions 側で `--with-deps` を使っています。ローカルでそこまで入れないのは、Windows や macOS と共通化しやすくするためです。

### `gitleaks` で引っかかった

まずは本当に秘密情報が入っていないか確認してください。

- もし本物の API キーやトークンなら:
  コミットしないで削除する
- ダミー値や教材用の文字列なら:
  まずは表現を変えられないか考える

どうしても意図的に残す必要があるときだけ、`gitleaks:allow` コメントや `.gitleaksignore` を検討します。
例外は便利ですが、増やしすぎると本当に危ない値を見落としやすくなるためです。

### 大きなファイルで止まった

この教材では `pre-commit` が 500KB を超える新規追加ファイルを止めます。

理由は、次のような事故を減らすためです。

- `dist/` や `playwright-report/` をうっかり commit する
- 大きな画像や動画を勢いで差分に含める
- レビューしにくい生成物が PR に混ざる

もし本当に必要な成果物なら、Git に入れるべきか、それとも artifact として扱うべきかを先に考えてください。

## 公式ドキュメント

- `mise`: [Getting Started](https://mise.jdx.dev/getting-started)
- `pnpm`: [pnpm](https://pnpm.io/)
- `gitleaks`: [gitleaks/gitleaks](https://github.com/gitleaks/gitleaks)
