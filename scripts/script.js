const startingMinutes = 25;
let time = startingMinutes * 60;
let timerInterval = null;

const countdownEl = document.getElementById('countdown');

function updateCountdown() {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    countdownEl.innerHTML = `${minutes}:${seconds}`;
    time--;

    if (time < 0) {
        clearInterval(timerInterval);
        alert("Time's up!");
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    time = startingMinutes * 60;
    updateCountdown();
}

document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const resetButton = document.getElementById('resetButton');

    startButton.addEventListener('click', function() {
        if (!timerInterval) {
            timerInterval = setInterval(updateCountdown, 1000);
        }
        startButton.style.display = 'none';
        pauseButton.style.display = 'block';
        resetButton.style.display = 'block';
    });

    pauseButton.addEventListener('click', function() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
            pauseButton.textContent = 'Resume Timer';
        } else {
            timerInterval = setInterval(updateCountdown, 1000);
            pauseButton.textContent = 'Pause Timer';
        }
    });

    resetButton.addEventListener('click', function() {
        resetTimer();
        pauseButton.style.display = 'none';
        startButton.style.display = 'block';
    });
});
