var visible = true;

function toggleVisibility(e) {
	if(e.keyCode == 18) {
		if(visible) {
	  		$("#mainWrapper").css("display", "none");
			$("html").css("height", $("#minimizedWrapper").height());
			$("body").css("height", $("#minimizedWrapper").height());
			visible = false;
	  	} else {
	  		$("#mainWrapper").css("display", "block");
	  		visible = true;
	  	}
	}
}