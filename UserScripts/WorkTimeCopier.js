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
  var td = $("td:contains(【日次勤務入力】)")
  if ( td.length != 1) return;

  const cookieKeyCopyCount='m510-copy-count'
  const cookieKeyCopySeqNo='m510-copy-seqNo'

  console.log("enter the site");
  var cookieCopyCount = Cookies.get(cookieKeyCopyCount);
  var cookieCopySeqNo = Cookies.get(cookieKeyCopySeqNo);
  console.log(cookieKeyCopyCount, cookieCopyCount)
  console.log(cookieKeyCopySeqNo, cookieCopySeqNo);

  // CopyCookie設定済みだったらコピーを繰り返す
  if ( cookieCopyCount > 0 ) {
    var btn = $(`input[name="seqNo"][value="${cookieCopySeqNo}"`).siblings('input[value="コピー"]');
    console.log("btn click by cookie",btn)
    $(btn).click()
    Cookies.set(cookieKeyCopyCount, --cookieCopyCount)
  }
  // var value=localStorage.getItem("m510.key1");
  // $(td).after('<td><div id="test-m510"></div></td>');
  // $('#test-m510').append('<input type="BUTTON" name="testgoto" id="btn-test-m510" value="テスト2" />');
  // 貼り付け用テキストボックスを追加
  addTextArea();
  // ５行コピーボタンを追加
  addMultiCopyButtons();
  // var lines = $('#m510-worktime-textarea').val("2023/02/24(金)	9:30	10:00	0:00	【N-BASE】移行チーム朝会＆QA確認会	0:30	NB(移行）	22090130140001	0	30	移行支援	朝会他メール確認等");

  // 日付取り出し
  var thisDate = new Date(Date.parse(
    // $('table[summary="日付"] > tbody > tr:eq(0) > td:eq(0)').eq(0).children('td').eq(0).text()
    $('table[summary="日付"] > tbody > tr:first > td:first').text()
  ));
  // console.log(thisDate);
  // 転記ボタンイベントの処理追加
  $("#m510-btn-copy-worktime").click(function() {
    // TODO:出退勤時刻の転記
    var lines = $('#m510-worktime-textarea').val().split('\n');
    // console.log(lines.length)
    var alerts = [];
    alerts.add = function(index, message ) {
      this.push(`${index}行目:${message}`);
    }
    // フォームのクリア処理
    clearForm();
      // var tbl = document.getElementsByTagName("table");
      // console.log("tbl", typeof(tbl));
      // console.log("tbl", tbl);
      // Array.prototype.forEach.call(tbl,function(t) {
        // if ( t.getAttribute("summary") == "管理単位" ) {
          // var tr = t.getElementsByTagName("tr")[2];
          // console.log("tr2",tr);
          // var td = tr.getElementsByTagName("td")[2];
          // console.log("td2",td);
          // var inp = td.getElementsByTagName("input")[0];
          // console.log("inp",inp);
          // inp.value = "タスク";
        // }
      // });
    lines.some((line,index) => {
      if ( line.trim().length === 0 ) return;
      var fields = line.split('\t');
      var date = new Date(Date.parse(fields[0]));
      // console.log(date);
      if ( date.getTime() != thisDate.getTime() ) {
        // alerts.push(`${index}:日付が違います`);
        alerts.add(index,'日付が違います');
        return;
      }
      // console.log("get values");
      var workTime = new Date(Date.parse(`${fields[0]} ${fields[5]}`));
      var workHour = workTime.getHours();
      var workMinute = workTime.getMinutes();
      var projectCd = fields[7];
      var task = fields[11];
      // console.log(date, workTime, workHour, workMinute, projectCd, task);
      var rows = new ProjectRows(projectCd);
      // TODO:プロジェクトが見つからない時はalertに追加
      var row = rows.findEmptyRow();
      if ( row === undefined || row.length == 0 ) {
          alerts.add(index,'空行が見つかりませんでした。コピーボタンを押して追加してください');
          return;
        // 空行が見つからない時はコピーボタンを押して行追加する
        // console.log("no empty rows found, clicking copy");
        // row = rows.addEmptyRow();
        // if ( row === undefined || row.length == 0 ) {
          // alerts.add(index,'コピーボタンを押しても空行が追加されませんでした');
          // return;
        // }
        console.log("copy end");
      }
      console.log("found row", row);
      // 転記
      // $('input[name="task"]', row).val("testt3").change().blur();
      row.setValues(task,workHour,workMinute);
      // TODO:内訳時間を入れなかった行に対して「削除」ボタンを押す
      // return true;
    });
    console.log("alerts", alerts);
    alert(alerts);
  })
  // フォームのクリア
  function clearForm() {
    console.log("clear form");
    // var tbl = document.getElementsByTagName("table");
    // Array.prototype.forEach.call(tbl,function(t) {
    //   if ( t.getAttribute("summary") == "管理単位" ) {
    //     var inps = t.getElementsByTagName("input");
    //     Array.prototype.forEach.call(inps,function(inp) {
    //       // if ( inp.getAttribute("type") != "button") {
    //       if ( inp.getAttribute("name") == "task" ||
    //            inp.getAttribute("name") == "minsH" ||
    //            inp.getAttribute("name") == "minsM") {
    //         console.log("inp",inp);
    //         inp.value = "";
    //         inp.dispatchEvent(new Event('change'));
    //         inp.dispatchEvent(new Event('blur'));
    //       }
    //     });
    //   }
    // });
    $('table[summary="管理単位"] input').not('[type="button"]').not('[type="hidden"]').each(function(index) {
      $(this).val("").change().blur();
    });

  }
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
      // var emptyTaskTd = $('td:has(input[name="task"])',emptyRow)
      // var emptyTimeTd = $('td:has(input[name="minsH"])',emptyRow)
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
      return this.findEmptyRow();
    }
  }
  function addTextArea() {
    console.log("adding textarea");
    var tre = $('tr:contains(シフト手当回数)');
    var tre = $('table[summary="PC時間/かい離"] > tbody > tr').eq(0);
    $(tre).append(`
      <td rowspan="4">
        <span>タブ区切りで日付～タスクまでを貼り付け</span>
        <textarea id="m510-worktime-textarea" cols="39" rows="10" />
        <input type="button" id="m510-btn-copy-worktime" value="転記"/>
      </td>
    `);
  }
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
})();