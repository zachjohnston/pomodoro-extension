const countdownEl = document.getElementById('countdown');
const audio = new Audio('../audio/timer-sound.mp3');
let running = false;
//event that gets the current time

document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const resetButton = document.getElementById('resetButton');
    const breakButton = document.getElementById('breakButton');
    // const musicToggleButton = document.getElementById('musicToggleButton');
    

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
        console.log("start");
        chrome.runtime.sendMessage({command: "start"}, function(response){
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
            console.log("pause");
            chrome.runtime.sendMessage({command:"pause"});
            chrome.runtime.sendMessage({command: "pause"}, function(response){
                console.log(response.status);
            });
            pauseButton.textContent = 'Resume Timer';

        } else {
            //timerInterval = setInterval(updateCountdown, 1000);
            running = true;
            console.log("resume")
            chrome.runtime.sendMessage({command:"resume"});
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
      //appears when timer hits 0, starting minutes is 25
      //pressing the break button calls switchTimer() and starts countdown
      console.log("break");
      chrome.runtime.sendMessage({command: "switch"}, function(response){
        console.log(response.status);
    });
      pauseButton.style.display = 'block';
      breakButton.style.display = 'none';
      resetButton.style.display = 'block';
    });
    // musicToggleButton.addEventlistener('click', function() {
    //     toggleMusic();
    // })
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "update"){
        const minutes = message.minutes;
        const seconds = message.seconds;
        countdownEl.innerHTML = minutes + ":" + seconds;
    }
});
