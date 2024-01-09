//any code here is run when the popup is opened
// When popup opens
chrome.runtime.sendMessage({ command: "popupOpened" });

// When popup closes
window.addEventListener('unload', function() {
    chrome.runtime.sendMessage({ command: "popupClosed" });
});
