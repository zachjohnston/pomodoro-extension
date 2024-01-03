const startingMinutes = 25;
let time = startingMinutes * 60;
let timerInterval;  // Variable to hold the interval

const countdownEl = document.getElementById('countdown');

//Timer Logic
function updateCountdown() {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    // Adding a leading zero to seconds
    seconds = seconds < 10 ? '0' + seconds : seconds;

    countdownEl.innerHTML = `${minutes}: ${seconds}`;
    time--;

    // Stop the timer when it reaches 0
    if (time < 0) { 
        clearInterval(timerInterval);
        alert("Time's up!");
    }   
}

function resetTimer() {
    clearInterval(timerInterval);
    time = startingMinutes * 60;
    updateCountdown(); // To immediately update the display
    timerInterval = setInterval(updateCountdown, 1000);
}

//Document Logic
document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    const resetButton = document.getElementById('resetButton');

    startButton.addEventListener('click', function() {
        if (!timerInterval) { // Check if timer is already running
            timerInterval = setInterval(updateCountdown, 1000);
        }
        startButton.style.display = 'none';
        resetButton.style.display = 'block';
    });

    resetButton.addEventListener('click', function() {
        resetTimer();
        startButton.style.display = 'block';
        resetButton.style.display = 'none';
    });
}); 

resetButton.addEventListener('click', resetTimer);





// Starting the timer

