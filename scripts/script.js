const countdownEl = document.getElementById('countdown');
//const audio = new Audio('../audio/timer-sound.mp3');
var audio = new Audio(chrome.runtime.getURL("../audio/timer-sound.mp3"));

// When popup opens
chrome.runtime.sendMessage({command: "popupOpened"}, function(response){
    console.log(response.status);
});
// When popup closes
window.addEventListener('unload', function() {
    chrome.runtime.sendMessage({command: "popupClosed"}, function(response){
        console.log(response.status);
    });
});

let running = false;
document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const resetButton = document.getElementById('resetButton');
    const breakButton = document.getElementById('breakButton');
    const musicToggleButton = document.getElementById('musicToggleButton');
    

//event that listens for end of work or break message
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.timer === "endWork"){
        audio.play();
        switchButton.style.display = 'block';
        switchButton.textContent = 'Start Break';
    }
    else if (message.timer === "endBreak"){
        audio.play();
        switchButton.style.display = 'block';
        switchButton.textContent = 'Start Work';
    }       
});    
    startButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({command: "start"}, function(response){
            console.log(response.status);
            running = true;
        });

        startButton.style.display = 'none';
        pauseButton.style.display = 'block';
        resetButton.style.display = 'block';
    });

    pauseButton.addEventListener('click', function() {
        if (running) {
            //clearInterval(timerInterval);
            //timerInterval = null;
            running = false;
            chrome.runtime.sendMessage({command: "pause"}, function(response){
                console.log(response.status);
            });
            pauseButton.textContent = 'Resume Timer';

        } else {
            //timerInterval = setInterval(updateCountdown, 1000);
            running = true;
            chrome.runtime.sendMessage({command:"resume"}, function(response){
                console.log(response.status);
            });
            pauseButton.textContent = 'Pause Timer';

        }
    });

    resetButton.addEventListener('click', function() {
        console.log("reset");
        chrome.runtime.sendMessage({command: "reset"}, function(response){
            console.log(response.status);
        });

        //resetTimer();
        pauseButton.style.display = 'none';
        startButton.style.display = 'block';
    });

    switchButton.addEventListener('click', function() { 
      //appears when timer hits 0
      //pressing the break button calls switchTimer() and starts countdown
      console.log("switch");
      chrome.runtime.sendMessage({command: "switch"}, function(response){
        console.log(response.status);
    });
      pauseButton.style.display = 'block';
      breakButton.style.display = 'none';
      resetButton.style.display = 'block';
    });
    
    musicToggleButton.addEventListener('click', function() {
         chrome.runtime.sendMessage({command:"music"}, function(response){
            console.log(response.status);
         });
    })
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "update"){
        const minutes = message.minutes;
        const seconds = message.seconds;
        countdownEl.innerHTML = minutes + ":" + seconds;
    }
});
