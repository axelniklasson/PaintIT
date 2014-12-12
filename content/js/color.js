var currentSelectedColor = [255, 0, 0];
var currentMainColor = [255, 0, 0];

var leftMarkerPosition = [184, 0];

var topLeftCorner = [255, 255, 255];
var botLeftCorner = [0, 0, 0];
var botRightCorner = [0, 0, 0];

var prevSliderRGB = [255,0,0];

var sectionDivisors = [
	[255, 0, 0],
	[255, 0, 255],
	[0, 0, 255],
	[0, 255, 255],
	[0, 255, 0],
	[255, 255, 0],
	[255, 0, 0]
];

var hexTable = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];

function leftMarkerPositionChanged(x, y) {
	var leftCanvasWidth = $("#canvasLeftBase").width();
	var leftCanvasHeight = $("#canvasLeftBase").height();

	var percentageX = x / leftCanvasWidth;
	var percentageY = y / leftCanvasHeight;

	var drgb = calculateDifferenceToWhite(percentageX);
	var rgbWithDarkness = [
			parseInt(drgb[0] * (1 - percentageY)),
			parseInt(drgb[1] * (1 - percentageY)),
			parseInt(drgb[2] * (1 - percentageY))];

	currentSelectedColor = rgbWithDarkness;
	leftMarkerPosition = [x, y];

	updateUI(rgbWithDarkness[0], rgbWithDarkness[1], rgbWithDarkness[2]);
}

function calculateDifferenceToWhite(percentageX) {
	var dr = parseInt(255 - currentMainColor[0]);
	var dg = parseInt(255 - currentMainColor[1]);
	var db = parseInt(255 - currentMainColor[2]);

	var r = 255 - dr * percentageX;
	var g = 255 - dg * percentageX;
	var b = 255 - db * percentageX;

	return [parseInt(r), parseInt(g), parseInt(b)];
}

function updateUI(r, g, b) {
	$("#currentColorDiv").css("background-color", "rgb(" + r + "," + g + "," + b + ")");
	$("#sliderR").val(r);
	$("#sliderG").val(g);
	$("#sliderB").val(b);
	$("#textR").val(r);
	$("#textG").val(g);
	$("#textB").val(b);
	$("#textR").css("font-weight", "normal");
	$("#textR").css("border-color", "rgb(238, 238, 238)");
	$("#textG").css("font-weight", "normal");
	$("#textG").css("border-color", "rgb(238, 238, 238)");
	$("#textB").css("font-weight", "normal");
	$("#textB").css("border-color", "rgb(238, 238, 238)");
	$("#currentColorHex").val(intToHex(r) + "" + intToHex(g) + "" + intToHex(b));
}

function rightMarkerPositionChanged(y) {
	var data = interpretMarkerPosition(y);
	var newRGB = calculateSectionColor(data[0], data[1]);
	paintSectionColor(newRGB[0], newRGB[1], newRGB[2]);
	leftMarkerPositionChanged(leftMarkerPosition[0], leftMarkerPosition[1]);
}

function interpretMarkerPosition(y) {
	var rightCanvasHeight = $("#canvasRight").height();

	if(y < 0)
		y = 0;
	else if(y > rightCanvasHeight)
		y = rightCanvasHeight;

	var sectionHeight = rightCanvasHeight / (sectionDivisors.length - 1);
	var currentSection = parseInt(y / sectionHeight);

	var markerPosPercentage = (y % sectionHeight) / sectionHeight;

	return [currentSection, markerPosPercentage];
}

function calculateSectionColor(markerSection, markerPosPercentage) {
	var divisor1 = sectionDivisors[markerSection];
	var divisor2;

	if(markerSection == sectionDivisors.length - 1)
		divisor2 = sectionDivisors[markerSection];
	else
	 	divisor2 = sectionDivisors[markerSection + 1]

	var dr = (divisor2[0] - divisor1[0]) * markerPosPercentage;
	var dg = (divisor2[1] - divisor1[1]) * markerPosPercentage;
	var db = (divisor2[2] - divisor1[2]) * markerPosPercentage;

	var newR, newG, newB;

	newR = (divisor1[0] + dr).toFixed();
	newG = (divisor1[1] + dg).toFixed();
	newB = (divisor1[2] + db).toFixed();

	return [newR, newG, newB];
}

