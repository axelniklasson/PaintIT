
var sourceHTML = "";

chrome.extension.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    sourceHTML = request.source;
    alert('load done');
  }
});

function onWindowLoad() {

  chrome.tabs.executeScript(null, {
    file: "js/getPagesSource.js"
  }, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.extension.lastError) {
      alert('There was an error injecting script : \n' + chrome.extension.lastError.message);
    }
  });

}

window.onload = onWindowLoad;


