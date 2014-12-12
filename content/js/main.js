window.onload = findElements;
$("#searchTextField").keypress(function(e) {
  checkKey(e);
});
$(window).mousemove(function(e){
	mouseMove(e);
});
$(window).mouseup(function(e) {
  mouseUp();
});
$("#canvasLeftBase").mousedown(function(e) {
  canvasMouseDown(e, true);
});
$("#canvasRight").mousedown(function(e) {
  canvasMouseDown(e, false);
});
$("#sliderR").mousedown(function(e) {
  sliderMouseDown();
});
$("#sliderG").mousedown(function(e) {
  sliderMouseDown();
});
$("#sliderB").mousedown(function(e) {
  sliderMouseDown();
});
$(window).keydown(function(e) {
	toggleVisibility(e);	
});
$("#textR").keydown(function(e) {
	textKeyDown(e, $("#textR"));
});
$("#textG").keydown(function(e) {
  	textKeyDown(e, $("#textG"));
});
$("#textB").keydown(function(e) {
  	textKeyDown(e, $("#textB"));
});