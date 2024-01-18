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
  const idTextStartH = "m510-txt-s-h";
  const idTextStartM = "m510-txt-s-m";
  const idTextEndH = "m510-txt-e-h";
  const idTextEndM = "m510-txt-e-m";

  // 正しい画面かチェック
  console.log("setMonthlyAttendance: checking");
  const td = $("body:contains(【勤務予定届出②】)");
  if ( td.length != 1) return;
  const td2 = $("td.index1_left:contains(届出名)").first().next('td').first();
  if ( td2.text().trim() != "勤務予定届") return;
  const e3 = $('table[summary="予定時間"]');
  if ( e3.length != 1) return;
  console.log("setMonthlyAttendance: correct site detected");

  // フィールド追加
  addComponents()

  // 初期値入力
  setPlannedTime('09','00','17','00')

  function setPlannedTime(startH, startM, endH, endM) {
    const trs = $('table[summary="予定時間"] tr').filter(function() {
      return $('td input[type="hidden"][name="ymd"]',this).length == 1;
    });
    trs.each(function(index) {
      if ($('input[name="wh_kbn"]', this).val() == 1 ) {
        // console.log("setMonthlyAttendance: tr", this);
        // 平日のみ値設定
        $('input[name="yotei1T_h"]', this).val(startH).change().blur();
        $('input[name="yotei1T_m"]', this).val(startM).change().blur();
        $('input[name="yotei2T_h"]', this).val(endH).change().blur();
        $('input[name="yotei2T_m"]', this).val(endM).change().blur();
      }
    });
  }

  function addComponents() {
    const td = $('table[summary="届出名"]').first().parent('td').parent('tr').append(`
      <td>
        <input type="text" id="${idTextStartH}" size="2" value="09"/>
        :
        <input type="text" id="${idTextStartM}" size="2" value="00"/>
        ～
        <input type="text" id="${idTextEndH}" size="2" value="17"/>
        :
        <input type="text" id="${idTextEndM}" size="2" value="30"/>
      </td>
    `);
    $(`#${idTextStartH}`).change(onTimeChanged)
    $(`#${idTextStartM}`).change(onTimeChanged)
    $(`#${idTextEndH}`).change(onTimeChanged)
    $(`#${idTextEndM}`).change(onTimeChanged)
  }
  function onTimeChanged() {
    console.log("onTimeChanged Called")
    setPlannedTime(
      $(`#${idTextStartH}`).val(),
      $(`#${idTextStartM}`).val(),
      $(`#${idTextEndH}`).val(),
      $(`#${idTextEndM}`).val(),
    );
  }


  return
})();
