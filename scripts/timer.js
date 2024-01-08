let startingMinutes = 1;
let time = startingMinutes * 60;
let timerInterval = null;

function updateCountdown() {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    time--;
    
    chrome.runtime.sendMessage({command:"update", minutes: minutes, seconds: seconds})

    if (time < 0) {
        clearInterval(timerInterval);
        playTimerSound(); 
        
        if (startingMinutes === 1){
            chrome.runtime.sendMessage({timer:"endWork"});
            breakButton.style.display = 'block';
            playTimerSound();
        } else if (startingMinutes === 5) {
            chrome.runtime.sendMessage({timer:"endBreak"})
            workButton.style.display = 'block';
        }
    }
}

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
        case "break":
            sendResponse({status:"Break Success"});
            switchTimer();
            timerInterval = setInterval(updateCountdown, 1000);
            break;
    }
});


function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    time = startingMinutes * 60;
    updateCountdown();
}

function playTimerSound() {
    const audio = new Audio('../audio/timer-sound.mp3');
    audio.play();
}
//right here

function switchTimer(){
    if(startingMinutes == 1){
        startingMinutes = 5;
        chrome.runtime.sendMessage({period:"break"})
    }
    else if(startingMinutes == 5){
        startingMinutes = 25;
        chrome.runtime.sendMessage({period:"work"})
    }
}
