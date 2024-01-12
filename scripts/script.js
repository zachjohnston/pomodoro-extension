const countdownEl = document.getElementById('countdown');
var audio = new Audio(chrome.runtime.getURL("../audio/timer-sound.mp3"));

// Check if the timer is already running or has ended
chrome.storage.local.get(['timerRunning', 'timerState'], function(data) {
    if (data.timerRunning) {
        // Change UI if timer is running
        startButton.style.display = 'none';
        pauseButton.style.display = 'block';
        resetButton.style.display = 'block';
    }

    if (data.timerState === "endWork") {
        audio.play();
        switchButton.style.display = 'block';
        switchButton.textContent = 'Start Break';
        chrome.storage.local.remove('timerState'); // Clear the state
    } else if (data.timerState === "endBreak") {
        audio.play();
        switchButton.style.display = 'block';
        switchButton.textContent = 'Start Work';
        chrome.storage.local.remove('timerState'); // Clear the state
    }
});

// When popup opens
chrome.runtime.sendMessage({ command: "popupOpened" });

// When popup closes
window.addEventListener('unload', function() {
    chrome.runtime.sendMessage({ command: "popupClosed" });
});

let running = false;

document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const resetButton = document.getElementById('resetButton');
    const switchButton = document.getElementById('switchButton');
    const musicToggleButton = document.getElementById('musicToggleButton');

    // Event listener that listens for end of work or break message
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.timer === "endWork") {
            audio.play();
            switchButton.style.display = 'block';
            switchButton.textContent = 'Start Break';
        }
        else if (message.timer === "endBreak") {
            audio.play();
            switchButton.style.display = 'block';
            switchButton.textContent = 'Start Work';
        }
    });

    startButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({ command: "start" }, function(response) {
            console.log(response.status);
            running = true;
        });

        startButton.style.display = 'none';
        pauseButton.style.display = 'block';
        resetButton.style.display = 'block';
    });

    pauseButton.addEventListener('click', function() {
        if (running) {
            running = false;
            chrome.runtime.sendMessage({ command: "pause" }, function(response) {
                console.log(response.status);
            });
            pauseButton.textContent = 'Resume Timer';
        } else {
            running = true;
            chrome.runtime.sendMessage({ command: "resume" }, function(response) {
                console.log(response.status);
            });
            pauseButton.textContent = 'Pause Timer';
        }
    });

    resetButton.addEventListener('click', function() {
        console.log("reset");
        chrome.runtime.sendMessage({ command: "reset" }, function(response) {
            console.log(response.status);
        });

        pauseButton.style.display = 'none';
        startButton.style.display = 'block';
    });

    switchButton.addEventListener('click', function() {
        // Appears when timer hits 0
        // Pressing the switch button calls switchTimer() and starts countdown
        console.log("switch");
        chrome.runtime.sendMessage({ command: "switch" }, function(response) {
            console.log(response.status);
        });

        pauseButton.style.display = 'block';
        switchButton.style.display = 'none';
        resetButton.style.display = 'block';
    });

    musicToggleButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({ command: "music" }, function(response) {
            console.log(response.status);
        });
    });
});

// Listener for timer updates
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "update") {
        const minutes = message.minutes;
        const seconds = message.seconds;
        countdownEl.innerHTML = minutes + ":" + seconds;
    }
});