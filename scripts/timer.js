let startingMinutes = 1;
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
        let timerState = startingMinutes === 1 ? "endWork" : "endBreak";
        chrome.storage.local.set({ timerState: timerState, timerRunning: false });
        if (popupstatus) {
            chrome.runtime.sendMessage({ timer: timerState });
        }
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.command) {
        case "start":
            if (!timerInterval) {
                sendResponse({ status: "Start Success" });
                timerInterval = setInterval(updateCountdown, 1000);
                chrome.storage.local.set({ timerRunning: true });
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
        case "popupOpened":
            popupstatus = true;
            sendResponse({ status: "Popup Opened" });
            break;
        case "popupClosed":
            popupstatus = false;
            sendResponse({ status: "Popup Closed" });
            break;
    }
});


// function toggleMusic() {
//     const youtubeAudio = document.getElementById('youtubeAudio');
//     if (youtubeAudio) {
//         if (youtubeAudio.src.includes('autoplay=1')) {
//             youtubeAudio.src = youtubeAudio.src.replace('autoplay=1', 'autoplay=0');
//         } 
//         else {
//             youtubeAudio.src = youtubeAudio.src.replace('autoplay=0', 'autoplay=1');
//         }
//     }
// }


function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    time = startingMinutes * 60;
    updateCountdown();
};


function switchTimer(){
    if(startingMinutes == 1){
        startingMinutes = 5;
//        chrome.runtime.sendMessage({period:"break"})
    }
    else if(startingMinutes == 5){
        startingMinutes = 25;
//        chrome.runtime.sendMessage({period:"work"})
    }
};
