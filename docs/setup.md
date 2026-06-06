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
`mise run setup` は `npm ci`、Python パッケージのインストール、Playwright のブラウザ準備をまとめて実行します。

## 4. `pre-commit` を有効にする

```bash
python -m pre_commit install --hook-type pre-commit --hook-type pre-push
python -m pre_commit run --all-files
```

ここでやっていること:

- `pre-commit`:
  コミット前に formatter や lint を自動実行する
- `pre-push`:
  push 前に単体テストを自動実行する

つまり、「GitHub に送る前に、自分の PC で気づけるミスは先に止める」ための仕組みです。

## 5. 動作確認をする

```bash
npm run dev
```

別ターミナルで次も試してください。

```bash
npm run check
```

## よくある詰まりポイント

### `mise` が見つからない

- macOS:
  シェル設定を追加したあとに、ターミナルを開き直してください。
- Windows:
  PowerShell を再起動してください。

### `pre-commit` が見つからない

`mise run setup` が成功しているか確認してください。成功していれば、次のコマンドでも動きます。

```bash
python -m pre_commit --version
```

### Playwright のブラウザ準備で失敗する

もう一度次を実行してください。

```bash
npx playwright install chromium
```

Linux の CI では OS 依存パッケージも必要なので、GitHub Actions 側で `--with-deps` を使っています。ローカルでそこまで入れないのは、Windows や macOS と共通化しやすくするためです。

## 公式ドキュメント

- `mise`: [Getting Started](https://mise.jdx.dev/getting-started)
