var canvasLeftMouseIsDown = false;
var canvasRightMouseIsDown = false;

var sliderDown = false;

var leftMarker = $("#canvasLeftMarker");
var rightMarker = $("#canvasRightMarker");
var leftCanvas = $("#canvasLeftBase");
var rightCanvas = $("#canvasRight");

function mouseUp() {
	canvasLeftMouseIsDown = false;
	canvasRightMouseIsDown = false;
	if(sliderDown) {
		sliderUpdate();
		sliderDown = false;
	}
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

function sliderMouseDown() {
	sliderDown = true;
	sliderUpdate();
}

function mouseMove(e) {
	if(canvasLeftMouseIsDown || canvasRightMouseIsDown)
		updateMarkerPositions(e);
	else if(sliderDown)
		sliderUpdate();
}

function updateMarkerPositions(e) {
	var leftX, leftY, rightY;

	if(canvasLeftMouseIsDown) {
		leftX = getElementRelativeX(e, leftMarker, leftCanvas);
		leftY = getElementRelativeY(e, leftMarker, leftCanvas);
	} else
		rightY = getElementRelativeY(e, rightMarker, rightCanvas);

	if(canvasLeftMouseIsDown) {
		var markerWidthHalf = leftMarker.width()/2;
		var wrapperWidth = leftCanvas.width();

		if(leftX < -markerWidthHalf)
			leftX = -markerWidthHalf;
			//leftMarker.css("left", -markerWidthHalf);
		else if(leftX >= wrapperWidth - markerWidthHalf)
			leftX = wrapperWidth - markerWidthHalf;
			//leftMarker.css("left", wrapperWidth - markerWidthHalf);
		/*else
			leftX 
			leftMarker.css("left", leftX);*/
	}

	if(canvasLeftMouseIsDown) {
		var markerHeightHalf = leftMarker.height()/2;
		var wrapperHeight = leftCanvas.height();

		if(leftY < -markerHeightHalf)
			leftY = -markerHeightHalf;
			//leftMarker.css("top", -markerHeightHalf);
		else if(leftY >= wrapperHeight - markerHeightHalf)
			leftY = wrapperHeight - markerHeightHalf;
			//leftMarker.css("top", wrapperHeight - markerHeightHalf);	
		/*else
			leftMarker.css("top", leftY);*/
	}

	if(canvasRightMouseIsDown) {
		var markerHeightHalf = rightMarker.height()/2;
		var wrapperHeight = rightCanvas.height();

		if(rightY < -markerHeightHalf)
			rightY = -markerHeightHalf;
			//rightMarker.css("top", -markerHeightHalf);
		else if(rightY >= wrapperHeight - markerHeightHalf)
			rightY = wrapperHeight - markerHeightHalf;
			//rightMarker.css("top", wrapperHeight - markerHeightHalf);
		/*else
			rightMarker.css("top", rightY);*/
	}
	
	if(leftX != undefined && leftY != undefined &&
			(parseInt(leftMarker.css("left")) != leftX ||
			parseInt(leftMarker.css("top")) != leftY)) {
		leftMarker.css("left", leftX);
		leftMarker.css("top", leftY);
		leftMarkerPositionChanged(leftX + leftMarker.width()/2, 
			leftY + leftMarker.height()/2);
	}
	if(rightY != undefined && 
			parseInt(rightMarker.css("top")) != rightY) {
		rightMarker.css("top", rightY);
		rightMarkerPositionChanged(rightY + rightMarker.height()/2);
	}
}

function getElementRelativeX(e, element, canvas) {
	return e.clientX - $("#canvasWrapper").offset().left 
		- parseInt($(canvas).css("border-left-width"))
		- element.width()/2;
}

function getElementRelativeY(e, element, canvas) {
	return e.clientY - leftCanvas.offset().top
		- parseInt($(canvas).css("border-top-width"))
		- element.height()/2;
}