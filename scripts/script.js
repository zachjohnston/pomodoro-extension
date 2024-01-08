const countdownEl = document.getElementById('countdown');

//event that gets the current time

document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const resetButton = document.getElementById('resetButton');
    const breakButton = document.getElementById('breakButton');
    // const musicToggleButton = document.getElementById('musicToggleButton');
    

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.timer === "endWork"){
        breakButton.style.display = 'block';

    }
    else if (message.timer === "endBreak"){
        workButton.style.display = 'block';

    }       
});    
    startButton.addEventListener('click', function() {
        console.log("start");
        chrome.runtime.sendMessage({command: "start"}, function(response){
            console.log(response.status);
        });

        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.command === "update"){
                const minutes = message.minutes;
                const seconds = message.seconds;
                countdownEl.innerHTML = minutes + ":" + seconds;
            }
        });

        startButton.style.display = 'none';
        pauseButton.style.display = 'block';
        resetButton.style.display = 'block';
    });

    pauseButton.addEventListener('click', function() {
        if (timerInterval) {
            //clearInterval(timerInterval);
            //timerInterval = null;
            console.log("pause");
            chrome.runtime.sendMessage({command:"pause"});
            pauseButton.textContent = 'Resume Timer';

        } else {
            //timerInterval = setInterval(updateCountdown, 1000);
            console.log("resume")
            chrome.runtime.sendMessage({command:"resume"});
            pauseButton.textContent = 'Pause Timer';
        }
    });

    resetButton.addEventListener('click', function() {
        console.log("reset");
        chrome.runtime.sendMessage({command:"reset"});

        //resetTimer();
        pauseButton.style.display = 'none';
        startButton.style.display = 'block';
    });

    breakButton.addEventListener('click', function() { 
      //appears when timer hits 0, starting minutes is 25
      //pressing the break button calls switchTimer() and starts countdown
      console.log("break");
      chrome.runtime.sendMessage({command:"break"});
      pauseButton.style.display = 'block';
      breakButton.style.display = 'none';
      resetButton.style.display = 'block';
    });
    // musicToggleButton.addEventlistener('click', function() {
    //     toggleMusic();
    // })
});
