document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const pauseBreakButton = document.getElementById('pauseBreakButton');
    const endSessionButton = document.getElementById('endSessionButton');
    const countdownEl = document.getElementById('countdown');
    const musicToggleButton = document.getElementById('musicToggleButton');
    const youtubeAudio = document.getElementById('youtubeAudio');
    let initialStart = true;

    function updateUI(timerRunning, timerState) {
        if (timerRunning) {
            startButton.style.display = 'none';
            endSessionButton.style.display = 'block';

            if (timerState === 'work') {
                pauseButton.style.display = 'block';
                pauseBreakButton.style.display = 'none';
            } else {
                pauseButton.style.display = 'none';
                pauseBreakButton.style.display = 'block';
            }
        } else {
            pauseButton.style.display = 'none';
            pauseBreakButton.style.display = 'none';
            startButton.style.display = 'block';
            endSessionButton.style.display = 'none';

            startButton.textContent = initialStart ? 'Start Timer' : 
                (timerState === 'work' ? 'Resume Timer' : 'Resume Break');
        }
    }

    function updateProgressBar(completedCycles) {
        for (let i = 1; i <= 4; i++) {
            const box = document.getElementById('box' + i);
            if (i <= completedCycles) {
                box.classList.add('glow');
            } else {
                box.classList.remove('glow');
            }
        }
    }

    chrome.storage.local.get(['timerRunning', 'timerState'], function(data) {
        updateUI(data.timerRunning, data.timerState || 'work');
    });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.command === "update") {
            if (message.minutes <= 9){
                countdownEl.textContent = `0${message.minutes}:${message.seconds}`;    
            }
            else{
                countdownEl.textContent = `${message.minutes}:${message.seconds}`;
            }
        } else if (message.command === "sessionChanged") {
            updateUI(true, message.timerState);
        } else if (message.command === "sessionEnded") {
            initialStart = true;
            updateUI(false, 'work');
            countdownEl.textContent = '25:00';
            updateProgressBar(0); // Reset progress bar on session end
        } else if (message.command === "updateProgressBar") {
            updateProgressBar(message.completedCycles);
        }
    });

    startButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({ command: "start" });
        updateUI(true, initialStart ? 'work' : (pauseButton.style.display === 'none' ? 'break' : 'work'));
        initialStart = false;
    });

    pauseButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({ command: "pause" });
        updateUI(false, 'work');
    });

    pauseBreakButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({ command: "pause" });
        updateUI(false, 'break');
    });

    endSessionButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({ command: "endSession" });
        pauseButton.style.display = 'none';
        pauseBreakButton.style.display = 'none';
        startButton.style.display = 'block';
        endSessionButton.style.display = 'none';
    });

    musicToggleButton.addEventListener('click', function() {
        if (youtubeAudio.style.display === 'none' || youtubeAudio.style.display === '') {
            youtubeAudio.style.display = 'block';
        } else {
            youtubeAudio.style.display = 'none';
        }
    });

    chrome.runtime.sendMessage({ command: "popupOpened" });

    window.addEventListener('unload', function() {
        chrome.runtime.sendMessage({ command: "popupClosed" });
    });
});