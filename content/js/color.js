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

	updateUI(rgbWithDarkness);
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

function updateUI(rgb) {
	$("#currentColorDiv").css("background-color", "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")");
	$("#sliderR").val(rgb[0]);
	$("#sliderG").val(rgb[1]);
	$("#sliderB").val(rgb[2]);
	$("#textR").val(rgb[0]);
	$("#textG").val(rgb[1]);
	$("#textB").val(rgb[2]);
	$("#currentColorHex").val(intToHex(rgb[0]) + "" + intToHex(rgb[1]) + "" + intToHex(rgb[2]));
}

function rightMarkerPositionChanged(y) {
	var data = interpretMarkerPosition(y);
	calculateSectionColor(data[0], data[1]);
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

	currentMainColor = [newR, newG, newB];
	var rgbaString = "rgba(" + newR + "," + newG + "," + newB + ",1)";

	$("#canvasLeftBase").css("background",'-moz-linear-gradient(left,  rgba(255,255,255,1) 0%, ' + rgbaString + ' 100%)');
	$("#canvasLeftBase").css("background",'-webkit-gradient(linear, left top, right top, color-stop(0%,rgba(255,255,255,1)), color-stop(100%,' + rgbaString + '))');
	$("#canvasLeftBase").css("background",'-webkit-linear-gradient(left,  rgba(255,255,255,1) 0%,' + rgbaString + ' 100%)');
	$("#canvasLeftBase").css("background",'-o-linear-gradient(left,  rgba(255,255,255,1) 0%,' + rgbaString + ' 100%)');
	$("#canvasLeftBase").css("background",'-ms-linear-gradient(left,  rgba(255,255,255,1) 0%,' + rgbaString + ' 100%)');
	$("#canvasLeftBase").css("background",'linear-gradient(to right,  rgba(255,255,255,1) 0%,' + rgbaString + ' 100%)');
}

function textboxUpdate() {
	var r = $("#textR").val();
	var g = $("#textG").val();
	var b = $("#textB").val();
	if(+r != NaN && +g != NaN && +b != NaN) {
		r = parseInt(r);
		g = parseInt(g);
		b = parseInt(b);
		if((r != prevSliderRGB[0] || g != prevSliderRGB[1] || b != prevSliderRGB[2])
			&& r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
			$("#sliderR").val(r);
			$("#sliderG").val(g);
			$("#sliderB").val(b);
			sliderUpdate();
		}
	}
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
	var calculateNewValues = calculateMiddleValue(sorted);
	var finalColor = [calculateNewValues[indexes[0]],
		calculateNewValues[indexes[1]],
		calculateNewValues[indexes[2]]];
	console.log(finalColor);
}

function sortByLargest(rgb) {
	var unsorted = [rgb[0], rgb[1], rgb[2]];
	var sorted = unsorted.slice(0).sort(sortNumber);
	var indexes = new Array(3);
	indexes[0] = unsorted.indexOf(sorted[0]);
	unsorted[indexes[0]] = -1;
	indexes[1] = unsorted.indexOf(sorted[1]);
	unsorted[indexes[1]] = -1;
	indexes[2] = unsorted.indexOf(sorted[2]);
	return [sorted, indexes];
}

function sortNumber(a,b) {
	return a - b;
}

function calculateMiddleValue(sorted) {
	var differenceMiddleLowest = sorted[1] - sorted[0];
	var differenceHighestLowest = sorted[2] - sorted[0];
	var percentage = differenceMiddleLowest / differenceHighestLowest;
	var newVal = parseInt(percentage * 255);
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