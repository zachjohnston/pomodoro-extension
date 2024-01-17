document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const switchButton = document.getElementById('switchButton');
    const musicToggleButton = document.getElementById('musicToggleButton');
    const countdownEl = document.getElementById('countdown');
    let running = false;

    // Check initial timer state
    chrome.storage.local.get(['timerRunning', 'timerState'], function(data) {
        if (data.timerRunning) {
            startButton.style.display = 'none';
            pauseButton.style.display = 'block';
        } else {
            startButton.style.display = (data.timerState !== "endWork") ? 'block' : 'none';
            pauseButton.style.display = 'none';
        }

        if (data.timerState === "endWork") {
            switchButton.style.display = 'block';
            switchButton.textContent = 'Start Break';
        } else if (data.timerState === "endBreak") {
            switchButton.style.display = 'none';
        } else {
            switchButton.style.display = 'none';
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

    // Switch Timer (Break)
    switchButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({ command: "switch" }, function(response) {
            console.log(response.status);
            switchButton.style.display = 'none'; // Hide switch button once clicked
            pauseButton.style.display = 'block'; // Show pause button during break
            running = false; // Assuming break time is not considered 'running'
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
