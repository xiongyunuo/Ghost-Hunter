let list = document.querySelector("#clubs-root-index .clubs-members-list-component");
let blackList = [];
let message = "Slaughter Them All";
let clubId = 0;
const responseCallback = function() {};

if (list) {
  let list2 = list.querySelectorAll(".clubs-members-list-avatar");
  if (list2) {
    for (let i = 0; i < list2.length; i++) {
      blackList.push(list2[i].getAttribute("title"));
    }
  }
  let list3 = document.querySelectorAll(".post-category-link-category");
  if (list3) {
    for (let i = 0; i < list3.length; i++) {
      let result = /^https:\/\/www.chess.com\/club\/(\d+)\/settings$/.exec(list3[i].getAttribute("href"));
      if (result && result.length) {
        clubId = Number(result[1]);
      }
    }
  }
}

chrome.runtime.sendMessage({message: message, list: blackList, clubId: clubId}, responseCallback);