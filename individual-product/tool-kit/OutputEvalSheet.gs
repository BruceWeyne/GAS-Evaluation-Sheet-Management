/**
 * 評価結果シートに該当する評価データを出力する
 */
function updateEvalSheet(candidateName, evaluatorName, intervewDate) {
  const conf = config();
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet(); // スプレッドシートを開く
  const sheet = spreadsheet.getSheetByName(conf.sheetNameEvalResult); // 指定したシートを取得
  const intervewDateObj = new Date(intervewDate); // 面接日をオブジェクト化
  const intervewDateUnix = intervewDateObj.getTime(); // 面接日を UNIX タイム化

  // 項目の反映される全てのセルの初期化
  let targetCells = sheet.getRange(conf.cellAreaAllEvalArea);
  targetCells.breakApart(); // 結合解除
  targetCells.setNote(''); // メモの削除
  targetCells.clear(); // 値と書式の両方を削除

  // 処理中の表記
  sheet.getRange(conf.cellAreaLoadingMssg).setValue(conf.mssgLoading);

  // Model インスタンスの生成
  const mdl = new Model();

  // 評価結果の取得
  // 抽出条件を設定（候補者氏名、面接官氏名、面接日、の３要素で絞り込み）
  let conditions = [
    { key: conf.headerCandidateName, value: candidateName },
    { key: conf.headerEcaluatorName, value: evaluatorName },
    { key: conf.headerInterviewDateUnix, value: intervewDateUnix }
  ];
  // データの抽出
  const evaluation = mdl.getData(conf.sheetNameEvalResultDB, conditions);

  // 評価結果の取得状況によって処理を分岐
  let listValues;
  let formId;
  if (evaluation.length > 0) { // 評価結果が存在する場合
    // 評価項目（key）と評価数値（value）の連想配列に加工
    listValues = Object.fromEntries(evaluation.map(item => [item[conf.headerEvalList], item[conf.headerEvalValue]]));
    // フォーム ID の取得
    formId = evaluation[0][conf.headerFormId];

  } else { // 評価結果が存在しない場合
    // 評価結果がないメッセージを表示
    sheet.getRange(conf.cellAreaLoadingMssg).setValue(conf.mssgNotHitEvalResult);
    // 全体の処理を終了
    return;
  }

  // 評価項目の設定から項目を取得
  // 抽出条件を設定
  conditions = [
    { key: conf.headerFormId, value: formId }
  ];
  const settingData = mdl.getData(conf.sheetNameFormBuildHistoryDB, conditions);
  // 表示順でデータをソート（昇順）
  settingData.sort((a, b) => a[conf.headerDisplaySort] - b[conf.headerDisplaySort]);
  // 分類を抽出
  const categories = settingData.map(item => item[conf.headerCategory]);
  // 抽出した分類の存在数を集計（キーが分類、値がその数）
  const countMap = categories.reduce((acc, cur) => {
    acc[cur] = (acc[cur] || 0) + 1;
    return acc;
  }, {});

  // 分類をシートに出力
  let tartgetRow = conf.evalResultListStartRow;
  Object.keys(countMap).forEach(key => {
    let margeNum = countMap[key];
    let range = sheet.getRange(tartgetRow,1,margeNum,1); // 結合範囲を設定
    // 結合
    range.merge();
    // 書式の設定
    range.setValue(key);
    range.setFontSize(14);
    range.setFontWeight("bold");
    range.setBorder(true, true, true, true, false, false, "black", SpreadsheetApp.BorderStyle.SOLID);
    range.setBackground('#d9ead3');
    range.setVerticalAlignment('middle');
    range.setWrap(true); // テキストの折り返しを有効化
    // 対象行の計算
    tartgetRow += countMap[key];
  });

  // 条件付き書式の定義
  // 既存の条件付き書式ルールを取得
  setConditionalFormat(sheet);

  // 項目の出力
  // 項目と値の設定
  const lists = settingData.map(item => item[conf.headerEvalList]); // 評価項目の抽出
  tartgetRow = conf.evalResultListStartRow;
  lists.forEach((list) => {
    sheet.setRowHeight(tartgetRow, 45);
    // 項目を設定
    let range = sheet.getRange(tartgetRow,2); // 範囲を設定
    range.setValue(list);
    range.setFontSize(12);
    // range.setFontWeight("bold");
    range.setBorder(true, true, true, true, false, false, "black", SpreadsheetApp.BorderStyle.SOLID);
    range.setBackground('#d9ead3');
    range.setWrap(true); // テキストの折り返しを有効化

    // 評価数値を設定
    range = sheet.getRange(tartgetRow,3); // 範囲を設定
    range.setValue(listValues[list]);
    range.setNote(conf.cellMemoEvalRules); // 評価基準メモの追加
    range.setFontSize(18);
    // range.setFontWeight("bold");
    range.setBorder(true, true, true, true, false, false, "black", SpreadsheetApp.BorderStyle.SOLID);
    range.setHorizontalAlignment('center');
    range.setVerticalAlignment('middle');

    // 次の行を設定
    tartgetRow++;
  });

  // 特記事項欄の構築
  const margeRow = lists.length;
  const range = sheet.getRange(conf.evalResultListStartRow, conf.extraEvalStartCol, margeRow, conf.extraEvalMergeCol); // 結合範囲を設定
  // 結合
  range.merge();
  // 書式を設定
  range.setFontSize(12);
  range.setFontWeight('normal');
  range.setBorder(true, true, true, true, false, false, "black", SpreadsheetApp.BorderStyle.SOLID);
  range.setHorizontalAlignment('left');
  range.setVerticalAlignment('top');
  // 値の出力
  range.setValue(listValues[conf.formTitleGoodOrConcern]);
}


/**
 * 条件付き書式の設定
 */
function setConditionalFormat(targetSheet) {
  const conf = config();
  let rules = targetSheet.getConditionalFormatRules();
  // 新しいルールを定義
  const targetRange = targetSheet.getRange(conf.cellAreaEvalValue);
  const ruleforFive = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberEqualTo(5)
    .setBackground("#ea9999")
    .setRanges([targetRange])
    .build();
  const ruleforFour = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberEqualTo(4)
    .setBackground("#f4cccc")
    .setRanges([targetRange])
    .build();
  const ruleforThree = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberEqualTo(3)
    .setBackground("#f9cb9c")
    .setRanges([targetRange])
    .build();
  const ruleforTwo = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberEqualTo(2)
    .setBackground("#ffe599")
    .setRanges([targetRange])
    .build();
  const ruleforOne = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberEqualTo(1)
    .setBackground("#cfe2f3")
    .setRanges([targetRange])
    .build();
  const ruleforZero = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberEqualTo(0)
    .setBackground("#d9d9d9")
    .setRanges([targetRange])
    .build();
  // const ruleforEmpty = SpreadsheetApp.newConditionalFormatRule()
  //   .whenCellEmpty()
  //   .setBackground("#d9d9d9")
  //   .setRanges([targetRange])
  //   .build();
  
  // 既存と新規のルールをマージ
  rules.push(ruleforFive, ruleforFour, ruleforThree, ruleforTwo, ruleforOne, ruleforZero);
  // 書式の割り当て
  targetSheet.setConditionalFormatRules(rules);
}