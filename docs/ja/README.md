# gas-db: Google Sheets Wrapper Library for Apps Script

`gas-db` は、Google Apps Script 用の Google Sheets 操作を簡素化するラッパーライブラリです。このライブラリは、シートデータの取得、検索、挿入、更新、削除といった CRUD 操作をシンプルなコードで実行できるように設計されています。

---

## 機能概要

- シートデータを JSON ライクなオブジェクトとして取得・操作
- 簡潔な API で CRUD 操作を実現
- 複数のシートを簡単に操作可能
- シート列名をキーとしてデータを操作

---

## セットアップ

このライブラリは、すでに Apps Script ライブラリとして公開されています。以下の手順でプロジェクトに追加してください。

1. **Apps Script プロジェクトを開く**  
   Google Apps Script エディタを開き、プロジェクトを作成します。

2. **ライブラリを追加する**  
   メニューから「ライブラリ」を選択し、以下のスクリプト ID を入力してください。  

```
1-oNObQAV_UrShtdZWEy8FwqmjGpD0-kVxWw-VdZdg0Dmx4xPs9Jp0-5Z
```


3. **バージョンを選択する**  
利用可能なバージョンから、最新バージョンを選択してください。

4. **保存をクリック**  
これでライブラリがプロジェクトに追加され、利用可能になります。

---

## 使用例

### 1. 基本操作

#### Spreadsheet クラスのインスタンスを作成
以下の例は、Google Sheets からシートを取得し、全データを取得するコードです。

```javascript
function getAllData() {
// Spreadsheet クラスのインスタンス化
const spreadsheet = new gasdb.Spreadsheet();

// シート "Stories" を取得
const sheet = spreadsheet.at("Stories");

// シート全体のデータを取得
const data = sheet.findAll();
Logger.log(data);
}
```

---

### 2. `from()` を使用して別のスプレッドシートにアクセスする

`Spreadsheet().from(scriptId)` メソッドを使用すると、スクリプト ID を指定して別の Google スプレッドシートに接続できます。これは、現在アクティブでないスプレッドシートを操作したい場合に便利です。

#### 例

```javascript
function accessAnotherSpreadsheet() {
// Spreadsheet クラスをインスタンス化し、別のスプレッドシートに接続
const spreadsheet = new gasdb.Spreadsheet().from("ANOTHER_SPREADSHEET_ID");

// 他のスプレッドシート内の "Stories" シートを取得
const sheet = spreadsheet.at("Stories");

// データを取得
const data = sheet.findAll();
Logger.log(data);
}
```

---

### 3. CRUD 操作

#### 条件付きデータの検索
条件に一致するデータのみを取得します。

```javascript
function findData() {
const spreadsheet = new gasdb.Spreadsheet();
const sheet = spreadsheet.at("Stories");

// 条件を指定してデータを検索
const conditions = { Title: "Adventure" };
const results = sheet.find(conditions);
Logger.log(results);
}
```

#### データの挿入
新しいデータをシートに追加します。

```javascript
function insertData() {
const spreadsheet = new gasdb.Spreadsheet();
const sheet = spreadsheet.at("Stories");

// データを挿入
sheet.insert({ Title: "New Story", Author: "John Doe" });
}
```

#### データの更新
既存データを条件付きで更新します。

```javascript
function updateData() {
const spreadsheet = new gasdb.Spreadsheet();
const sheet = spreadsheet.at("Stories");

// データを更新
const newData = { Title: "Updated Story" };
const conditions = { Author: "John Doe" };
sheet.update(newData, conditions);
}
```

#### データの Upsert（挿入または更新）
条件に一致するデータがあれば更新、なければ挿入します。

```javascript
function upsertData() {
const spreadsheet = new gasdb.Spreadsheet();
const sheet = spreadsheet.at("Stories");

// Upsert を実行
const data = { Title: "Dynamic Story", Author: "Jane Doe" };
const conditions = { Title: "Dynamic Story" };
sheet.upsert(data, conditions);
}
```

---

## 高度な機能

#### 新しいシートの作成または取得
指定した名前のシートが存在しない場合、新しく作成します。

```javascript
function createOrFindSheet() {
const spreadsheet = new gasdb.Spreadsheet();
const sheet = spreadsheet.createOrFindSheet("NewSheet");
}
```

---

## スコープ（権限）
このライブラリを利用するには、プロジェクトのスコープに以下を追加してください。

```
https://www.googleapis.com/auth/spreadsheets
```


Apps Script のスクリプトエディタで「プロジェクトの設定」を開き、スコープを明示的に指定することで、エラーを防止できます。

---

## トラブルシューティング

Google Sheets を使用している際に、以下のような API エラーが発生する場合があります：

- `503 Service Unavailable`: このエラーは、Google Sheets API の一時的な問題により発生することがあります。

### 推奨事項

#### リトライロジックの実装
 
エラーが発生した場合、指数バックオフを利用したリトライメカニズムを実装してください。以下はその例です：

    ```javascript
    function retryWithBackoff(fn, retries = 5) {
        for (let i = 0; i < retries; i++) {
            try {
            return fn();
            } catch (e) {
            if (i === retries - 1) throw e;
            const backoffTime = Math.pow(2, i) * 1000;
            Utilities.sleep(backoffTime);
            }
        }
    }
    ``` 

#### シートのローテーション 

もしレート制限やサービス中断が頻発する場合、複数のシートをローテーションで利用したり、大きな操作を小さなチャンクに分割することを検討してください。

Google Sheets API に関するさらなる情報は、[公式ドキュメント](https://developers.google.com/sheets/api/troubleshoot-api-errors#503-service-unavailable) を参照してください。

> **注意** : 上記のエラー処理戦略は `gas-db` ライブラリには含まれていません。本ライブラリは CRUD 操作の簡略化に焦点を当てています。そのため、開発者自身のユースケースに合わせたエラー処理の実装を推奨します。

---

## よくある質問

### Q: スクリプト ID を変更する必要がありますか？
- ライブラリを利用するだけの場合、スクリプト ID を変更する必要はありません。

---

## ライセンス
このライブラリは MIT ライセンスの下で公開されています。
