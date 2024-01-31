document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const pauseBreakButton = document.getElementById('pauseBreakButton');
    const endSessionButton = document.getElementById('endSessionButton');
    const countdownEl = document.getElementById('countdown');
    const progressCircle = document.getElementById('progress-circle'); // Assuming you have this element in your HTML
    let initialStart = true;

    // Function to update UI based on timer state and session
    function updateUI(timerRunning, timerState) {
        if (timerRunning) {
            startButton.style.display = 'none';
            endSessionButton.style.display = 'block';

            if (timerState === 'work') {
                pauseButton.style.display = 'block';
                pauseBreakButton.style.display = 'none';
            } else { // timerState is 'break'
                pauseButton.style.display = 'none';
                pauseBreakButton.style.display = 'block';
            }
        } else {
            pauseButton.style.display = 'none';
            pauseBreakButton.style.display = 'none';
            startButton.style.display = 'block';
            endSessionButton.style.display = 'none';

            if (initialStart) {
                startButton.textContent = 'Start Timer';
            } else {
                startButton.textContent = timerState === 'work' ? 'Resume Timer' : 'Resume Break';
            }
        }
    }

    // Check the current state of the timer and update UI
    chrome.storage.local.get(['timerRunning', 'timerState'], function(data) {
        updateUI(data.timerRunning, data.timerState || 'work');
    });

    // Update Countdown Display and UI based on messages from background
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.command === "update") {
            countdownEl.textContent = `${message.minutes}:${message.seconds}`;
        } else if (message.command === "sessionChanged") {
            updateUI(true, message.timerState);
        } else if (message.command === "updateProgress") {
            // Update the progress circle based on the received progress
            if (progressCircle) {
                progressCircle.style.background = `conic-gradient(#4CAF50 ${message.progress}%, transparent ${message.progress}%, transparent 100%)`;
            }
        }
    });

    // Start Timer or Resume Break
    startButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({ command: "start" });
        let currentState = initialStart ? 'work' : (pauseButton.style.display === 'none' ? 'break' : 'work');
        updateUI(true, currentState);
        initialStart = false;
    });

    // Pause Timer or Break
    pauseButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({ command: "pause" });
        updateUI(false, 'work');
    });

    pauseBreakButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({ command: "pause" });
        updateUI(false, 'break');
    });

    // End Session
    endSessionButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({ command: "endSession" });
        updateUI(false, 'work');
        countdownEl.textContent = '25:00';
        initialStart = true;
    });

    // When popup opens
    chrome.runtime.sendMessage({ command: "popupOpened" });

    // When popup closes
    window.addEventListener('unload', function() {
        chrome.runtime.sendMessage({ command: "popupClosed" });
    });
});
