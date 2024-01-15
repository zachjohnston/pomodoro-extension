var audio = new Audio(chrome.runtime.getURL("../audio/timer-sound.mp3"));

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command == "playAudio"){
        audio.play();
    }
    sendResponse({status:"Audio Playing"});

});