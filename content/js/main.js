$("#searchTextField").keypress(function(e) {
  checkKey(e);
});
$(window).mousemove(function(e){
	canvasMouseMove(e);
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