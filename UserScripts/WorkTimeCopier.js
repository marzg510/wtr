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

  // 正しい画面かチェック
  var td = $("td:contains(【日次勤務入力】)");
  if ( td.length != 1) return;

  const cookieKeyCopyCount='m510-copy-count';
  const cookieKeyCopySeqNo='m510-copy-seqNo';
  const cookieKeyRowCopyClicked='m510-copy-clicked';
  const cookieKeyTextArea='m510-textarea';
  const cookieKeyIndex='m510-textarea-index';

  console.log("enter the site");
  const worktimeTable = $('table[summary="管理単位"]');

  var cookieCopyCount = Cookies.get(cookieKeyCopyCount);
  var cookieCopySeqNo = Cookies.get(cookieKeyCopySeqNo);
  const cookieRowCopyClicked = Cookies.get(cookieKeyRowCopyClicked);
  const cookieTextArea = Cookies.get(cookieKeyTextArea);
  const cookieIndex = Cookies.get(cookieKeyIndex);
  // console.log(cookieKeyCopyCount, cookieCopyCount);
  // console.log(cookieKeyCopySeqNo, cookieCopySeqNo);
  // console.log(cookieKeyCopyClicked, cookieCopyClicked);

  // CopyCookie設定済みだったらコピーを繰り返す
  if ( cookieCopyCount > 0 ) {
    var btn = $(`input[name="seqNo"][value="${cookieCopySeqNo}"`).siblings('input[value="コピー"]');
    console.log("btn click by cookie",btn)
    $(btn).click()
    Cookies.set(cookieKeyCopyCount, --cookieCopyCount)
  }
  // 貼り付け用テキストボックスを追加
  addTextArea(cookieTextArea);
  // コピーボタンが押された上の画面遷移だったら、転記を継続する
  if ( cookieRowCopyClicked ) {
    lines = getTextAreaLines();
    CopyWorkTime(lines[cookieIndex]);
  }
  // ５行コピーボタンを追加
  addMultiCopyButtons();
  // var lines = $('#m510-worktime-textarea').val("2023/02/24(金)	9:30	10:00	0:00	【N-BASE】移行チーム朝会＆QA確認会	0:30	NB(移行）	22090130140001	0	30	移行支援	朝会他メール確認等");

  // 日付取り出し
  var thisDate = new Date(Date.parse(
    $('table[summary="日付"] > tbody > tr:first > td:first').text()
  ));
  // 転記ボタンイベントの処理追加
  $("#m510-btn-copy-worktime").click(onCopyClicked);

  /**
   * フォームのクリア
   */
  function clearForm() {
    console.log("clear form");
    $('input[type="text"]',worktimeTable).each(function(index) {
      $(this).val("").change().blur();
    });
  }
  /**
   * テキストエリアの中身を行の配列に変換
   * @returns 行の配列
   */
  function getTextAreaLines() {
    return $('#m510-worktime-textarea').val().split('\n');
  }
  /**
   * 転記ボタンイベント
   */
  function onCopyClicked() {
    var lines = getTextAreaLines();
    console.log(lines.length)
    var alerts = [];
    alerts.add = function(index, message ) {
      this.push(`${index+1}行目:${message}`);
    }
    // フォームのクリア処理
    clearForm();
    // １行ずつ転記
    lines.some((line,index) => {
      if ( line.trim().length === 0 ) return;
      CopyWorkTime(line);
      // return true;
    });
    console.log("alerts", alerts);
    if ( alerts.length > 0 ) alert(alerts.join('\n'));
    // TODO:出退勤時刻の転記
    return;
  }
  /**
   * 1行の作業時間を転記
   * @param {string} line 
   */
  function CopyWorkTime(line) {
    var fields = line.split('\t');
    var date = new Date(Date.parse(fields[0]));
    if ( date.getTime() != thisDate.getTime() ) {
      alerts.add(index,'日付が違います');
      return;
    }
    var workTime = new Date(Date.parse(`${fields[0]} ${fields[5]}`));
    var workHour = workTime.getHours();
    var workMinute = workTime.getMinutes();
    var projectCd = fields[7];
    var task = fields[11];
    // TODO:プロジェクトが見つからない時はalertに追加
    var row = findEmptyRow(projectCd);
    if ( row === undefined || row.length == 0 ) {
        alerts.add(index,'空行が見つかりませんでした。コピーボタンを押して追加してください');
        return true;
        // 空行が見つからない時はコピーボタンを押して行追加する
        // pushCopy(projectCd,index);
      // console.log("no empty rows found, clicking copy");
      // row = rows.addEmptyRow();
      // if ( row === undefined || row.length == 0 ) {
      // alerts.add(index,'コピーボタンを押しても空行が追加されませんでした');
        // return;
      // }
      // console.log("copy end");
    }
    console.log("found row", row);
    // 転記
    row.setValues(task,workHour,workMinute);
    // TODO:内訳時間を入れなかった行に対して「削除」ボタンを押す

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
    if ( emptyRow !== undefined ) {
      // 行に値をセット
      emptyRow.setValues = function(task, hour, minute) {
        $('input[name="task"]', this).val(task).change().blur();
        $('input[name="minsH"]', this).val(hour).change().blur();
        $('input[name="minsM"]', this).val(minute).change().blur();
      }
    }
    return emptyRow;
  }
  /**
   * @deprecated
   * @param {*} projectCd 
   */
  function ProjectRows(projectCd) {
    this.projectCd = projectCd
    // プロジェクトの行を返す
    ProjectRows.prototype.getRows = function() {
      return $(`table[summary="管理単位"] tr:contains(${projectCd})`);
    }
    // 空の行を探す
    ProjectRows.prototype.findEmptyRow = function() {
      var rows = this.getRows();
      var emptyRow = $('input[name="minsH"]', rows).filter(function() {
        return $.trim($(this).val()) === '';
      }).parent().parent().first();
      console.log( "project row", rows );
      console.log( "empty row", emptyRow );
      // console.log( "empty row time td val", $('input[name="minsH"]',emptyTimeTd).val() );
      // 行に値をセット
      if ( emptyRow !== undefined ) {
        emptyRow.setValues = function(task, hour, minute) {
          console.log("setvalues", this);
          // $('input[name="task"]', this).val("test").change().blur();
          $('input[name="task"]', this).val(task).change().blur();
          $('input[name="minsH"]', this).val(hour).change().blur();
          $('input[name="minsM"]', this).val(minute).change().blur();
        }
      }
      return emptyRow;
    }
    // コピーボタンを押して空行を追加する
    ProjectRows.prototype.addEmptyRow = function() {
      var row = this.getRows().first();
      console.log("project first row",row );
      document.addEventListener('DOMContentLoaded', function() {
        console.log("onload");
      });
      $('input[type="button"][value="コピー"]',row).click();
      console.log("row clicked");
      Cookies.set(cookieKeyCopyCount,1, {expires: 1});
      // Cookies.set(cookieKeyCopySeqNo,$(this).siblings('input[name="seqNo"]').val(), {expires: 1});
      return this.findEmptyRow();
    }
  }
  /**
   * 転記用テキスト入力エリアの追加
   */
  function addTextArea(value) {
    console.log("adding textarea");
    var tre = $('tr:contains(シフト手当回数)');
    var tre = $('table[summary="PC時間/かい離"] > tbody > tr').eq(0);
    $(tre).append(`
      <td rowspan="4">
        <span>タブ区切りで日付～タスクまでを貼り付け</span>
        <textarea id="m510-worktime-textarea" cols="39" rows="10" value="${value}"/>
        <input type="button" id="m510-btn-copy-worktime" value="転記"/>
      </td>
    `);
  }
  /**
   * @deprecated
   */
  function addMultiCopyButtons() {
    $(`<input type=button value="5行コピー" name="copy5"/>`).appendTo(
      $('table[summary="管理単位"] td:has(input[type="button"][value="コピー"])')
    ).click(function() {
      console.log("clicked ", $(this));
      console.log("copy btn", $(this).siblings('input[type="button"][value="コピー"]'));
      $(this).siblings('input[type="button"][value="コピー"]').click();
      Cookies.set(cookieKeyCopyCount,4, {expires: 1});
      Cookies.set(cookieKeyCopySeqNo,$(this).siblings('input[name="seqNo"]').val(), {expires: 1});
    });
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
   * 行のコピーボタンを押す
   * @param {string} projectCd
   * @param {number} index 
   */
  function pushCopy(projectCd,index) {
    Cookies.set(cookieKeyCopyClicked,true, {expires: 1});
    Cookies.set(cookieKeyTextArea,$('m510-worktime-textarea').val(), {expires: 1});
    Cookies.set(cookieKeyIndex,index, {expires: 1});
    $(getProjectRows(projectCd)).first().find('input[type="button"][value="コピー"]').first().click();
  }
})();