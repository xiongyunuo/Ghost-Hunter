let messageX = "All Hail X";
let message2 = "Hail Back X";
let message3 = "Slaughter Them All";
let message4 = "Mission Accomplished";
let currentTabs = [];
let currentId = 0;
let counter = 0;
let totalCount = 0;
let stop = false;
let stopCommand = "stop killing";
let responseObject = {
  message : message2,
  sender : "event_script.js"
};
const timeout = function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};
const ghostHunting = function() {
  currentTabs = [];
  counter = 0;
  if (currentId) {
    chrome.tabs.executeScript(currentId, {
      file : "content_script.js"
    });
  }
  else {
    chrome.tabs.executeScript({
      file : "content_script.js"
    });
  }
};
const missionAccomplished = function() {
  stop = true;
  currentId = 0;
  chrome.runtime.sendMessage({message: message4, count: totalCount}, () => {});
};

chrome.runtime.onMessage.addListener(async function(message, _, response) {
  if (message == messageX) {
    response(responseObject);
    stop = false;
    totalCount = 0;
    chrome.tabs.query({currentWindow: true, active: true}, tabs => {
      currentId = tabs[0].id;
    });
    ghostHunting();
  }
  else if (message.message == message3) {
    response(responseObject);
    if (message.list.length == 0) {
      missionAccomplished();
    }
    for (let i = 0; i < message.list.length; i++) {
      if (stop) {
        return;
      }
      await timeout(500);
      let createProperties = {
        url : `https://www.chess.com/club/reject/${message.clubId}/${message.list[i]}?type=delete`,
        active : false
      };
      chrome.tabs.create(createProperties, tab => {
        currentTabs.push(tab.id);
      });
    }
  }
});

chrome.tabs.onUpdated.addListener(async function(tabid, _, tab) {
  if (stop) {
    return;
  }
  if (currentId == tabid && tab.status == "complete") {
    ghostHunting();
  }
  else if (currentTabs.find(e => e === tabid) && tab.status == "complete") {
    if (tab.url.includes("https://www.chess.com/clubs")) {
      counter += 1;
      totalCount += 1;
    }
    await timeout(100);
    chrome.tabs.remove(tabid);
    currentTabs = currentTabs.filter(value => value != tabid);
    if (currentTabs.length == 0) {
      if (counter > 0) {
        chrome.tabs.reload(currentId);
      }
      else {
        missionAccomplished();
      }
    }
  }
});

chrome.commands.onCommand.addListener(command => {
	if (command == stopCommand) {
    missionAccomplished();
  }
});