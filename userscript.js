// ==UserScript==
// @name         Map Battle BattleMap Timer
// @namespace    http://towerofawesome.org
// @version      1.0
// @description  Starts a timer when you enter the map editor. Timer always start at zero even if the map isn't new
// @author       Forecaster
// @match        https://www.dungeonfog.com/platform/editor_v5/*
// @icon         https://www.google.com/s2/favicons?domain=dungeonfog.com
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  let timer = document.createElement("div");
  timer.style.position = "absolute";
  timer.style.top = "50px";
  timer.style.left = "0";
  timer.style.background = "black";
  timer.style.borderRadius = "0 10px 10px 0";
  timer.style.padding = "10px";
  timer.style.boxShadow = "5px 5px rgb(0 0 0 / 30%)";
  timer.style.fontWeight = "bold";
  timer.innerText = "Just started!";
  timer.setAttribute("show-seconds", "true");
  document.body.appendChild(timer);
  timer.ondblclick = function(event) {
    let value = (event.target.getAttribute("show-seconds") !== "true").toString();
    event.target.setAttribute("show-seconds", value);
    event.preventDefault();
    event.stopPropagation();
    return false;
  };
  let start_time = new Date().getTime();

  let url_match = document.baseURI.match("\/map\/(.{32})\/");
  if (url_match != null) {
    let id = url_match[1];
    if (typeof window.localStorage[id] !== "undefined")
      start_time = window.localStorage[id];
    else
      window.localStorage[id] = start_time;
  }

  setInterval(function() {
    let show_seconds = timer.getAttribute("show-seconds") === "true";
    let elapsed_time = new Date().getTime() - start_time;
    let seconds = Math.floor(elapsed_time / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds - (minutes*60);
    let hours = Math.floor(minutes / 60);
    minutes = minutes - (hours*60);
    let times = [];
    if (hours > 0)
      times.push(hours + " hour" + (hours == 1 ? "" : "s"));
    if (minutes > 0 || !show_seconds)
      times.push(minutes + " minute" + (minutes == 1 ? "" : "s"));
    if (show_seconds)
      times.push(seconds + " second" + (seconds == 1 ? "" : "s"));
    timer.innerText = times.join(" ");
    if (hours >= 3) {
      timer.style.color = "black";
      timer.style.background = "red";
    }
    else if (hours >= 2 && minutes >= 30)
      timer.style.color = "orange";
  }, 1000);
})();
