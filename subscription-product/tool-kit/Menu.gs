/**
 * スプレッドシートのメニューバーに独自のメニューを表示
 */
function displayEvalSheetMenu() {
  const conf = config();
  const ui = SpreadsheetApp.getUi();
  ui.createMenu(conf.menuNameEvalSheetManage)
    .addItem(conf.menuNameStartFirstSetting, 'setFirstSettingTriggers')
    .addItem(conf.menuNameStartFormUpdate, 'updateFormAction')
    .addItem(conf.menuNameDeleteDBData, 'deleteAllDatabaseData')
    .addToUi();
}
