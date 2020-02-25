let buttonId = "kill";
let h2Id = "h2";
let pId = "p";
let message = "All Hail X";
let message2 = "Hail Back X";
let message3 = "Mission Accomplished";

const responseCallback = function(responseObject) {
  if (responseObject.message == message2) {
    let h2 = document.getElementById(h2Id);
    let p = document.getElementById(pId);
    let button = document.getElementById(buttonId);
    h2.innerText = "Start Killing...";
    p.innerText = "";
    if (button) {
      button.remove();
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  let button = document.getElementById(buttonId);
  button.addEventListener('click', () => {
    chrome.runtime.sendMessage(message, responseCallback);
  });
});

chrome.runtime.onMessage.addListener(async function(message, _, response) { 
  if (message.message == message3) {
    response();
    let h2 = document.getElementById(h2Id);
    h2.innerText = `Total Kills: ${message.count}`;
  }
});