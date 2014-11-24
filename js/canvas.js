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
		leftX = getRelativeX(e, $("#canvasLeftMarker"), $("#canvasLeftBase"));
		leftY = getRelativeY(e, $("#canvasLeftMarker"), $("#canvasLeftBase"));
	} else
		rightY = getRelativeY(e, $("#canvasRightMarker"), $("#canvasRight"));

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

function getRelativeX(e, element, canvas) {
	return e.clientX - $("#canvasWrapper").offset().left 
		- parseInt($(canvas).css("border-left-width"))
		- element.width()/2;
}

function getRelativeY(e, element, canvas) {
	return e.clientY - $("#canvasLeftBase").offset().top
		- parseInt($(canvas).css("border-top-width"))
		- element.height()/2;
}