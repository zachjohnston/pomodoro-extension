let currentMusicTabId = null;
let workTime = 1/6;
let breakTime = 5;
let startingMinutes = workTime;
let time = startingMinutes * 60;
let timerInterval = null;
let popupstatus = false;

function updateCountdown() {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    time--;

    if (popupstatus) {
        chrome.runtime.sendMessage({ command: "update", minutes: minutes, seconds: seconds });
    }

    if (time < 0) {
        clearInterval(timerInterval);
        let timerState = startingMinutes === workTime ? "endWork" : "endBreak";
        chrome.storage.local.set({ timerRunning: false, timerState: timerState });
        
        chrome.runtime.sendMessage({ command: "playAudio" }, function(response) {
            console.log(response.status);
        });

        if (popupstatus) {
            chrome.runtime.sendMessage({ timer: timerState });
        }
        resetTimer(); // Reset timer after it ends
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    time = startingMinutes * 60;
    updateCountdown();
}

function switchTimer(){
    if(startingMinutes === workTime){
        startingMinutes = breakTime;
    } else if(startingMinutes === breakTime){
        startingMinutes = workTime;
    }
    time = startingMinutes * 60;
    updateCountdown();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.command) {
        case "start":
            if (!timerInterval) {
                sendResponse({ status: "Start Success" });
                timerInterval = setInterval(updateCountdown, 1000);
                chrome.storage.local.set({ timerRunning: true });
            } else {
                sendResponse({ status: "Start Unsuccessful" });
            }
            break;
        case "pause":
            sendResponse({ status: "Pause Success" });
            clearInterval(timerInterval);
            timerInterval = null;
            chrome.storage.local.set({ timerRunning: false });
            break;
        case "resume":
            sendResponse({ status: "Resume Success" });
            if (!timerInterval) {
                timerInterval = setInterval(updateCountdown, 1000);
                chrome.storage.local.set({ timerRunning: true });
            }
            break;
        case "reset":
            sendResponse({ status: "Reset Success" });
            resetTimer();
            break;
        case "switch":
            sendResponse({ status: "Switching Timer" });
            switchTimer();
            if (!timerInterval) {
                timerInterval = setInterval(updateCountdown, 1000);
            }
            chrome.storage.local.set({ timerRunning: true });
            break;
        case "popupOpened":
            popupstatus = true;
            sendResponse({ status: "Popup Opened" });
            break;
        case "popupClosed":
            popupstatus = false;
            sendResponse({ status: "Popup Closed" });
            break;
        case "toggleMusic":
            if (currentMusicTabId !== null && currentMusicTabId !== sender.tab.id) {
                pauseMusicInTab(currentMusicTabId);
            }
            currentMusicTabId = sender.tab.id;
            sendResponse({ status: "Music toggled" });
            break;
    }
});

function pauseMusicInTab(tabId) {
    chrome.tabs.sendMessage(tabId, { command: "pauseMusic" });
}
