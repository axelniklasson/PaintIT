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