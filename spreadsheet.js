import Sheet from './sheet';

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

export default new Spreadsheet();
