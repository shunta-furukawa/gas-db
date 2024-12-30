# gas-db

`gas-db` は Google Apps Script (GAS) を使って Google Sheets を簡単に操作するためのライブラリです。Google Sheets をデータベースのように扱い、CRUD 操作を直感的に実行できる API を提供します。

---

## 特徴

- Google Sheets をデータベースとして扱い、構造化されたデータ操作が可能。
- カラム名をキーとしてデータを取得・操作。
- データの条件付き検索やフィルタリングに対応。
- 行の挿入、更新、削除が簡単に実行可能。
- カラム名と列インデックスのマッピングを自動生成。

---

## インストール

1. このリポジトリをクローンします：
   ```
   git clone https://github.com/your-username/gas-db.git
   cd gas-db
   ```

2. コードを Google Apps Script プロジェクトにコピーします：
   - [GASエディタ](https://script.google.com/) を開きます。
   - このリポジトリ内の `sheet.js` と `spreadsheet.js` を GAS プロジェクトにコピーします。

3. **任意**: 外部ライブラリを使用する場合は、Webpack などのツールでコードをバンドルしてください。

---

## 使い方

以下は `gas-db` を使用する簡単な例です：

```
import Spreadsheet from './spreadsheet'; // 必要に応じてパスを調整

// アクティブなスプレッドシートを取得
const db = Spreadsheet.from();

// シートを名前で取得
const users = db.at('Users');

// すべてのデータを取得
const allUsers = users.findAll();
Logger.log(allUsers);

// 条件に基づいてデータをフィルタリング
const admins = users.find({ role: 'admin' });
Logger.log(admins);

// 新しいデータを挿入
users.insert({ name: 'John Doe', role: 'user', age: 30 });

// 条件に一致するデータを更新
users.update({ role: 'admin' }, { name: 'John Doe' });

// ヘッダ以外のすべての行を削除
users.clear();
```

---

## 貢献ガイドライン

このライブラリの改善に貢献いただけると嬉しいです！以下の手順に従ってください：

1. このリポジトリをフォークします。
2. フォークしたリポジトリをローカルにクローンします：
   ```
   git clone https://github.com/your-username/gas-db.git
   cd gas-db
   ```

3. 新しいブランチを作成します：
   ```
   git checkout -b feature/your-feature-name
   ```

4. 必要な変更を加えます。
5. 変更をコミットしてプッシュします：
   ```
   git add .
   git commit -m "Add feature: your-feature-name"
   git push origin feature/your-feature-name
   ```

6. プルリクエストを作成します。

---

## 国際化 (i18n)

このプロジェクトでは、デフォルトで英語のドキュメントを提供しています。日本語のドキュメントは `docs/ja/` フォルダに配置されています。

ディレクトリ構造の例：


日本語の README: [docs/ja/README.md](docs/ja/README.md)

---

## ライセンス

このプロジェクトは MIT ライセンスの下で提供されています。詳細については [LICENSE](LICENSE) ファイルをご確認ください。

---

## フィードバック

バグ報告や機能のリクエストがある場合は、[issue](https://github.com/your-username/gas-db/issues) を作成してください。貢献やアイデアも歓迎します！
