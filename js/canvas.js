var canvasLeftMouseIsDown = false;
var canvasRightMouseIsDown = false;
var leftX = 0;
var leftY = 0;
var rightY = 0;

function mouseUp() {
	canvasLeftMouseIsDown = false;
	canvasRightMouseIsDown = false;
}

function canvasMouseDown(e, left) {
	if(e.which == 1) {
		canvasLeftMouseIsDown = false;
		canvasRightMouseIsDown = false;

		if(left)
			canvasLeftMouseIsDown = true;
		else
			canvasRightMouseIsDown = true;

		updateMarkerPositions(e, left);
	}
}

function canvasMouseMove(e) {
	//e.stopPropagation();
	if(canvasLeftMouseIsDown || canvasRightMouseIsDown)
		updateMarkerPositions(e);
}

function updateMarkerPositions(e) {
	if(canvasLeftMouseIsDown) {
		leftX = getRelativeX(e, $("#canvasLeftMarker"));
		leftY = getRelativeY(e, $("#canvasLeftMarker"));
	} else
		rightY = getRelativeY(e, $("#canvasRightMarker"));

	if(canvasLeftMouseIsDown) {
		var markerWidthHalf = $("#canvasLeftMarker").width()/2;
		var wrapperWidth = $("#canvasLeftBase").width();

		if(leftX < -markerWidthHalf)
			$("#canvasLeftMarker").css("left", -markerWidthHalf);
		else if(leftX >= wrapperWidth - markerWidthHalf)
			$("#canvasLeftMarker").css("left", wrapperWidth - markerWidthHalf);
		else
			$("#canvasLeftMarker").css("left", leftX);
	}

	if(canvasLeftMouseIsDown) {
		var markerHeightHalf = $("#canvasLeftMarker").height()/2;
		var wrapperHeight = $("#canvasLeftBase").height();

		if(leftY < -markerHeightHalf)
			$("#canvasLeftMarker").css("top", -markerHeightHalf);
		else if(leftY >= wrapperHeight - markerHeightHalf)
			$("#canvasLeftMarker").css("top", wrapperHeight - markerHeightHalf);	
		else
			$("#canvasLeftMarker").css("top", leftY);
	}

	if(canvasRightMouseIsDown) {
		var markerHeightHalf = $("#canvasRightMarker").height()/2;
		var wrapperHeight = $("#canvasRight").height();

		if(rightY < -markerHeightHalf)
			$("#canvasRightMarker").css("top", -markerHeightHalf);
		else if(rightY >= wrapperHeight - markerHeightHalf)
			$("#canvasRightMarker").css("top", wrapperHeight - markerHeightHalf);
		else
			$("#canvasRightMarker").css("top", rightY);	
	}
}

function getRelativeX(e, element) {
	return e.clientX - $("#canvasWrapper").offset().left
		- element.width()/2;
}

function getRelativeY(e, element) {
	//When running chrome extension the offsetTop seems to be incorrect. Hence
	//the magic constant.
	var k = 29;
	return e.clientY - $("#canvasWrapper").offset().top
		- element.height()/2 - k;
}