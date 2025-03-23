/**
 * スプレッドシートを開いた時の処理
 */
function onOpen(e) {
  // 専用のメニューバーを表示
  displayEvalSheetMenu();
}


/**
 * スプレッドシートを直接編集した時の処理
 */
function onSpreadsheetEdit(e) {
  const conf = config();
  const range = e.range;
  const sheet = range.getSheet();
  const sheetName = sheet.getSheetName();
  const cellAddress = range.getA1Notation(); // A1 などのセル表記を取得

  // 編集されたシートおよび項目によって処理を制御
  if ( // 評価結果シートの、応募者または面接官または面接日が編集された場合
      sheetName === conf.sheetNameEvalResult
      &&
      (
        cellAddress === conf.cellAreaCandidateName
        ||
        cellAddress === conf.cellAreaEvaluatorName
        ||
        cellAddress === conf.cellAreaInterviewDate
      )
    ) {
    // 処理を実行
    const candidateName = sheet.getRange(conf.cellAreaCandidateName).getValue();
    const evaluatorName = sheet.getRange(conf.cellAreaEvaluatorName).getValue();
    const intervewDate = sheet.getRange(conf.cellAreaInterviewDate).getValue();
    // 評価結果シートへの出力
    updateEvalSheet(candidateName, evaluatorName, intervewDate);
  }
}


/**
 * フォームが送信されてスプレッドシートへ反映された時の処理
 */
function onFormSubmit(e) {
  // 回答データを専用の DB シートへ格納
  insertFormSubmitToDB(e);
}
