const startingMinutes = 25;
let time = startingMinutes * 60;
let timerInterval = null;

function updateCountdown() {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    countdownEl.innerHTML = `${minutes}:${seconds}`;
    time--;
    if (time < 0) {
        clearInterval(timerInterval);
        chrome.runtime.sendMessage({timer:"done"});
        playTimerSound(); 
        alert("Time's up!");
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

