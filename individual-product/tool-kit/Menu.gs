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