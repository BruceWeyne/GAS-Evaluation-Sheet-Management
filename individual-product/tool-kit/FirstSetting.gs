/**
 * 初期設定を実行する関数
 * メニューバーから実行する
 * インストール型トリガー、ライブラリの初期登録を行う
 * 
 * 難読化設定: Low
 * https://obfuscator.io/
 */
function setFirstSettingTriggers() {
  const conf = config();
  const script = ScriptApp.getProjectTriggers();
  const ui = SpreadsheetApp.getUi();

  // 初期設定の開始通知を表示
  const confirm = ui.alert(conf.mssgFirstSettingTitle, conf.mssgFristSettingStarted, ui.ButtonSet.OK_CANCEL);
  // キャンセルの場合は処理終了
  if (confirm == ui.Button.CANCEL) return;

  // 設定されているトリガーを抽出
  const triggerNames = script.map(item => item.getHandlerFunction());

  // トリガーの新規追加
  if (triggerNames.length === 0) {
    // トリガーが１つも設定されていない場合
    setOnFormSubmitTrigger(conf.nameOnFormSubmit);
    setOnSpreadsheetEditTrigger(conf.nameOnSpreadsheetEdit);
  
  } else {
    let count = 0;
    // トリガーが１つ以上設定されている場合
    if (! triggerNames.includes(conf.nameOnFormSubmit)) {
      // フォーム送信時のトリガーが含まれていない場合は追加
      setOnFormSubmitTrigger(conf.nameOnFormSubmit);
      count++;
    }
    if (! triggerNames.includes(conf.nameOnSpreadsheetEdit)) {
      // スプレッドシート編集時のトリガーが含まれていない場合は追加
      setOnSpreadsheetEditTrigger(conf.nameOnSpreadsheetEdit);
      count++;
    }
    // 初期設定が既に完了している場合
    if (count === 0) {
      // 初期設定が既に完了している旨を表示
      ui.alert(conf.mssgFirstSettingTitle, conf.mssgFirstSettingAlreadyDone, ui.ButtonSet.OK);
      return;
    }
  }

  // 初期設定の完了通知を表示
  ui.alert(conf.mssgFirstSettingTitle, conf.mssgFirstSettingFinished, ui.ButtonSet.OK);
}


/**
 * フォーム送信時のトリガーを設定
 */
function setOnFormSubmitTrigger(nameOnFormSubmit) {
  ScriptApp.newTrigger(nameOnFormSubmit)
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet()) // スプレッドシートに関連付ける
    .onFormSubmit()
    .create();
}


/**
 * スプレッドシート編集時のトリガーを設定
 */
function setOnSpreadsheetEditTrigger(nameOnSpreadsheetEdit) {
  ScriptApp.newTrigger(nameOnSpreadsheetEdit)
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet()) // スプレッドシートに関連付ける
    .onEdit()
    .create();
}