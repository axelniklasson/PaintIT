function updateFont() {
	var selector = document.getElementById("fontSelector");
	var text = document.getElementById("preview");
	var value = selector.options[selector.selectedIndex].text;

	switch (value) {
		case "Droid Sans":
			text.style.fontFamily = "Droid Sans";
			break;

		case "Lato":
			text.style.fontFamily = "Lato";
			break;

		case "Open Sans":
			text.style.fontFamily = "Open Sans";
			break;

		case "Open Sans Condensed":
			text.style.fontFamily = "Open Sans Condensed";
			break;

		case "Oswald":
			text.style.fontFamily = "Oswald";
			break;

		case "Raleway":
			text.style.fontFamily = "Roboto";
			break;

		case "Roboto":
			text.style.fontFamily = "Roboto";
			break;

		case "Roboto Condensed":
			text.style.fontFamily = "Roboto Condensed";
			break;

		case "PT Sans":
			text.style.fontFamily = "PT Sans";
			break;

		case "Source Sans Pro":
			text.style.fontFamily = "Source Sans Pro";
			break;
	}

}