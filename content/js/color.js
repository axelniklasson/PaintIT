var currentSelectedColor = [255, 0, 0];
var currentMainColor = [255, 0, 0];

var sectionDivisors = [
	[255, 0, 0],
	[255, 0, 255],
	[0, 0, 255],
	[0, 255, 255],
	[0, 255, 0],
	[255, 255, 0],
	[255, 0, 0]
];

function leftMarkerPositionChanged(x, y) {
	
}

function rightMarkerPositionChanged(y) {
	var rightCanvasHeight = $("#canvasRight").height();

	if(y < 0)
		y = 0;
	else if(y >= rightCanvasHeight)
		y = rightCanvasHeight - 1;

	var sectionHeight = rightCanvasHeight / (sectionDivisors.length - 1);
	var currentSection = parseInt(y / sectionHeight);

	var markerPosPercentage = (y % sectionHeight) / sectionHeight;
	calculateSectionColor(currentSection, markerPosPercentage);
}

function calculateSectionColor(markerSection, markerPosPercentage) {
	var divisor1 = sectionDivisors[markerSection];
	var divisor2 = sectionDivisors[markerSection + 1]

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