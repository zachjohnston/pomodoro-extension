const countdownEl = document.getElementById('countdown');

document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const resetButton = document.getElementById('resetButton');
    const breakButton = document.getElementById('breakButton');
    const musicToggleButton = document.getElementById('musicToggleButton');
    
    startButton.addEventListener('click', function() {
        if (!timerInterval) {
            //timerInterval = setInterval(updateCountdown, 1000);
            chrome.runtime.sendMessage({command:"start"});
        }
        startButton.style.display = 'none';
        pauseButton.style.display = 'block';
        resetButton.style.display = 'block';
    });

    chrome.runtime.onMessage.addListener((message, sender, sendMessage) => {
        if(message.timer === "done"){
            if(message.period === "break"){
                
            }
            else if(message.period === "work"){

            }
        }
//        if(message)
    });

    pauseButton.addEventListener('click', function() {
        if (timerInterval) {
            //clearInterval(timerInterval);
            //timerInterval = null;
            chrome.runtime.sendMessage({command:"pause"});
            pauseButton.textContent = 'Resume Timer';
        } else {
            //timerInterval = setInterval(updateCountdown, 1000);
            chrome.runtime.sendMessage({command:"resume"});
            pauseButton.textContent = 'Pause Timer';
        }
    });

    resetButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({command:"reset"});
        //resetTimer();
        pauseButton.style.display = 'none';
        startButton.style.display = 'block';
    });

    breakButton.addEventListener('click', function() { 
      //appears when timer hits 0, starting minutes is 25
      //pressing the break button calls switchTimer() and starts countdown
      //switchTimer();
      //timerInterval = setInterval(updateCountdown, 1000)
      chrome.runtime.sendMessage({command:"break"});
      pauseButton.style.display = 'block';
      breakButton.style.display = 'none';
      resetButton.style.display = 'block';
    });
    musicToggleButton.addEventlistener('click', function() {
        toggleMusic();
    })
});
