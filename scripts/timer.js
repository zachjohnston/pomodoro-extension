let startingMinutes = 1;
let time = startingMinutes * 60;
let timerInterval = null;
let popupstatus = false;

function updateCountdown() {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    time--;
    if(popupstatus){
        chrome.runtime.sendMessage({command:"update", minutes: minutes, seconds: seconds})
    }

    if (time < 0) {
        clearInterval(timerInterval);
    
        if (startingMinutes === 1){
            chrome.runtime.sendMessage({timer:"endWork"});
        } 
        else if (startingMinutes === 5) {
            chrome.runtime.sendMessage({timer:"endBreak"})
        }
    }
}
//command message handler
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch(message.command) {
        case "start":
            //startTimer(message.duration);
            if(!timerInterval){
                sendResponse({status:"Start Success"})
                timerInterval = setInterval(updateCountdown, 1000);
            };
            break;
        case "pause":
            sendResponse({status:"Pause Success"})
            clearInterval(timerInterval);
            timerInterval = null;
            // pauseTimer();
            break;
        case "resume":
            sendResponse({status:"Resume Success"});
            if(!timerInterval) {
                timerInterval = setInterval(updateCountdown, 1000);
            }
            break;
        case "reset":
            sendResponse({status:"Reset Success"});
            resetTimer();
            break;
        case "switch":
            sendResponse({status:"Break Success"});
            switchTimer();
            resetTimer();
            timerInterval = setInterval(updateCountdown, 1000);
            break;
        case "music":
            sendResponse({status:"Music toggled"});
            // toggleMusic();
            break;
        case "popupOpened":
            popupstatus = true;
            console.log(popupstatus);
            sendResponse({status:"Popup Opened"})
            break;
        case "popupClosed":
            popupstatus = false;       
            console.log(popupstatus); 
            sendResponse({status:"Popup Closed"})
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
