/**
 * フォームから回答が送信されてスプレッドシートに登録された時の処理
 * 専用の DB シートへ回答データを格納する
 */
function insertFormSubmitToDB(e) {
  const conf = config();
  const sheet = e.range.getSheet();  // 回答が記録されたシートを取得
  const namedValues = e.namedValues;  // 送信された回答データ
  const formURL = sheet.getFormUrl(); // 回答が送信されたフォーム URL を取得
  const formId = formURL.match(/\/d\/([^/]+)/)[1]; // フォーム ID を取得;

  // Model インスタンスの生成
  const mdl = BaseLibrary.createNewClassInstance();

  // 格納するデータの準備
  let insertData = [];
  let eachData = {};
  Object.keys(namedValues).forEach(key => {
    if ( // 基本情報は除外して処理
      key !== conf.headerCandidateName &&
      key !== conf.headerEcaluatorName &&
      key !== conf.headerInterviewDate &&
      key !== conf.headerEvaluatorEmail &&
      key !== conf.headerTimestamp
    ) {
      let intervewDateObj = new Date(namedValues[conf.headerInterviewDate][0]);
      let intervewDateUnix = intervewDateObj.getTime();
      // 初期化
      eachData = {};
      // 回答内容を設定
      eachData[conf.headerCandidateName] = namedValues[conf.headerCandidateName][0]; // 候補者の氏名
      eachData[conf.headerEcaluatorName] = namedValues[conf.headerEcaluatorName][0]; // 面接官の氏名
      eachData[conf.headerInterviewDate] = namedValues[conf.headerInterviewDate][0]; // 面接日
      eachData[conf.headerInterviewDateUnix] = intervewDateUnix; // 面接日（UNIX）
      eachData[conf.headerEvaluatorEmail] = namedValues[conf.headerEvaluatorEmail][0]; // 面接官のメールアドレス
      eachData[conf.headerTimestamp] = namedValues[conf.headerTimestamp][0]; // タイムスタンプ
      eachData[conf.headerEvalList] = key; // 評価項目
      eachData[conf.headerEvalValue] = namedValues[key][0]; // 評価数値
      eachData[conf.headerFormId] = formId; // フォームID

      // 格納データに追加
      insertData.push(eachData);
    }
  });

  // データの格納
  Logger.log(mdl.insertData(conf.sheetNameEvalResultDB, insertData));
}
