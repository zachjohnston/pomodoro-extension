const countdownEl = document.getElementById('countdown');

document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const resetButton = document.getElementById('resetButton');
    const breakButton = document.getElementById('breakButton');

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

    breakButton.addEventListener('click', function() {
      pauseButton.style.display = 'block'
    
    });

});

//if timer hits 0, show break button

//break button does 5 min timer instead of 25