/**
 * データベース（DB）のデータおよびフォームの回答履歴を削除
 * 
 * 難読化設定: Midium
 * https://obfuscator.io/
 */
function deleteAllDatabaseData() {
  const conf = config();
  const mdl = new Model();
  const ui = SpreadsheetApp.getUi();
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet(); // スプレッドシートを開く

  // 実行前の確認
  const confirm = ui.alert(conf.mssgDeleteDBDataTitle, conf.mssgDeleteDBDataStarted, ui.ButtonSet.OK_CANCEL);

  // キャンセルの場合は処理終了
  if (confirm == ui.Button.CANCEL) return;

  // 紐づけられているフォームの ID を取得
  const formURL = spreadsheet.getFormUrl(); // 紐づけられたフォームの URL を取得

  // フォームが紐づけられているかどうかで処理を分岐
  let mssg = '';
  let latestFormData = [];
  if (! formURL) { // フォームが紐づけられていない場合
    mssg = conf.mssgNoFormConnected;
  
  } else { // フォームが紐づいている場合
    // フォーム情報の取得
    const formId = formURL.match(/\/d\/([^/]+)/)[1]; // フォーム ID を取得;
    const form = FormApp.openById(formId);

    // フォーム自体の回答履歴を削除
    form.deleteAllResponses();
  
    // 最新のフォーム情報のみを取得
    const conditions = [
      { key: conf.headerFormId, value: formId }
    ];
    // データの取得
    latestFormData = mdl.getData(conf.sheetNameFormBuildHistoryDB, conditions);
  }

  // 回答データの全消去
  Logger.log(mdl.truncateData(conf.sheetNameEvalResultDB));

  // フォーム構築履歴データの削除
  // フォーム構築履歴の全消去
  Logger.log(mdl.truncateData(conf.sheetNameFormBuildHistoryDB));

  // 最新のフォーム情報を入れ直す
  if (latestFormData.length > 0) { // フォームが紐づいている場合のみ
    Logger.log(mdl.insertData(conf.sheetNameFormBuildHistoryDB, latestFormData));
  }

  // データ削除の完了通知を表示
  ui.alert(conf.mssgDeleteDBDataTitle, conf.mssgDeleteDBDataFinished + mssg, ui.ButtonSet.OK);
}
