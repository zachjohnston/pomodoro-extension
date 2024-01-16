document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const resetButton = document.getElementById('resetButton');
    const switchButton = document.getElementById('switchButton');
    const musicToggleButton = document.getElementById('musicToggleButton');
    const countdownEl = document.getElementById('countdown');
    let running = false;

    // Check initial timer state
    chrome.storage.local.get(['timerRunning', 'timerState'], function(data) {
        if (data.timerRunning) {
            startButton.style.display = 'none';
            pauseButton.style.display = 'block';
            resetButton.style.display = 'block';
        }

        if (data.timerState === "endWork" || data.timerState === "endBreak") {
            switchButton.style.display = 'block';
            switchButton.textContent = data.timerState === "endWork" ? 'Start Break' : 'Start Work';
            chrome.storage.local.remove('timerState');
        }
    });

    // When popup opens
    chrome.runtime.sendMessage({ command: "popupOpened" });

    // When popup closes
    window.addEventListener('unload', function() {
        chrome.runtime.sendMessage({ command: "popupClosed" });
    });

    // Start Timer
    startButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({ command: "start" }, function(response) {
            console.log(response.status);
            running = true;
            startButton.style.display = 'none';
            pauseButton.style.display = 'block';
            resetButton.style.display = 'block';
        });
    });

    // Pause/Resume Timer
    pauseButton.addEventListener('click', function() {
        if (running) {
            chrome.runtime.sendMessage({ command: "pause" }, function(response) {
                console.log(response.status);
                pauseButton.textContent = 'Resume Timer';
            });
        } else {
            chrome.runtime.sendMessage({ command: "resume" }, function(response) {
                console.log(response.status);
                pauseButton.textContent = 'Pause Timer';
            });
        }
        running = !running;
    });

    // Reset Timer
    resetButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({ command: "reset" }, function(response) {
            console.log(response.status);
            startButton.style.display = 'block';
            pauseButton.style.display = 'none';
            resetButton.style.display = 'none';
        });
    });

    // Switch Timer
    switchButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({ command: "switch" }, function(response) {
            console.log(response.status);
            // Update UI as needed
        });
    });

    // Toggle Music
    musicToggleButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({ command: "toggleMusic" }, function(response) {
            console.log(response.status);
        });
    });

    // Update countdown display
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.command === "update") {
            countdownEl.innerHTML = `${message.minutes}:${message.seconds}`;
        }
    });
});
