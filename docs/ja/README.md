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

### 利用のメリット
`gas-db` を使用することで、コードの冗長性を減らし、操作を簡潔に記述できます。また、スプレッドシートの低レベルな操作（例: 範囲の指定やフィルタリング）を抽象化し、メンテナンス性の高いコードを書くことが可能です。

### 1. 基本操作

Spreadsheet クラスのインスタンスを作成。

以下の例は、Google Sheets からシートを取得し、全データを取得するコードです。

#### 例 

`gas-db` を使用しない場合:

```javascript
function getAllDataWithoutGasDb() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Stories");
  const data = sheet.getDataRange().getValues();
  Logger.log(data);
}
```

`gas-db` を使用する場合:

```javascript
function getAllDataWithGasDb() {
  const spreadsheet = new gasdb.Spreadsheet();
  const sheet = spreadsheet.at("Stories");
  const data = sheet.findAll();
  Logger.log(data);
}
```

---

### 2. `from()` を使用して別のスプレッドシートにアクセスする

`Spreadsheet().from(scriptId)` メソッドを使用すると、スクリプト ID を指定して別の Google スプレッドシートに接続できます。これは、現在アクティブでないスプレッドシートを操作したい場合に便利です。

#### 例

`gas-db` を使用しない場合:

```javascript
function accessAnotherSpreadsheetWithoutGasDb() {
  const anotherSpreadsheet = SpreadsheetApp.openById("ANOTHER_SPREADSHEET_ID");
  const sheet = anotherSpreadsheet.getSheetByName("Stories");
  const data = sheet.getDataRange().getValues();
  Logger.log(data);
}
```

`gas-db` を使用する場合:

```javascript
function accessAnotherSpreadsheetWithGasDb() {
  const spreadsheet = new gasdb.Spreadsheet().from("ANOTHER_SPREADSHEET_ID");
  const sheet = spreadsheet.at("Stories");
  const data = sheet.findAll();
  Logger.log(data);
}
```

---

### 3. CRUD 操作

#### 条件付きデータの検索
条件に一致するデータのみを取得します。

`gas-db` を使用しない場合:

```javascript
function findDataWithoutGasDb() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Stories");
  const data = sheet.getDataRange().getValues();
  const results = data.filter(row => row[0] === "Adventure"); // "Title" が最初の列にあると仮定
  Logger.log(results);
}
```

`gas-db` を使用する場合:

```javascript
function findDataWithGasDb() {
  const spreadsheet = new gasdb.Spreadsheet();
  const sheet = spreadsheet.at("Stories");
  const results = sheet.find({ Title: "Adventure" });
  Logger.log(results);
}
```

#### データの挿入
新しいデータをシートに追加します。

`gas-db` を使用しない場合:

```javascript
function insertDataWithoutGasDb() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Stories");
  sheet.appendRow(["New Story", "John Doe"]); // "Title" と "Author" のみの列と仮定
}
```

`gas-db` を使用する場合:

```javascript
function insertDataWithGasDb() {
  const spreadsheet = new gasdb.Spreadsheet();
  const sheet = spreadsheet.at("Stories");
  sheet.insert({ Title: "New Story", Author: "John Doe" });
}
```

#### データの更新
既存データを条件付きで更新します。

`gas-db` を使用しない場合:

```javascript
function updateDataWithoutGasDb() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Stories");
  const data = sheet.getDataRange().getValues();
  const updatedData = data.map(row => {
    if (row[1] === "John Doe") { // "Author" が 2 番目の列にあると仮定
      row[0] = "Updated Story"; // "Title" を更新
    }
    return row;
  });
  sheet.getRange(1, 1, updatedData.length, updatedData[0].length).setValues(updatedData);
}
```

`gas-db` を使用する場合:

```javascript
function updateDataWithGasDb() {
  const spreadsheet = new gasdb.Spreadsheet();
  const sheet = spreadsheet.at("Stories");
  const newData = { Title: "Updated Story" };
  const conditions = { Author: "John Doe" };
  sheet.update(newData, conditions);
}
```

#### データの Upsert（挿入または更新）
条件に一致するデータがあれば更新、なければ挿入します。

`gas-db` を使用しない場合:

```javascript
function upsertDataWithoutGasDb() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Stories");
  const data = sheet.getDataRange().getValues();
  const existingRowIndex = data.findIndex(row => row[0] === "Dynamic Story"); // "Title" が最初の列にあると仮定

  if (existingRowIndex !== -1) {
    // 行を更新
    const range = sheet.getRange(existingRowIndex + 1, 1, 1, data[0].length);
    range.setValues([["Dynamic Story", "Jane Doe"]]);
  } else {
    // 新しいデータを挿入
    sheet.appendRow(["Dynamic Story", "Jane Doe"]);
  }
}
```

`gas-db` を使用する場合:

```javascript
function upsertDataWithGasDb() {
  const spreadsheet = new gasdb.Spreadsheet();
  const sheet = spreadsheet.at("Stories");
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

### ヘッダ行の指定

`gas-db` を使用する際、Google スプレッドシートの1行目がデフォルトでヘッダ行（列名）として扱われます。しかし、データ構造によってはヘッダ行が別の行に存在する場合があります。hI（headerIndex）を第二引数として指定することで、このデフォルト動作を変更し、適切な行をヘッダ行として指定することが可能です。

#### 主な特徴：

- シート内のヘッダ行を柔軟に指定可能。
- 列名が1行目以外にある場合でも対応可能。
- データを事前に加工する必要がなく、そのまま利用できます。

#### 使用例：

カスタムヘッダ行を指定する

```javascript
function customHeaderIndex() {
  const spreadsheet = new gasdb.Spreadsheet();

  // ヘッダ行が2行目の場合
  const sheet = spreadsheet.at("Stories", 2);

  // 2行目をキーとしてデータを取得
  const data = sheet.findAll();
  Logger.log(data);
}
```

この例では：

- シート「Stories」の2行目がヘッダ行である場合、`hI = 2` を指定することで、その行をキーにしてデータを処理します。

#### デフォルト動作

`hI` を指定しない場合、`gas-db` はデフォルトで1行目をヘッダ行とみなします。

```javascript
function defaultHeaderIndex() {
  const spreadsheet = new gasdb.Spreadsheet();

  // ヘッダ行がデフォルトの1行目
  const sheet = spreadsheet.at("Stories");

  // データを取得
  const data = sheet.findAll();
  Logger.log(data);
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
