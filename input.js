function keyPressed() {
	if (key == 'f' || key == 'F') {
		let fs = fullscreen();
		fullscreen(!fs);
	}

	if (key == '-' || key == '_') {
		maxRayBounces = max(0, maxRayBounces - 1);
	} else if (key == '=' || key == '+') {
		maxRayBounces = min(6, maxRayBounces + 1);
	}

}

function mousePressed() {
	// fps.minimum = 30;
	// fps.maximum = 60;
}