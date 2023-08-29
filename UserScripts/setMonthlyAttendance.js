// ==UserScript==
// @name         SetMonthlyAttendance
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Set Monthly Attendance
// @author       You
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  console.log("setMonthlyAttendance: enter the site");

  // 正しい画面かチェック
  console.log("setMonthlyAttendance: checking");
  const td = $("body:contains(【勤務予定届出②】)");
  if ( td.length != 1) return;
  const td2 = $("td.index1_left:contains(届出名)").first().next('td').first();
  if ( td2.text().trim() != "勤務予定届") return;
  const e3 = $('table[summary="予定時間"]');
  if ( e3.length != 1) return;
  console.log("setMonthlyAttendance: correct site detected");

  // 初期値入力
  const trs = $('table[summary="予定時間"] tr').filter(function() {
    return $('td input[type="hidden"][name="ymd"]',this).length == 1;
  });
  trs.each(function(index) {
    if ($('input[name="wh_kbn"]', this).val() == 1 ) {
      // console.log("setMonthlyAttendance: tr", this);
      // 平日のみ値設定
      $('input[name="yotei1T_h"]', this).val('09').change().blur();
      $('input[name="yotei1T_m"]', this).val('30').change().blur();
      $('input[name="yotei2T_h"]', this).val('18').change().blur();
      $('input[name="yotei2T_m"]', this).val('00').change().blur();
    }
  });


  return
})();