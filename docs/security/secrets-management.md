# シークレットと認証情報の扱い方

この教材のアプリは、いまの状態なら `.env` がなくても動きます。
ただし、学習の途中で外部 API やデプロイ先を増やすと、トークンやパスワードを扱うことがあります。

そのときに大事なのは、「便利だからコードに直書きしない」ことです。

## 1. `.env.example` と `.env` を使い分ける

このリポジトリには [.env.example](../../.env.example) を置いています。

- `.env.example`: 変数名だけを共有するテンプレート
- `.env`: 自分の PC にだけ置く実ファイル

`.env` は [.gitignore](../../.gitignore) に入っているので commit されません。
これは、実際のトークンやパスワードを Git 履歴に残さないためです。

使い方の例:

```bash
cp .env.example .env
```

Windows の PowerShell なら次でも大丈夫です。

```powershell
Copy-Item .env.example .env
```

## 2. 本物の値は `.env.example` に書かない

テンプレートには次のようなダミー値だけを置きます。

- `REPLACE_ME`
- `https://example.invalid`

本物の値を書いてしまうと、「テンプレートを共有しただけ」のつもりでも秘密情報の配布になります。

## 3. GitHub Actions では GitHub Secrets を使う

CI やデプロイで認証情報が必要になったら、workflow ファイルに直接書かず、GitHub の `Secrets` を使います。

考え方:

- workflow YAML には「名前」だけを書く
- 本物の値は GitHub の設定画面で管理する

さらに、環境ごとに分けたいときは `Environments` の Secrets を使うと管理しやすくなります。

## 4. クラウド認証は長期トークンを減らす

将来、クラウドへ自動デプロイする教材に広げる場合は、長く使い回す固定トークンより、一時的な認証方式を優先したほうが安全です。

理由は単純で、漏れたときの影響期間を短くしやすいからです。

この教材の GitHub Pages デプロイは長期アクセストークンを置かずに動くので、その考え方の入り口にもなります。

## 5. GitHub の secret scanning も併用する

ローカルでは `gitleaks` を使っていますが、それだけに頼らないほうが安全です。

GitHub で使える場合は、次も有効にしてください。

- `Secret scanning`
- `Push protection`

特に push protection は、push の時点で止める仕組みです。
「commit はしてしまったが、まだ GitHub には送っていない」段階で気づける可能性があります。

2026 年 6 月 7 日時点の GitHub Docs では、public repository への push については user-level の push protection が既定で有効です。
ただし、repository 側の secret scanning 設定や alert の出方はリポジトリ条件で変わるので、設定画面も確認するのが安全です。

## 6. 漏えいしたかもしれないときの順番

もし本物のトークンやパスワードを commit / push してしまったら、順番が大切です。

1. まず失効する
2. 次に履歴や差分から消す
3. 影響範囲を確認する

先にファイルだけ消しても、使えるトークンのままだと危険が残ります。

## 7. この教材での守り方

この教材では、次のように複数段で守っています。

- `.gitignore` で `.env` を commit しにくくする
- `.env.example` で共有してよい情報だけを分ける
- `gitleaks` でローカルと CI の両方から検査する
- GitHub の機能も使えるなら追加で有効にする

つまり、「うっかり」を 1 回のチェックに頼らず、何段かで止める作りです。

## 参考

- GitHub Docs:
  [Enabling secret scanning features](https://docs.github.com/en/code-security/secret-scanning/enabling-secret-scanning-features?learn=secret_scanning)
- GitHub Docs:
  [About push protection](https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection?learn=secret_scanning&learnProduct=code-security)
- GitHub Docs:
  [Working with push protection from the command line](https://docs.github.com/code-security/secret-scanning/working-with-secret-scanning-and-push-protection/working-with-push-protection-from-the-command-line)
