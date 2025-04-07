/**
 * 各種設定項目および定数を管理
 * [例]
 * const conf = config();
 * return conf.settingAsYouLike;
 * 
 * 難読化設定: Midium
 * https://obfuscator.io/
 */
function config() {
  this.spreadsheetId = ""; // Spreadsheet ID: Default Database

  // ===========================
  // Setting as you like
  // ===========================
  this.settingAsYouLike = "Sample";

  this.candidateNameTitle = '候補者氏名';
  this.evaluatorNameTitle = '面接官氏名';

  this.evalResultListStartRow = 6;
  this.extraEvalStartCol = 4;
  this.extraEvalMergeCol = 6;
  
  this.nameOnFormSubmit = 'onFormSubmit';
  this.nameOnSpreadsheetEdit = 'onSpreadsheetEdit';
  
  this.sheetNameTermsOfService= '利用規約';
  this.sheetNameEvalResult = '評価結果';
  this.sheetNameEvalResultDB = '面接評価結果DB';
  this.sheetNameFormSubmit = 'フォーム送信';
  this.sheetNameEvalListSetting = '評価項目設定';
  this.sheetNameFormBuildHistoryDB = 'フォーム構築履歴DB';
  this.sheetNameFormAnswer = 'フォームの回答';
  
  this.headerCandidateName = '候補者の氏名';
  this.headerEcaluatorName = '面接官の氏名';
  this.headerEvalList = '評価項目';
  this.headerEvalValue = '評価数値';
  this.headerInterviewDate = '面接日';
  this.headerInterviewDateUnix = '面接日（UNIX）';
  this.headerEvaluatorEmail = 'メールアドレス';
  this.headerTimestamp = 'タイムスタンプ';
  this.headerTimestampUnix = 'タイムスタンプ（UNIX）';
  this.headerFormId = 'フォームID';
  this.headerResponseId = '回答ID';
  this.headerCategory = '分類';
  this.headerDisplaySort = '表示順';
  this.headerHelpText = '補足説明（任意）';

  this.cellAreaTermsText = 'A1';
  this.cellAreaLoadingMssg = 'B6';
  this.cellAreaCandidateName = 'B2';
  this.cellAreaEvaluatorName = 'B3';
  this.cellAreaInterviewDate = 'D3';
  this.cellAreaAllEvalArea = 'A6:I';
  this.cellAreaCategory = 'A6:A';
  this.cellAreaEvalList = 'B6:C';
  this.cellAreaEvalValue = 'C6:C';
  this.cellAreaImportance = '';
  this.cellAreaRecruitCategory = 'E2';

  this.fileNameFormNew = '面接評価フォーム';
  this.fileNameFormOld = 'old_面接評価フォーム';

  this.menuNameEvalSheetManage = '∴ 面接評価シート管理';
  this.menuNameStartFirstSetting = '■ 初期設定を開始';
  this.menuNameStartFormUpdate = '■ 面接評価フォームを更新';
  this.menuNameDeleteDBData = '■ 回答履歴の削除';
  this.menuNameTermsOfService = '■ 利用規約';

  this.mssgFirstSettingTitle = '初期設定';
  this.mssgFormUpdateTitle = 'フォーム更新';
  this.mssgFristSettingStarted = '初期設定を開始します。よろしいですか？';
  this.mssgFirstSettingFinished = '初期設定が完了しました。';
  this.mssgFirstSettingAlreadyDone = '初期設定は既に完了しています。';
  this.mssgFormUpdateStarted = '「' + this.sheetNameEvalListSetting + '」シートの内容に従ってフォームを更新します。\n開始するには「OK」を押してください。\n\n※この処理には１分程度かかります。';
  this.mssgFormUpdateFinished = 'フォームが最新の設定情報に更新されました。';
  this.mssgLoading = 'Loading...';
  this.mssgNotHitEvalResult = '該当の評価結果がありません\n適切な 候補者 / 面接官 / 面接日 を選択してください';
  this.mssgDeleteDBDataTitle = '回答履歴の削除';
  this.mssgDeleteDBDataStarted = 'この処理以降は過去の回答結果を参照できなくなります。よろしいですか？\n開始するには「OK」を押してください。';
  this.mssgDeleteDBDataFinished = '回答履歴の削除が完了しました。\n※「フォームの回答」シートの履歴はご自身で削除してください。';
  this.mssgNoFormConnected = '\n\nフォームが紐づいていません。\n手動で回答を削除するか、フォーム自体を削除してください。';

  this.formTitleEvalRule = '評価基準';
  this.formTitleLowEval = '低評価';
  this.formTitlehighEval = '高評価';
  this.formTitleBasicInfo = '基本情報の入力';
  this.formTitleLastDescr = 'ご回答ありがとうござます。';
  this.formTitleExtraEval = 'その他';
  this.formTitleExtraComment = 'に関する特記事項';

  this.formDescrFirstExp = 'この度は採用活動にご協力いただき誠にありがとうございます。\n\nこちらに面接を行った候補者の評価を記入してください。\n\n記入が完了しデータを送信した後、\n面接官どうしで採用可否の議論をする際の参考としてください。\n\nそれでは、よろしくお願いいたします。';
  this.formDescrRvalRule = '【加点方式】\n\n0: 全く評価できない\n\n1: 多少評価できる\n\n2: 問題ない\n\n3: 良い所が目立つ\n\n4: とても評価できる\n\n5: 最高に評価できる';
  this.formDescrLastExp = '以下の【送信】ボタンを押して回答を完了してください。\n\n後ほど、メールアドレスに回答結果が届きます。\nそちらを参考に採用可否の議論をお願いします。';
  this.formDescrExtraEval = '評価項目以外に評価したい事柄や懸念事項などがあればご記載ください';
  this.formDescrExtraComment = '評価内容について追記されたい事柄があればお書きください';

  this.cellMemoEvalRules = '【加点方式】\n0: まったく評価できない\n1: 多少評価できる\n2: 問題ない\n3: 良い所が目立つ\n4: とても評価できる\n5: 最高に評価できる';

  this.protectDescrTermOfService = '利用規約シートの保護';
  
  this.termsOfServiceDescr = '\n本コンテンツは、個人および商業利用を目的として提供されていますが、以下の行為は固く禁じます。\n\n・本コンテンツの転売、再販、または他者への再配布\n・本コンテンツを無断で改変、転用、または他の製品やサービスに組み込むこと\n\n商業利用においても、コンテンツの改変や再配布を行わない限り、利用は許可されています。\n利用者は、上記の禁止事項を遵守する必要があります。\n違反した場合、法的措置を取る可能性があります。\n\n\nPiklus Inc.\n\n© Piklus All Rights Reserved';

  return this; 
}