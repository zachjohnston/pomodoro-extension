function toggleMusic() {
    const youtubeAudio = document.getElementById('youtubeAudio');
    if (youtubeAudio) {
        if (youtubeAudio.src.includes('autoplay=1')) {
            youtubeAudio.src = youtubeAudio.src.replace('autoplay=1', 'autoplay=0');
        } else {
            youtubeAudio.src = youtubeAudio.src.replace('autoplay=0', 'autoplay=1');
        }
    }
}
