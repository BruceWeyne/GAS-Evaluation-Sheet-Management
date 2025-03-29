/**
 * スプレッドシートのメニューバーに独自のメニューを表示
 * 
 * 難読化設定: Midium
 * https://obfuscator.io/
 */
function displayEvalSheetMenu() {
  const conf = config();
  const ui = SpreadsheetApp.getUi();
  ui.createMenu(conf.menuNameEvalSheetManage)
    .addItem(conf.menuNameStartFirstSetting, 'setFirstSettingTriggers')
    .addItem(conf.menuNameStartFormUpdate, 'updateFormAction')
    .addItem(conf.menuNameDeleteDBData, 'deleteAllDatabaseData')
    .addItem(conf.menuNameTermsOfService, 'displayTermsOfService')
    .addToUi();
}

/**
 * 利用規約の表示
 * TermsOfService ファイルが万が一削除される場合を考慮してここに配置
 */
function displayTermsOfService() {
  const conf = config();
  // 利用規約の表示
  const ui = SpreadsheetApp.getUi();
  ui.alert(conf.sheetNameTermsOfService, conf.termsOfServiceDescr, ui.ButtonSet.OK);
}
