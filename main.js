 // WARNING: This is not a drop in replacement solution and
// it might not work for some edge cases. Test your code! 
const flow =
  funcs =>
  (...args) =>
    funcs.reduce((prev, fnc) => [fnc(...prev)], args)[0]

/**
 * GAS の Sheetクラスのラッパ
 *
 * @class Sheet
 */
class Sheet {
  /**
   * Sheetクラスのインスタンスを生成する。
   * @param {*} source GAS の Sheetクラスのインスタンス
   * @param {number} [hI=1] ヘッダ行の行数
   * @memberof Sheet
   */
  constructor(source, hI = 1) {
    this.source = source;
    this.lRow = source.getLastRow();
    this.lCol = source.getLastColumn();
    this.hI = hI;
    this.findAll();
  }

  set hI(num) {
    this._hI = num;
    this.dict = this.genDict();
  }

  get hI() {
    return this._hI;
  }

  /**
   * シートのカラム名が何列目に存在するのかをもつ「ディクショナリ」を生成する。
   *
   * @returns 列のキー名と何列目にそのキーが存在するかのペアを持っている。
   *          { 'columnA ': 1, 'columnB':2 }
   * @memberof Sheet
   */
  genDict() {
    const map = {};
    if (this.lCol > 0) {
      this.source
        .getRange(this.hI, 1, 1, this.lCol)
        .getValues()[0]
        .forEach((key, idx) => {
          map[key] = idx + 1;
        });
    }
    return map;
  }

  /**
   * シート内にあるデータを全て取得する。それぞれの行は、Sheetクラスの dict で定義されているキーに沿って
   * キーが振られた形で変形されて出力される。
   * ex
   * | A | B | C |
   * |---|---|---|
   * | 1 | 2 | 3 |
   * | 4 | 5 | 6 |
   * は以下のように変換される。
   * [
   *  {A:1, B:2, C:3},
   *  {A:4, B:5, C:6}
   * ]
   *
   * @returns シートから抽出されたデータ
   * @memberof Sheet
   */
  findAll() {
    if (this.lRow - this.hI > 0) {
      this.all = this.source
        .getRange(this.hI + 1, 1, this.lRow - this.hI, this.lCol)
        .getValues()
        .map((row, i) => {
          return (dict => {
            const datum = {};
            datum.rI = i + this.hI + 1;
            Object.keys(dict).forEach(key => {
              datum[key] = row[dict[key] - 1];
            });
            return datum;
          })(this.dict);
        });
    } else {
      this.all = [];
    }
    return this.all;
  }

  /**
   * シート内のデータを条件付きで取得する。出力されるデータのフォーマットは findAll と同じ。
   * 条件にマッチする内容を全件取得する。
   *
   * @param {Object} [conditions={}] 検索条件を表現するオブジェクト。フォーマットは{検索キー : 検索内容}。完全一致のみ。
   * @returns シートから抽出されたデータ
   * @memberof Sheet
   */
  find(conditions = {}) {
    return flow(Object.keys(conditions).map(k => s => s.filter(o => o[k] === conditions[k])))(
      this.all
    );
  }

  /**
   * シート内のデータを条件付きで取得する。出力されるデータのフォーマットは findAll と同じ。
   * 条件にマッチする内容から1件のみ抽出する。デフォルトでは先頭のものを取得。
   *
   * @param {*} [conditions={}] 検索条件を表現するオブジェクト。
   * @param {number} [index=0] 何番目のデータを取得するか
   * @returns シートから抽出されたデータ
   * @memberof Sheet
   */
  pick(conditions = {}, index = 0) {
    return this.find(conditions)[index];
  }

