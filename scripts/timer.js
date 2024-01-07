let startingMinutes = 1;
let time = startingMinutes * 60;
let timerInterval = null;
const countdownEl = document.getElementById('countdown');

function updateCountdown() {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    countdownEl.innerHTML = `${minutes}:${seconds}`;
    console.log("ticking down")
    time--;
    
    if (time < 0) {
        clearInterval(timerInterval);
        chrome.runtime.sendMessage({timer:"done"});
        playTimerSound(); 
        alert("Time's up!");

        if (startingMinutes === 1){
            breakButton.style.display = 'block';
            playTimerSound();
        } else if (startingMinutes === 5) {
            workButton.style.display = 'block';
        }
    }
}

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

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    switch(message.command) {
        case "start":
            //startTimer(message.duration);
            sendResponse({status:"Timer started"})
            console.log("start success");
            timerInterval = setInterval(updateCountdown, 1000);
            break;
    }
    return true;
    
});

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     switch(message.command) {
//         case "start":
//             //startTimer(message.duration);
//             sendResponse({status:"Timer started"})
//             console.log("start success");
//             timerInterval = setInterval(updateCountdown, 1000);
//             break;
//         case "pause":
//             console.log("pause success");
//             clearInterval(timerInterval);
//             timerInterval = null;
//             // pauseTimer();
//             break;
//         case "resume":
//             console.log("resume success");
//             timerInterval = setInterval(updateCountdown, 1000);
//         case "reset":
//             console.log("reset success");
//             resetTimer();
//             break;
//         case "break":
//             console.log("break success");
//             switchTimer();
//             timerInterval = setInterval(updateCountdown, 1000);
//             break;
//     }
//     return true;
// });