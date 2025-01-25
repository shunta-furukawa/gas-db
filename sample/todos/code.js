/**
 * シンプルなTODO管理用のAPIサーバ例
 * gas-db を用いてスプレッドシートをCRUD操作します
 */

function debug() {
    console.log(getDb())
}

/**
 * 1. スプレッドシートおよびシートの取得
 *   gas-db の書き方に合わせて取得
 */
function getDb() {
    // あなたのスプレッドシートID・シート名に適宜書き換えてください
    return new gasdb.Spreadsheet()
        .from("1-QxJN6sEoIEwrhhgLZS_eEAzJSCft3lCqjdgL_cuBRw")
        .at("Todos");
}

/**
 * メインエントリーポイント
 * HTMLファイル (index.html) を返してWebアプリ化する
 */
function doGet(e) {
    return HtmlService.createTemplateFromFile('index') // テンプレート読み込み
        .evaluate()
        // （オプション）最大幅を広げるなどの設定
        .setTitle("TODO App")
        .setFaviconUrl("https://shunta-furukawa.info/favicon.ico");
}

/**
 * すべてのTODOを取得して配列として返す
 */
function getTodos() {
    const db = getDb();
    // [{id, title, completed}, ...] を全取得
    const rows = db.findAll();
    // booleanなどの型を適切に扱うために変換しておく例
    return rows.map(r => ({
        id: r.id,
        title: r.title,
        completed: (r.completed === true || r.completed === "true")
    }));
}

/**
 * 新規TODOを作成
 */
function createTodo(title) {
    const db = getDb();
    // idは簡易的にタイムスタンプ
    const newTodo = {
        id: new Date().getTime(),
        title: title,
        completed: false
    };
    db.insert(newTodo);
}

/**
 * TODOの完了フラグをトグル
 */
function toggleTodo(id) {
    const db = getDb();
    // 既存の1件を検索
    const existing = db.pick({ id });
    if (!existing) return;
    // 反転した値を更新
    db.update({ completed: !existing.completed }, { id: existing.id });
}

/**
 * TODOを削除
 */
function deleteTodo(id) {
    const db = getDb();
    db.delete({ id: Number(id) });
}
