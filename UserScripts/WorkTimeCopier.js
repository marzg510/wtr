// ==UserScript==
// @name         LocalWorkTimeCopier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  console.log("enter the site");
  const cookieKeyRowCopyClicked='m510-copy-clicked';
  const cookieKeyTextArea='m510-textarea';
  const cookieKeyIndex='m510-textarea-index';
  const idTextArea = "m510-worktime-textarea";

  // 正しい画面かチェック
  const td = $("td:contains(【日次勤務入力】)");
  if ( td.length != 1) return;
  // debugArea追加
  var debugArea = $(td).append('<div id="m510-debug-area"/>');
  debugArea.log = function(message) {
    // const now = new Date();
    // $(this).append(`<p>${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} ${message}</p>`)
    $(this).append(`<p>${message}</p>`)
  }

  // 日付取り出し
  const thisDate = new Date(Date.parse(
    $('table[summary="日付"] > tbody > tr:first > td:first').text()
  ));

  // 閉じるときもcookieをクリアする
  $('input[name="btn_close"]:first').on('click', function() {
    clearCookie();
  });

  const worktimeTable = $('table[summary="管理単位"]');

  var cookieRowCopyClicked = Cookies.get(cookieKeyRowCopyClicked);
  const cookieTextArea = Cookies.get(cookieKeyTextArea);
  const cookieIndex = Cookies.get(cookieKeyIndex);
  console.log(cookieKeyTextArea, cookieTextArea);
  console.log(cookieKeyIndex, cookieIndex);
  debugArea.log(`page start, cookie_clicked:${cookieRowCopyClicked}`)

  // アラートメッセージ初期化
  var alerts = [];
  alerts.add = function(index, message ) {
    this.push(`${index+1}行目:${message}`);
  }
  // 貼り付け用テキストボックスを追加
  addTextArea(cookieTextArea);
  // コピーボタンが押された上の画面遷移だったら、転記を継続する
  if ( cookieRowCopyClicked ) {
    console.log("Copy Clicked Cookie Found");
    var lines = getTextAreaLines();
    console.log("lines",lines)
    console.log("line",lines[cookieIndex])
    copyWorkTimes(lines, cookieIndex);
  }

  // ******* functionの定義 *******
  /**
   * テキストエリアの中身を行の配列に変換
   * @returns 行の配列
   */
  function getTextAreaLines() {
    return $(`#${idTextArea}`).val().split('\n');
  }
  /**
   * 転記ボタンイベント
   */
  function onCopyClicked() {
    var lines = getTextAreaLines();
    console.log(lines.length)
    // フォームのクリア処理
    clearForm();
    // 転記
    copyWorkTimes(lines,0);
    if ( alerts.length > 0 ) alert(alerts.join('\n'));
    alerts = [];
    return;
  }
  /**
   * 指定行の作業時間を転記
   * @param {string[]} lines 
   * @param {number} index 
   */
  function copyWorkTimes(lines, index) {
    console.log("copy work times");
    var last_index = 0;
    lines.some((line,i) => {
      last_index = i
      if ( i < index ) return false;
      if ( line.trim().length === 0 ) return false;
      var fields = parseLine(line);
      // プロジェクトが見つからない時はalertに追加
      var projectCd = fields[7];
      debugArea.log(`copyWorkTimes projectCd=${projectCd}`);
      // プロジェクトが見つからない時はalertに追加
      if ( !hasProjectCd(projectCd) ) {
        alerts.add(i, `管理単位NO ${projectCd} が見つかりません`)
        return false;
      }
      var copied = copyWorkTime(fields,i);
      if ( !copied ) return true; // break
      $(debugArea).append(`<p>copied index=${i}, last_index=${last_index}</p>`)
    });
    $(debugArea).append(`<p>copy work times loop end. last_index=${last_index}, lines.length=${lines.length}</p>`)
    if ( last_index+1 === lines.length ) {
      // 転記が終わった時の処理
      // 出退勤時刻の転記
      copyStartEndTime(lines);
      // クッキークリア
      clearCookie();
    }
  }

  /**
   * 1行の作業時間を転記
   * @param {string[]} fields 
   * @param {number} index 
   * @returns copy succeed
   */
  function copyWorkTime(fields, index) {
    console.log("CopyWorkTime index",index)
    var date = new Date(Date.parse(fields[0]));
    if ( date.getTime() != thisDate.getTime() ) {
      alerts.add(index,'日付が違います');
      return false;
    }
    var workTime = new Date(Date.parse(`${fields[0]} ${fields[5]}`));
    var workHour = workTime.getHours();
    var workMinute = workTime.getMinutes();
    var projectCd = fields[7];
    var task = fields[11];
    var row = findEmptyRow(projectCd);
    if ( row === undefined || row.length == 0 ) {
        // 空行が見つからない時はコピーボタンを押して行追加する
        console.log("no empty rows found, clicking copy");
        // コピーボタンを押したのに空行が見つからない時はalert
        if ( cookieRowCopyClicked ) {
          alerts.add("コピーボタンを押したのに空行が見つかりませんでした。");
          return false;
        }
        clickRowCopy(projectCd,index);
        console.log("click end");
        return false;
    }
    console.log("found row", row);
    // 転記
    $('input[name="task"]', row).val(task).change().blur();
    $('input[name="minsH"]', row).val(workHour).change().blur();
    $('input[name="minsM"]', row).val(workMinute).change().blur();
    cookieRowCopyClicked = false; // 一度転記が成功したら行コピーボタンを押したフラグはどうでもいいはず
    return true;
  }
  /**
   * 出退勤時刻の転記
   * @param {string[]} lines
   */
  function copyStartEndTime(lines) {
    // 出勤時刻、退勤時刻を探す
    var minStartTime = new Date(9999,11,31).getTime();
    var maxEndTime = new Date(1970,0,1).getTime();
    lines.some((line,i)=>{
      var fields = parseLine(line);
      var startTime = new Date(Date.parse(`${fields[0]} ${fields[1]}`)).getTime();
      var endTime = new Date(Date.parse(`${fields[0]} ${fields[2]}`)).getTime();
      var projectCd = fields[7];
      if ( !hasProjectCd(projectCd) ) return false; // 見つからない管理単位NOはスキップ
      minStartTime = Math.min(minStartTime, startTime);
      maxEndTime = Math.max(maxEndTime, endTime);
    });
    $(debugArea).append(`<p>start=${typeof(minStartTime)}, end=${maxEndTime}</p>`)
    // 転記
    var start = new Date(minStartTime);
    var end = new Date(maxEndTime);
    $('input[name="startTH"]:first').val(start.getHours()).change().blur();
    $('input[name="startTM"]:first').val(start.getMinutes()).change().blur();
    $('input[name="endTH"]:first').val(end.getHours()).change().blur();
    $('input[name="endTM"]:first').val(end.getMinutes()).change().blur();
  }
  /**
   * １行をパースする
   * @param {string} line 
   * @returns fiels配列
   */
  function parseLine(line) {
    return line.split('\t');
  }
  /**
   * 管理単位NOがあるか
   * @param {string} projectCd 
   * @returns booolean 管理単位NOがあるか
   */
  function hasProjectCd(projectCd) {
    return getProjectRows(projectCd).length > 0;
  }
  /**
   * 空行を探す
   * 
   * @param {*} projectCd 
   * @returns empty row
   */
  function findEmptyRow(projectCd) {
    var rows =  $(`table[summary="管理単位"] tr:contains(${projectCd})`);
    var rows = getProjectRows(projectCd);
    var emptyRow = $('input[name="minsH"]', rows).filter(function() {
      return $.trim($(this).val()) === '';
    }).parent().parent().first();
    return emptyRow;
  }
  /**
   * 転記用テキスト入力エリアの追加
   */
  function addTextArea(value) {
    console.log("adding textarea",value);
    var tre = $('table[summary="PC時間/かい離"] > tbody > tr').eq(0);
    $(tre).append(`
      <td rowspan="4" id="m510-worktime-cell">
        <span>タブ区切りで日付～タスクまでを貼り付け</span>
        <textarea id="${idTextArea}" cols="39" rows="10" />
        <input type="button" id="m510-btn-copy-worktime" value="転記"/>
        <input type="button" id="m510-btn-clear-cookie" value="cookieクリア(debug)"/>
      </td>
    `);
    $(`#${idTextArea}`).val(value);
    // 転記ボタンイベントの処理追加
    $("#m510-btn-copy-worktime").click(onCopyClicked);
    // クッキークリア処理
    $("#m510-btn-clear-cookie").click(clearCookie);
  }
  /**
   * 行のコピーボタンを押す
   * @param {string} projectCd
   * @param {number} index 
   */
  function clickRowCopy(projectCd,index) {
    console.log("click row copy");
    Cookies.set(cookieKeyRowCopyClicked, true, {expires: 1});
    Cookies.set(cookieKeyTextArea, $(`#${idTextArea}`).val(), {expires: 1});
    Cookies.set(cookieKeyIndex, index, {expires: 1});
    $(getProjectRows(projectCd)).first().find('input[type="button"][value="コピー"]').first().click();
  }
  /**
   * クッキーのクリア
   */
  function clearCookie() {
    Cookies.set(cookieKeyRowCopyClicked,"");
    Cookies.set(cookieKeyTextArea,"");
    Cookies.set(cookieKeyIndex,"");
    $(debugArea).append(`<p>cookie cleared.</p>`)
  }
  /**
   * 指定された管理単位NOのTRエレメントの集合を返す
   * @param {string} projectCd 
   * @returns Project's TR elements
   */
  function getProjectRows(projectCd) {
    return $(`tr:contains(${projectCd})`, worktimeTable);
  }
  /**
   * フォームのクリア
   */
  function clearForm() {
    console.log("clear form");
    $('input[type="text"]',worktimeTable).each(function(index) {
      $(this).val("").change().blur();
    });
  }
})();