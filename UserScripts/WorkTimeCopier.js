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

  // if ( window.frames.name == "DATA_FRAME") {
  var td = $("td:contains(【日次勤務入力】)")
  if ( td.length == 1) {
    console.log("enter the site");
    // var value=localStorage.getItem("m510.key1");
    $(td).after('<td><div id="test-m510"></div></td>');
    $('#test-m510').append('<input type="BUTTON" name="testgoto" id="btn-test-m510" value="テスト2" />');
    $('#test-m510').append(`<table border="1">
    <tr>
    <td>hello</td>
    <td rowspan="2">hello world</td>
    </tr>
    <tr><td>world</td></tr>
    </table>`);
    var tre = $('tr:contains(シフト手当回数)');
    var tre = $('table[summary="PC時間/かい離"] > tbody > tr').eq(0);
    $(tre).append(`
      <td rowspan="4">
        <span>タブ区切りで日付～タスクまでを貼り付け</span>
        <textarea id="m510-worktime-textarea" cols="39" rows="10" />
        <input type="button" id="m510-btn-copy-worktime" value="転記"/>
      </td>
    `);
    var lines = $('#m510-worktime-textarea').val("2023/02/24(金)	9:30	10:00	0:00	【N-BASE】移行チーム朝会＆QA確認会	0:30	NB(移行）	22090130140001	0	30	移行支援	朝会他メール確認等");

    var thisDate = new Date(Date.parse(
      $('table[summary="日付"] > tbody > tr').eq(0).children('td').eq(0).text()
    ));
    var outTable = $('table[summary="管理単位"]')
    console.log(thisDate);
    $("#m510-btn-copy-worktime").click(function() {
      var lines = $('#m510-worktime-textarea').val().split('\n');
      // console.log(lines.length)
      lines.forEach((line,index) => {
        var fields = line.split('\t');
        var date = new Date(Date.parse(fields[0]));
        if ( date.getTime() != thisDate.getTime() ) {
          alert (`${index}:日付が違います`);
          return;
        }
        var workTime = new Date(Date.parse(`${fields[0]} ${fields[5]}`));
        var workHour = workTime.getHours();
        var workMinute = workTime.getMinutes();
        var projectCd = fields[7];
        var task = fields[11];
        console.log(date, workTime, workHour, workMinute, projectCd, task);
      });
    })
    console.log("button has added");
    console.log($("#test-m510"));
    $("#btn-test-m510").click(function() {
      console.log("test button has clicked");
      console.log("riyu", $("input[name='riyuu']"));
      $("input[name=riyuu]").val("テスト");
      console.log("localstoragevalue=",value);
    });
    // localStorage.setItem("m510.key1","testvalue");
  }
})();