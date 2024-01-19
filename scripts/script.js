document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const endSessionButton = document.getElementById('endSessionButton');
    const countdownEl = document.getElementById('countdown');

    // Function to update UI based on timer state and session
    function updateUI(timerRunning, timerState) {
        if (timerRunning) {
            startButton.style.display = 'none';
            pauseButton.textContent = 'Pause Timer';
            pauseButton.style.display = 'block';
        } else {
            startButton.style.display = 'block';
            pauseButton.style.display = 'none';
            startButton.textContent = timerState === 'work' ? 'Start Timer' : 'Resume Break';
        }
    }

    // Check the current state of the timer and update UI
    chrome.storage.local.get(['timerRunning', 'timerState'], function(data) {
        updateUI(data.timerRunning, data.timerState || 'work');
    });

    // Update Countdown Display and UI based on messages from background
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.command === "update") {
            countdownEl.innerHTML = `${message.minutes}:${message.seconds}`;
        } else if (message.command === "sessionChanged") {
            updateUI(true, message.timerState);
        }
    });

    // Start Timer or Resume Break
    startButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({ command: "start" });
        updateUI(true, 'work');
    });

    // Pause Timer or Break
    pauseButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({ command: "pause" });
        updateUI(false, 'work');
    });

    // End Session
    endSessionButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({ command: "endSession" });
        updateUI(false, 'work');
    });

    // When popup opens
    chrome.runtime.sendMessage({ command: "popupOpened" });

    // When popup closes
    window.addEventListener('unload', function() {
        chrome.runtime.sendMessage({ command: "popupClosed" });
    });
});