function paintSectionColor(r, g, b) {
	currentMainColor = [r, g, b];
	var rgbaString = "rgba(" + r + "," + g + "," + b + ",1)";

	$("#canvasLeftBase").css("background",'-moz-linear-gradient(left,  rgba(255,255,255,1) 0%, ' + rgbaString + ' 100%)');
	$("#canvasLeftBase").css("background",'-webkit-gradient(linear, left top, right top, color-stop(0%,rgba(255,255,255,1)), color-stop(100%,' + rgbaString + '))');
	$("#canvasLeftBase").css("background",'-webkit-linear-gradient(left,  rgba(255,255,255,1) 0%,' + rgbaString + ' 100%)');
	$("#canvasLeftBase").css("background",'-o-linear-gradient(left,  rgba(255,255,255,1) 0%,' + rgbaString + ' 100%)');
	$("#canvasLeftBase").css("background",'-ms-linear-gradient(left,  rgba(255,255,255,1) 0%,' + rgbaString + ' 100%)');
	$("#canvasLeftBase").css("background",'linear-gradient(to right,  rgba(255,255,255,1) 0%,' + rgbaString + ' 100%)');
}

function textboxUpdate(r, g, b) {
	$("#sliderR").val(r);
	$("#sliderG").val(g);
	$("#sliderB").val(b);
	sliderUpdate();
}

function sliderUpdate() {
	var r = $("#sliderR").val();
	var g = $("#sliderG").val();
	var b = $("#sliderB").val();
	if(r != prevSliderRGB[0] || g != prevSliderRGB[1] || b != prevSliderRGB[2]) {
		$("#textR").val(r);
		$("#textG").val(g);
		$("#textB").val(b);

		prevSliderRGB = [r, g, b];
		changeColorBasedOnSlider();
	}
}

function changeColorBasedOnSlider() {
	var result = sortByLargest(prevSliderRGB)
	var sorted = result[0];
	var indexes = result[1];
	var newValues = calculateMiddleValue(sorted);
	var finalColor = [newValues[indexes[0]],
		newValues[indexes[1]],
		newValues[indexes[2]]];

	paintSectionColor(finalColor[0], finalColor[1], finalColor[2]);
	updateUI(prevSliderRGB[0], prevSliderRGB[1], prevSliderRGB[2]);
	updateRightMarkerPosition();
	updateLeftMarkerPosition();
}

function sortByLargest(rgb) {
	var unsorted = [rgb[0], rgb[1], rgb[2]];
	var sorted = unsorted.slice(0).sort(sortNumber);
	var sortedCopy = [sorted[0], sorted[1], sorted[2]];
	var indexes = new Array(3);
	indexes[0] = sortedCopy.indexOf(unsorted[0]);
	sortedCopy[indexes[0]] = -1;
	indexes[1] = sortedCopy.indexOf(unsorted[1]);
	sortedCopy[indexes[1]] = -1;
	indexes[2] = sortedCopy.indexOf(unsorted[2]);
	return [sorted, indexes];
}

function sortNumber(a,b) {
	return a - b;
}

function calculateMiddleValue(sorted) {
	var differenceMiddleLowest = sorted[1] - sorted[0];
	var differenceHighestLowest = sorted[2] - sorted[0];
	var percentage = differenceMiddleLowest / differenceHighestLowest;
	var newVal = Math.round(percentage * 255);
	if(isNaN(newVal))
		return [0, 0, 255];
	else
		return [0, newVal, 255];
}

function intToHex(i) {
	var largest = hexTable[parseInt(i/16)];
	var smallest = hexTable[parseInt(i%16)];
	return largest + "" + smallest;
}

function hexToInt(hex){
	var largest = hexTable.indexOf(hex.substring(0,1));
	var smallest = hexTable.indexOf(hex.substring(1,2));
	return parseInt(16 * largest) + parseInt(smallest);
}

