/**
 * 新しいフォームを再構築する
 */
function updateFormAction() {
  const conf = config();
  const mdl = new Model();
  const nowDate = new Date(); // 現在時刻の取得
  const timestampUnix = nowDate.getTime(); // UNIX タイムスタンプ
  const timestamp = Utilities.formatDate(nowDate, Session.getScriptTimeZone(), "yyyy/MM/dd HH:mm:ss"); // タイムスタンプ
  const dateForName = Utilities.formatDate(nowDate, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss"); // ファイル名用タイムスタンプ

  // フォーム更新の開始通知を表示
  const ui = SpreadsheetApp.getUi();
  const confirm = ui.alert(conf.mssgFormUpdateTitle, conf.mssgFormUpdateStarted, ui.ButtonSet.OK_CANCEL);

  // キャンセルの場合は処理終了
  if (confirm == ui.Button.CANCEL) return;

  // フォーム情報を取得
  let conditions = [
    { key: conf.headerDisplaySort + ' !==', value: '' } // 数式による空欄を除外
  ];
  const editedFormData = mdl.getData(conf.sheetNameEvalListSetting, conditions);
  // DB 格納用にデータを加工（タイムスタンプの追加）
  const arrangedFormData = editedFormData.map(obj => ({
    ...obj,
    [conf.headerTimestampUnix]: timestampUnix,
    [conf.headerTimestamp]: timestamp
  }));
  // ヘッダー行を除外
  const arrangedFormDataWithoutHeader = arrangedFormData.slice(1);
  // DB へ格納
  Logger.log(mdl.insertData(conf.sheetNameFormBuildHistoryDB, arrangedFormDataWithoutHeader));

  // フォームの新規構築
  // 既存のフォームを複製
  const copiedFormId = copyAndReplaceForm(dateForName, arrangedFormDataWithoutHeader);

  // 新規フォーム ID を DB に格納
  // UNIX タイムスタンプを使用して絞り込み
  conditions = [
    { key: conf.headerTimestampUnix, value: timestampUnix }
  ];
  // 格納するデータの定義
  let keyValuePair = {
    [conf.headerFormId]: copiedFormId
  };
  // データの更新
  Logger.log(mdl.updateData(conf.sheetNameFormBuildHistoryDB, keyValuePair, conditions));

  // フォーム更新の完了通知を表示
  ui.alert(conf.mssgFormUpdateTitle, conf.mssgFormUpdateFinished, ui.ButtonSet.OK);
}


/**
 * 既存のフォームを複製して置き換える処理
 */
function copyAndReplaceForm(dateForName, formList) {
  const conf = config();
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const prevFormURL = spreadsheet.getFormUrl();

  // フォームが紐づいているかどうかで処理を分岐
  let prevForm;
  let prevFormId;
  let prevFormFile;
  let prevFormNameOld;
  let newForm;
  let newFormId;
  let newFormFile;
  if (! prevFormURL) { // フォームが紐づいていない場合
    // フォームを新規作成
    newForm = FormApp.create(conf.fileNameFormNew);
    newFormId = newForm.getId();
    newFormFile = DriveApp.getFileById(newFormId);

    // フォームファイルを同じフォルダに移動（新規作成時はマイドライブに格納されてしまう）
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const spreadsheetFile = DriveApp.getFileById(spreadsheet.getId()); // スプレッドシートのファイルオブジェクトを取得
    const parents = spreadsheetFile.getParents(); // スプレッドシートが保存されているフォルダを取得
    // スプレッドシートが特定のフォルダ内にある場合のみ処理を実行
    if (parents.hasNext()) {
      // フォルダの取得
      const folder = parents.next();
      // 移動処理の実行
      newFormFile.moveTo(folder);
    }
  
  } else { // 既存のフォームが紐づいている場合
    // 既存フォームの情報を取得
    prevForm = FormApp.openByUrl(prevFormURL);
    prevFormId = prevForm.getId();
    prevFormFile = DriveApp.getFileById(prevFormId);
    prevFormNameOld = conf.fileNameFormOld + '_' + dateForName + 'まで';

    // 既存フォームの名称を変更
    prevForm.setTitle(prevFormNameOld);
    prevFormFile.setName(prevFormNameOld);

    // フォームを複製
    newFormFile = prevFormFile.makeCopy(conf.fileNameFormNew);
    // 複製したフォームの情報を取得
    newFormId = newFormFile.getId();
    newForm = FormApp.openById(newFormId);
    // 複製したフォームのタイトルを変更
    newForm.setTitle(conf.fileNameFormNew);

    // 既存のフォームをスプレッドシートから解除
    prevForm.removeDestination();
  }

  // フォームの中身を再構築
  rebuildFormList(newForm, formList);

  // 新しいフォームをスプレッドシートに紐付け
  newForm.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());

  // 紐づけられたシートを取得
  const updatedSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const formAnswerSheet = updatedSpreadsheet.getSheets()[0]; // 1番最初に紐づけられたシートが作成される

  // シート名を変更
  formAnswerSheet.setName(conf.sheetNameFormAnswer + '【作成: ' + dateForName + '】');

  return newFormId;
}


