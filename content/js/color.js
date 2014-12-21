var currentSelectedColor = [255, 0, 0];
var currentMainColor = [255, 0, 0];

var leftMarkerPosition = [184, 0];

var topLeftCorner = [255, 255, 255];
var botLeftCorner = [0, 0, 0];
var botRightCorner = [0, 0, 0];

var prevSliderRGB = [255,0,0];

var validSyntaxForeground = "black";
var invalidSyntaxForeground = "rgb(250, 58, 58)";

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
	currentSelectedColor = [r,g,b];
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

function sliderUpdate() {
	colorUpdate($("#sliderR").val(), $("#sliderG").val(), $("#sliderB").val());
}

function colorUpdate(r,g,b) {
	if(r != prevSliderRGB[0] || g != prevSliderRGB[1] || b != prevSliderRGB[2]) {
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
		return [255, 0, 0];
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
					colorUpdate(r, g, b);
				else {
					$("#textR").css("font-weight", "normal");
					$("#textR").css("color", validSyntaxForeground);
					$("#textG").css("font-weight", "normal");
					$("#textG").css("color", validSyntaxForeground);
					$("#textB").css("font-weight", "normal");
					$("#textB").css("color", validSyntaxForeground);
				}

				prevTextR = r;
				prevTextG = g;
				prevTextB = b;				

				return;
			}
		}

		if(isNaN(r) || r < 0 || r > 255)
			$("#textR").css("color", invalidSyntaxForeground);
		if(isNaN(g) || g < 0 || g > 255)
			$("#textG").css("color", invalidSyntaxForeground);
		if(isNaN(b) || b < 0 || b > 255)
			$("#textB").css("color", invalidSyntaxForeground);

		$("#textR").css("font-weight", "normal");
		$("#textG").css("font-weight", "normal");
		$("#textB").css("font-weight", "normal");

	} else {
		element.css("color", validSyntaxForeground);
		element.css("font-weight", "bold");
	}
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

	var dr = Math.abs(s1[0] - currentMainColor[0]);
	var dg = Math.abs(s1[1] - currentMainColor[1]);
	var db = Math.abs(s1[2] - currentMainColor[2]);

	var percentR = dr / 255;
	var percentG = dg / 255;
	var percentB = db / 255;

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

	if(isFinite(percentR) && percentR != 0)
		return sections[0] * sectionHeight + percentR * sectionHeight - rightMarkerHeight / 2;
	else if(isFinite(percentG) && percentG != 0)
		return sections[0] * sectionHeight + percentG * sectionHeight - rightMarkerHeight / 2;
	else if(isFinite(percentB) && percentB != 0)
		return sections[0] * sectionHeight + percentB * sectionHeight - rightMarkerHeight / 2;
	else
		return sections[0] * sectionHeight;
}

function updateLeftMarkerPosition() {
	var canvasWidth = $("#canvasLeftBase").width();
	var canvasHeight = $("#canvasLeftBase").height();
	var markerWidth = $("#canvasLeftMarker").width();
	var markerHeight = $("#canvasLeftMarker").height();

	var highestIndex = -1;
	var lowestIndex = -1;

	if(currentMainColor[0] == 255)
		highestIndex = 0;
	else if(currentMainColor[1] == 255)
		highestIndex = 1;
	else
		highestIndex = 2;

	if(currentMainColor[0] == 0)
		lowestIndex = 0;
	else if(currentMainColor[1] == 0)
		lowestIndex = 1;
	else
		lowestIndex = 2;

	var selectedLowest = currentSelectedColor[lowestIndex]
	var selectedHighest = currentSelectedColor[highestIndex]

	var xPercent = 1 - selectedLowest / selectedHighest;
	var yPercent = (255 - selectedHighest) / 255;

	var x = xPercent * canvasWidth - markerWidth / 2;
	var y = yPercent * canvasHeight - markerHeight / 2;

	$("#canvasLeftMarker").css("left", x + "px");
	$("#canvasLeftMarker").css("top", y + "px");
}

function currentColorHexKeyDown(e) {
	var hexTextBox = $("#currentColorHex");

	if(e.keyCode == 13) {
		if(validHexData(hexTextBox.val())) {
			hexTextBox.css("color", validSyntaxForeground);
			hexTextBox.css("font-weight", "normal");
			var color = generateColorFromHex(hexTextBox.val());
			colorUpdate(color[0], color[1], color[2]);
		} else {
			hexTextBox.css("color", invalidSyntaxForeground);
			hexTextBox.css("font-weight", "normal");
		}
	} else {
		hexTextBox.css("color", validSyntaxForeground);
		hexTextBox.css("font-weight", "bold");
	}
}

function validHexData(data) {
	if(data.length == 6) {
		for(var i = 0; i < 6; i++) {
			if(!charIsHexValid(data.substring(i,i+1)))
				return false;
		}
		return true;
	}
	return false;
}

function generateColorFromHex(data) {
	return [hexToInt(data.substring(0,2).toUpperCase()), 
			hexToInt(data.substring(2,4).toUpperCase()), 
			hexToInt(data.substring(4,6).toUpperCase())];
}

function charIsNumerical(c) {
	return /[0-9]/.test(c);
}

function charIsHexValid(c) {
	return /[a-fA-F0-9]/.test(c);
}