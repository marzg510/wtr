// ==UserScript==
// @name         setPeriodMonthlyAttendance
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Set Monthly Attendance Period
// @author       You
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  console.log("setPeriodMonthlyAttendance: enter the site");

  // 正しい画面かチェック
  console.log("setPeriodMonthlyAttendance: checking");
  const td = $("body:contains(【勤務予定届出②】)");
  if ( td.length != 1) return;
  const td2 = $("td.index1_left:contains(届出名)").first().next('td').first();
  if ( td2.text().trim() != "勤務予定届") return;
  const e3 = $('input[name="todokeStartYmd"][type="text"]');
  if ( e3.length != 1) return;
  console.log("setPeriodMonthlyAttendance: correct site detected");

  // 初期値入力
  var today = new Date();
  if ( today.getDate() >= 28 ) {
    today = new Date(today.getFullYear(), today.getMonth()+1, today.getDate() );
  }
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  var lastDay = new Date(today.getFullYear(), today.getMonth()+1, 0);
  $('input[name="todokeStartYmd"]:first').val(formatDate(firstDay)).change().blur();
  $('input[name="todokeEndYmd"]:first').val(formatDate(lastDay)).change().blur();
  return

  function formatDate(date) {
    return `${date.getFullYear()}${("0"+(date.getMonth()+1)).slice(-2)}${("0"+date.getDate()).slice(-2)}`
  }

})();