/**
 * フォームの設問を再構築
 */
function rebuildFormList(form, formList) {
  const conf = config();
  // フォームを削除
  const items = form.getItems();
  items.forEach(item => {
    form.deleteItem(item);
  });

  // 新しい設問でフォームを再構築
  // 説明の構築
  form.setDescription(conf.formDescrFirstExp);

  // 基本情報入力欄の構築
  // メールアドレスの収集を有効化
  form.setCollectEmail(true);
  // 「基本情報の入力」セクションを追加
  form.addSectionHeaderItem()
    .setTitle(this.formTitleBasicInfo);

  // 面接日（日時選択）
  form.addDateItem()
    .setTitle(conf.headerInterviewDate)
    .setHelpText("面接の予定日時を選択してください。")
    .setRequired(true);

  // 候補者の氏名（テキスト入力）
  form.addTextItem()
    .setTitle(conf.headerCandidateName)
    .setRequired(true);

  // 面接官の氏名（テキスト入力）
  form.addTextItem()
    .setTitle(conf.headerEcaluatorName)
    .setRequired(true);
  
  // 分類を基準にマージ
  let categoryAndList = {};
  let category_prev;
  formList.forEach(item => {
    let category = item[conf.headerCategory];
    let list = item[conf.headerEvalList];

    if (category === category_prev) {
      categoryAndList[category].push(list);
    } else {
      categoryAndList[category] = [];
      categoryAndList[category].push(list);
    }
    category_prev = category;
  });

  // 分類を基準に設問を構築
  Object.keys(categoryAndList).forEach(key => {
    // 分類をセクションとして追加
    form.addPageBreakItem().setTitle(key);
    // セクションタイトルを追加（評価基準用）
    form.addSectionHeaderItem()
        .setTitle(conf.formTitleEvalRule)
        .setHelpText(this.formDescrRvalRule);

    // 設問の構築
    let lists = categoryAndList[key];
    lists.forEach(list => {
      form.addScaleItem()
          .setTitle(list)
          .setBounds(0, 5) // 1〜5のスケール
          .setLabels(conf.formTitleLowEval, conf.formTitlehighEval) // 下限上限のラベル
          .setRequired(true);
    });
  });

  // その他、特記事項の構築
  form.addPageBreakItem()
      .setTitle(conf.formTitleExtraEval)
      .setHelpText(conf.formDescrExtraEval);
  // 設問の構築
  form.addParagraphTextItem()
      .setTitle(formTitleGoodOrConcern)

  // 最後の説明を追加
  form.addPageBreakItem()
      .setTitle(conf.formTitleLastDescr)
      .setHelpText(conf.formDescrLastExp);

  // フォーム回答後の編集を無効化
  form.setAllowResponseEdits(false);
}