function textKeyDown(e, element) {
	var success = "black";
	var fail = "rgb(250, 58, 58)";
	if(e.keyCode == 13) {
		var r = "" + $("#textR").val();
		var g = "" + $("#textG").val();
		var b = "" + $("#textB").val();

		r = +r;
		g = +g;
		b = +b;

		if(!isNaN(r) && !isNaN(g) && !isNaN(b)) {
			r = parseInt(r);
			g = parseInt(g);
			b = parseInt(b);
			if(r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
				if(r != prevSliderRGB[0] || g != prevSliderRGB[1] || b != prevSliderRGB[2])
					textboxUpdate(r, g, b);
				else {
					$("#textR").css("font-weight", "normal");
					$("#textR").css("color", success);
					$("#textG").css("font-weight", "normal");
					$("#textG").css("color", success);
					$("#textB").css("font-weight", "normal");
					$("#textB").css("color", success);
				}
				return;
			}
		}

		if(isNaN(r) || r < 0 || r > 255)
			$("#textR").css("color", fail);
		if(isNaN(g) || g < 0 || g > 255)
			$("#textG").css("color", fail);
		if(isNaN(b) || b < 0 || b > 255)
			$("#textB").css("color", fail);

		$("#textR").css("font-weight", "normal");
		$("#textG").css("font-weight", "normal");
		$("#textB").css("font-weight", "normal");

	} else {
		element.css("color", success)
		element.css("font-weight", "bold");
	}
}

function updateLeftMarkerPosition() {

}

function updateRightMarkerPosition() {
	var sections = calculateSectionIndexes();
	var y = calculateYBasedOnSectionIndexes(sections);
	$("#canvasRightMarker").css("top", y + "px");
}

function calculateSectionIndexes() {
	for(var i = 0; i < sectionDivisors.length - 1; i++) {
		var s1 = sectionDivisors[i];
		var s2 = sectionDivisors[i + 1];
		var rgb = currentMainColor;
		if(isBetween(s1[0], rgb[0], s2[0])
				&& isBetween(s1[1], rgb[1], s2[1])
				&& isBetween(s1[2], rgb[2], s2[2]))
			return [i, i+1];
	}
	return [0, 0];
}

function isBetween(a, b, c) {
	if(c > a)
		return (b >= a && b <= c);
	else
		return (b >= c && b <= a);
}

function calculateYBasedOnSectionIndexes(sections) {
	var s1 = sectionDivisors[sections[0]];
	var s2 = sectionDivisors[sections[1]];

	var dr = Math.abs(s1[0] - s2[0]);
	var dg = Math.abs(s1[1] - s2[1]);
	var db = Math.abs(s1[2] - s2[2]);

	var percentR = currentMainColor[0] / dr;
	var percentG = currentMainColor[1] / dg;
	var percentB = currentMainColor[2] / db;

	var rightCanvasHeight = $("#canvasRight").height();
	var sectionHeight = rightCanvasHeight / (sectionDivisors.length - 1);

	var rightMarkerHeight = $("#canvasRightMarker").height();

	if(currentMainColor[0] == s1[0] &&
			currentMainColor[1] == s1[1] &&
			currentMainColor[2] == s1[2])
		return sections[0] * sectionHeight - rightMarkerHeight / 2;
	else if(currentMainColor[0] == s2[0] &&
			currentMainColor[1] == s2[1] &&
			currentMainColor[2] == s2[2])
		return sections[1] * sectionHeight - rightMarkerHeight / 2;

	if(isFinite(percentR))
		return sections[0] * sectionHeight + percentR * sectionHeight - rightMarkerHeight / 2;
	else if(isFinite(percentG))
		return sections[0] * sectionHeight + percentG * sectionHeight - rightMarkerHeight / 2;
	else if(isFinite(percentB))
		return sections[0] * sectionHeight + percentB * sectionHeight - rightMarkerHeight / 2;
	else
		return sections[0] * sectionHeight;
}