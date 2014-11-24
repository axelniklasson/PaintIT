var elementsID = new Array();
var elementsTAG = new Array();
var elementsCombined = new Array();
var id = "";

function elementSelected(event) {
  var el = document.getElementById("searchTextField");
  var label = document.getElementById("selectedItemParagraph");
  label.innerHTML = el.value;
}

function checkKey(event) {
  var key = event.keyCode;
  
  if (key == 13) { // Enter
    elementSelected();
  }
  return true;
}

function findElements() {
  chrome.tabs.executeScript(null, {
    file: "js/getElements.js"
      }, function() {
      // If you try and inject into an extensions page or the webstore/NTP you'll get an error
      if (chrome.extension.lastError) {
          alert('There was an error injecting script : \n' + chrome.extension.lastError.message);
      }
  });
}