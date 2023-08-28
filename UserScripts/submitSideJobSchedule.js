// ==UserScript==
// @name         SubmitSideJobSchedule
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Submitting Side Job Schedule
// @author       You
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==
(function() {
  'use strict';

  console.log("submitSideJobSchedule: enter the site");
  const cookieKeyRepeatClicked='m510-repeat-clicked';
  const cookieKeyDate='m510-date';
  const cookieKeyStarthh='m510-start-hh';
  const cookieKeyStartmm='m510-start-mm';
  const cookieKeyEndhh='m510-end-hh';
  const cookieKeyEndmm='m510-end-mm';
  const cookieKeyAlerts='m510-alerts';

  // 正しい画面かチェック
  console.log("submitSideJobSchedule: checking");
  const td = $("body:contains(【勤務予定届出】)");
  if ( td.length != 1) return;
  const td2 = $('input[value="副業・兼業勤務予定届"]');
  if ( td2.length != 1) return;
  console.log("submitSideJobSchedule: correct site detected");

  var newCSS ;
  newCSS = GM_getResourceText ("jquery-ui.min.css");
  GM_addStyle (newCSS);

  var alerts = Cookies.get(cookieKeyAlerts);
  if ( !alerts ) { alerts = []; }
  alerts.add = function(index, message ) {
    this.push(`${index+1}行目:${message}`);
  }

  // 画面コンポーネントを追加する
  var de = $('input[name="todokeYmd"]:first');
  console.log("datepicker",de);
  de.datepicker({
    dateFormat: "yymmdd"
  });

  // 初期値入力
  $('input[name="startTimeH"]:first').val('22').change().blur();
  $('input[name="startTimeM"]:first').val('00').change().blur();
  $('input[name="endTimeH"]:first').val('23').change().blur();
  $('input[name="endTimeM"]:first').val('00').change().blur();
  $('input[name="todokeRiyuu"]:first').val('API実装作業').change().blur();
  return

  // ******* functionの定義 *******
})();