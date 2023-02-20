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
    var value=localStorage.getItem("m510.key1");
    $(td).after('<td><input type="BUTTON" name="testgoto" id="test-m510" value="テスト2" /></td>')
    console.log("button has added");
    console.log($("#test-m510"));
    $("#test-m510").click(function() {
      console.log("test button has clicked");
      console.log("riyu", $("input[name='riyuu']"));
      $("input[name=riyuu]").val("テスト");
      console.log("localstoragevalue=",value);
    });
    localStorage.setItem("m510.key1","testvalue");
  }
    // const text1 = document.createElement("input");
    // text1.type = 'text';
    // text1.id = "test";
    // const target = document.getElementsByName("b_commit");
    // if ( target.length > 0 ) {
      // console.log("target found");
      // console.log(target);
    // } else {
      // console.log("target not found");
    // }
  // }
})();