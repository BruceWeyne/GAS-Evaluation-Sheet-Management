/**
 * 利用規約を必ず表示させる処理
 * 削除されている場合は再度作成する
 * 
 * 難読化設定: midium
 * https://obfuscator.io/
 */
function createTermsSheet() {
  const conf = config();
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = conf.sheetNameTermsOfService;

  // 「利用規約」シートが存在するかを確認
  var sheet = spreadsheet.getSheetByName(sheetName);

  // シートが存在しない場合、新規作成
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName); // 新しいシートを作成
  } else {
    // シートが存在する場合は、既存のシートを利用（処理終了）
    return;
  }

  // 「利用規約」シートに文言を追加
  sheet.getRange(conf.cellAreaTermsText).setValue(conf.termsOfServiceDescr);

  // シートを一番右側に移動
  var sheets = spreadsheet.getSheets();
  var lastIndex = sheets.length - 1;
  spreadsheet.setActiveSheet(sheet);
  spreadsheet.moveActiveSheet(lastIndex + 1);

  // 警告のみの保護を設定
  var protection = sheet.protect().setDescription(conf.protectDescrTermOfService);

  // グリッド線を非表示にする
  sheet.setHiddenGridlines(true);
  
  // シートの保護を警告のみ設定（編集不可、警告のみ）
  protection.setWarningOnly(true); // 他のユーザーには編集不可の警告を表示
}