  /**
   * シート内に新たにデータを挿入する。 渡されたデータオブジェクトのカラムがシート内にあれば、その値としてdataの値をセットする。
   *
   * @param {Object} data オブジェクト型の挿入が想定されるデータ
   * @memberof Sheet
   */
  insert(data) {
    if (Array.isArray(data)) {
      const l = data.length;
      const r = this.source.getRange(this.lRow + 1, 1, l, this.lCol);
      const v = r.getValues();
      data.forEach((datum, i) => {
        Object.keys(datum).forEach(k => {
          v[i][this.dict[k] - 1] = datum[k];
        });
      });
      r.setValues(v);
    } else {
      const r = this.source.getRange(this.lRow + 1, 1, 1, this.lCol);
      const v = r.getValues();
      Object.keys(data).forEach(k => {
        v[0][this.dict[k] - 1] = data[k];
      });
      r.setValues(v);
    }
    this.lRow = this.source.getLastRow();
  }

  /**
   * シート内の条件にあう既存のデータを上書きする。複数のデータがマッチする場合には、対象となるデータ全てが上書き対象である。
   * 検索条件がない場合には上書きは実行されない。
   *
   * @param {Object} data オブジェクト型の上書きが想定されるデータ
   * @param {Object} conditions 検索条件を表現するオブジェクト。
   * @memberof Sheet
   */
  update(data, conditions) {
    let updated = false;
    if (conditions) {
      flow(Object.keys(conditions).map(k => s => s.filter(o => o[k] === conditions[k])))(
        this.findAll()
      ).forEach(x => {
        const r = this.source.getRange(x.rI, 1, 1, this.lCol);
        const v = r.getValues();
        Object.keys(data).forEach(k => {
          v[0][this.dict[k] - 1] = data[k];
        });
        r.setValues(v);
        updated = true;
      });
    }
    return updated;
  }

  upsert(data, conditions){
    if(this.find(conditions).length > 0){
      this.update(data,conditions)
    } else {
      this.insert(data)
    }
  }

  refreshFormula() {
    this.source
      .getRange(this.hI, 1, 1, this.lCol)
      .getFormulas()[0]
      .forEach((c, i) => {
        Logger.log(c);
        if (c.indexOf('ARRAYFORMULA') !== -1) {
          Logger.log(`MATCHED : ${i + 1}`);
          this.source.getRange(this.hI + 1, i + 1, this.lRow - this.hI, 1).clear();
        }
      });
  }

  clear() {
    if (this.lRow - this.hI > 0) {
      this.source
        .getRange(this.hI + 1, 1, this.lRow - this.hI, this.lCol)
        .clear({ contentOnly: true });
    }
    this.lRow = this.source.getLastRow();
  }
}

/**
 * GASのオブジェクトである Spreadsheet クラス を JSで扱いやすようにするラッパークラス
 *
 * @class Spreadsheet
 */
class Spreadsheet {
  /**
   * GAS のオブジェクトを取得し、Spreadsheetの source にセットする。
   * @memberof Spreadsheet
   */
  constructor() {
    this.source = SpreadsheetApp.getActiveSpreadsheet();
  }

  /**
   * シート名から、その名前をもつシートを得る関数です。
   * シートは、データの属性名を表すヘッダ行が存在することを仮定しています。その行をカラム定義がされている行とみなし
   * データ抽出時にキーとなる値を生成します。そのため、ヘッダ行の指定がが必要になります。
   *
   * @param {String} name シート名
   * @param {Number} [hI=1] ヘッダ行の行数
   * @returns Sheetクラスのインスタンス
   * @memberof Spreadsheet
   */
  at(name, hI = 1) {
    const sheetSource = this.source.getSheetByName(name);
    if (!sheetSource) {
      throw new Error();
    }
    return new Sheet(this.source.getSheetByName(name), hI);
  }

  /**
   *シート名を取得します。
   *
   * @param {*} name シート名
   * @param {*} [hI=1] ヘッダ行の行数
   * @returns Sheetクラスのインスタンス
   * @memberof Spreadsheet
   */
  createOrFindSheet(name, hI = 1) {
    let sheetSource;
    try {
      sheetSource = this.at(name).source;
    } catch (e) {
      sheetSource = this.source.insertSheet(name);
    }
    return new Sheet(sheetSource, hI);
  }

  from(spreadsheetID) {
    if (spreadsheetID) {
      this.source = SpreadsheetApp.openById(spreadsheetID);
    } else {
      this.source = SpreadsheetApp.getActiveSpreadsheet();
    }
    return this;
  }
}