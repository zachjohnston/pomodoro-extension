let currentMusicTabId = null;
let workTime = 25; // Change this value to set the minutes you want your WORK period to be. 
let breakTime = 5; // Change this value to set the minutes you want your BREAK period to be. 
let startingMinutes = workTime;
let time = startingMinutes * 60;
let timerInterval = null;
let popupStatus = false;
let completedCycles = 0;
let inWorkSession = true;

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
        let isWorkTime = startingMinutes === workTime;

        // Check if a break session has ended
        if (!isWorkTime) {
            completedCycles++;
            if (completedCycles > 4) completedCycles = 1; // Reset after 4 cycles
            chrome.runtime.sendMessage({ command: "updateProgressBar", completedCycles: completedCycles });
        }

        startingMinutes = isWorkTime ? breakTime : workTime;
        time = startingMinutes * 60;
        timerInterval = setInterval(updateCountdown, 1000);

        let timerState = isWorkTime ? "break" : "work";
        chrome.storage.local.set({ timerRunning: true, timerState: timerState });
        chrome.runtime.sendMessage({ command: "sessionChanged", timerState: timerState });

        // Send additional message when break starts
        if (timerState === "break") {
            chrome.runtime.sendMessage({ command: "breakStarted" });
        }
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    startingMinutes = workTime;
    time = startingMinutes * 60;
    //popupStatus = false;
    completedCycles = 0;
    chrome.storage.local.set({ timerRunning: false, timerState: "work" });
    chrome.runtime.sendMessage({ command: "resetProgressBar" });
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
            let currentState = startingMinutes === workTime ? "work" : "break";
            chrome.storage.local.set({ timerRunning: false, timerState: currentState });
            break;
        case "resume":
            if (!timerInterval) {
                timerInterval = setInterval(updateCountdown, 1000);
                chrome.storage.local.set({ timerRunning: true });
            }
            break;
        case "endSession":
            chrome.runtime.sendMessage({command:"sessionEnded"});
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