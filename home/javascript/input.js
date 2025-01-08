function keyPressed() {

	if (key == 'f' || key == 'F') {
		let fs = fullscreen();
		fullscreen(!fs);
	}

	if (key == 'p' || key == 'P') {
		if (sound.isLoaded() && !sound.isPlaying()) sound.loop();
		else sound.stop();
	}

	if (key == 'h' || key == 'H') {
		controller.select.value = 1.0 - controller.select.value;
	}

	if (key == 'q' || key == 'Q') {
		controller.l.value = 1.0 - controller.l.value;
	}

	if (key == 'e' || key == 'E') {
		controller.r.value = 1.0 - controller.r.value;
	}

	if (key == 'r' || key == 'R') {
		// reset freeView
		freeView.target.x = 0;
		freeView.target.y = 0;
		freeView.target.z = 0;
		// reset freeMove
		freeMove.target.x = 0;
		freeMove.target.y = 0;
		freeMove.target.z = 0;
	}

	if (key == 'c' || key == 'C') {
		saveCanvas('frame_', 'png');
	}

}

function mousePressed() {
	fps.minimum = 30;
	fps.maximum = 60;
    if (soundFX.isLoaded() && !soundFX.isPlaying()) soundFX.loop();
}
