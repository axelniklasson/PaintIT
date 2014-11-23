// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: var serialized_html = DOMtoString(document);

function getElements(document_root) {
    var arr = document_root.getElementsByTagName("*");
    var final_arr = new Array();
    
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].id != "") {
            final_arr.push(arr[i].id + " [" + arr[i].tagName + "]");
        }
    }
    
    return final_arr;
}

chrome.extension.sendMessage({
    action: "getElements",
    source: getElements(document)
});