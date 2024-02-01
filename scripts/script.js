document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const pauseBreakButton = document.getElementById('pauseBreakButton');
    const endSessionButton = document.getElementById('endSessionButton');
    const countdownEl = document.getElementById('countdown');
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

    chrome.storage.local.get(['timerRunning', 'timerState'], function(data) {
        updateUI(data.timerRunning, data.timerState || 'work');
    });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.command === "update") {
            countdownEl.textContent = `${message.minutes}:${message.seconds}`;
        } else if (message.command === "sessionChanged") {
            updateUI(true, message.timerState);
        } else if (message.command === "sessionEnded") {
            initialStart = true;
            updateUI(false, 'work');
            countdownEl.textContent = '25:00';
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
    });

    chrome.runtime.sendMessage({ command: "popupOpened" });

    window.addEventListener('unload', function() {
        chrome.runtime.sendMessage({ command: "popupClosed" });
    });
});
