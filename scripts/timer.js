let currentMusicTabId = null;
let workTime = 1 / 6; // 10 seconds for demonstration
let breakTime = 1 / 12; // 5 seconds for demonstration
let startingMinutes = workTime;
let time = startingMinutes * 60;
let timerInterval = null;
let popupStatus = false;

function updateCountdown() {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    time--;

    if (popupStatus) {
        chrome.runtime.sendMessage({ command: "update", minutes: minutes, seconds: seconds });
    }

    if (time < 0) {
        clearInterval(timerInterval);
        startingMinutes = (startingMinutes === workTime) ? breakTime : workTime;
        time = startingMinutes * 60;
        timerInterval = setInterval(updateCountdown, 1000);

        let timerState = startingMinutes === workTime ? "work" : "break";
        chrome.storage.local.set({ timerRunning: true, timerState: timerState });
        chrome.runtime.sendMessage({ command: "sessionChanged", timerState: timerState });
    }
}
function resetTimer(){
    clearInterval(timerInterval);
    timerInterval = null;
    startingMinutes = workTime;
    time = startingMinutes * 60;
    popupStatus = false;
    chrome.storage.local.set({ timerRunning: false, timerState: "work"});
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.command) {
        case "start":
            if (!timerInterval) {
                timerInterval = setInterval(updateCountdown, 1000);
                chrome.storage.local.set({ timerRunning: true, timerState: "work" });
            }
            break;
        case "pause":
            clearInterval(timerInterval);
            timerInterval = null;
            chrome.storage.local.set({ timerRunning: false });
            break;
        case "resume":
            if (!timerInterval) {
                timerInterval = setInterval(updateCountdown, 1000);
                chrome.storage.local.set({ timerRunning: true });
            }
            break;
        case "endSession":
            resetTimer();
            break;
        case "popupOpened":
            popupStatus = true;
            break;
        case "popupClosed":
            popupStatus = false;
            break;
    }
});

function pauseMusicInTab(tabId) {
    chrome.tabs.sendMessage(tabId, { command: "pauseMusic" });
}
