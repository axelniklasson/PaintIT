window.onload = initElements;

var elementsID = new Array();
var elementsTAG = new Array();
var elementsCombined = new Array();
var id = "";

// If Chrome

function initElements() {

    chrome.tabs.executeScript(null, {file: "content/js/getElements.js"}, function() {
        // If you try and inject into an extensions page or the webstore/NTP you'll get an error
        if (chrome.extension.lastError) {
            console.log('There was an error injecting script : \n' + chrome.extension.lastError.message);
        }
    });
}

chrome.extension.onMessage.addListener(function(request, sender) {
  
  if (request.action == "getElements") {
    elements = request.source;

    $('#searchTextField').typeahead({
		  hint: true,
		  highlight: true,
		  minLength: 1
		},
		{
		  name: 'elements',
		  displayKey: 'value',
		  source: substringMatcher(elements)
		}
	);	
  }
});

var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substrRegex;
 
    // an array that will be populated with substring matches
    matches = [];
 
    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');
 
    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        // the typeahead jQuery plugin expects suggestions to a
        // JavaScript object, refer to typeahead docs for more info
        matches.push({ value: str });
      }
    });
 
    cb(matches);
  };
};