function draw() {
	background(0);
	let elapsedTime = millis() / 1000.0;
	var spectrum = fft.analyze();

	for (const button of controller.label) {
		if (!controller[button].press && contro.pressing(button)) {
			controller[button].value = 1.0 - controller[button].value;
			controller[button].press = true;
		} else if (controller[button].press && !contro.pressing(button)) {
			controller[button].press = false;
		}
	}

	help = controller.select.value ? true : false;

	if (contro.pressing('start')) {
		// reset freeView
		freeView.target.x = 0;
		freeView.target.y = 0;
		freeView.target.z = 0;
		// reset freeMove
		freeMove.target.x = 0;
		freeMove.target.y = 0;
		freeMove.target.z = 0;
	}

	if (!playButton && contro.pressing('y')) {
		if (!sound.isPlaying()) sound.loop();
		else sound.stop();
		playButton = true;
	} else if (playButton && !contro.pressing('y')) {
		playButton = false;
	}

	let ctrl = {
		LS: contro.leftStick,
		RS: contro.rightStick,
		LT: contro.leftTrigger,
		RT: contro.rightTrigger
	};

	var speed = 0.5;

	if (keyIsDown(SHIFT)) {
		speed = 2.0;
	}

	speed = lerp(speed, 2.0, max(ctrl.LT, ctrl.RT));

	accelerate = animateData(accelerate, speed, 0.125);

	// freeView input

	// mouse or game controller mode
	freeView.target.x = mouseIsPressed ? map(mouseY, 0, height, -PI, PI) / 4.0 : ctrl.RS.y * PI / 8.0;
	freeView.target.z += ctrl.RS.x / 4.0 * accelerate / 4.0;

	if (mouseIsPressed) {
		if (!mouseIsClicked) {
			freeView.earlier.z = freeView.target.z;
			mX = mouseX;
			mouseIsClicked = true;
		}
		freeView.target.z = freeView.earlier.z + (mouseX - mX) / width * PI;
	} else {
		if (mouseIsClicked) {
			mouseIsClicked = false;
		}
	}

	freeView.current.x = animateData(freeView.current.x, freeView.target.x, 0.25);
	freeView.current.z = animateData(freeView.current.z, freeView.target.z, 0.25);


	// freeMove input

	// game controller mode
	freeMove.target.z += accelerate * ctrl.LS.y * -freeView.current.x / 1.25;
	freeMove.target.y += accelerate * ctrl.LS.y * cos(freeView.target.z) - ctrl.LS.x * sin(-freeView.target.z);
	freeMove.target.x += accelerate * ctrl.LS.y * sin(freeView.target.z) - ctrl.LS.x * cos(-freeView.target.z);

	// keyboard mode
	if (keyIsDown(65)) {
		freeMove.target.x += accelerate * cos(-freeView.target.z);
		freeMove.target.y += accelerate * sin(-freeView.target.z);
	} else if (keyIsDown(68)) {
		freeMove.target.x -= accelerate * cos(-freeView.target.z);
		freeMove.target.y -= accelerate * sin(-freeView.target.z);
	}

	if (keyIsDown(83)) {
		freeMove.target.z += accelerate * map(mouseY, 0, height, 1.0, -1.0) / 1.25;
		freeMove.target.y += accelerate * cos(freeView.target.z);
		freeMove.target.x += accelerate * sin(freeView.target.z);
	} else if (keyIsDown(87)) {
		freeMove.target.z -= accelerate * map(mouseY, 0, height, 1.0, -1.0) / 1.25;
		freeMove.target.y -= accelerate * cos(freeView.target.z);
		freeMove.target.x -= accelerate * sin(freeView.target.z);
	}

	freeMove.target.z = min(max(freeMove.target.z, -16.0), 2.0);

	freeMove.current.x = animateData(freeMove.current.x, freeMove.target.x, 0.25);
	freeMove.current.y = animateData(freeMove.current.y, freeMove.target.y, 0.25);
	freeMove.current.z = animateData(freeMove.current.z, freeMove.target.z, 0.25);


	// spectrum texture
	spectex.loadPixels();
	for (let i = 0; i < 64 * 4; i += 4) {
		let v = spectrum[i / 4] / 2;
		spectex.pixels[i] = v;
		spectex.pixels[i + 1] = v;
		spectex.pixels[i + 2] = v;
		spectex.pixels[i + 3] = 255;
	}
	spectex.updatePixels();
	scene.render3D.setUniform("spectrum", spectex);

	scene.render3D.setUniform("u_time", elapsedTime);
	scene.render3D.setUniform("u_resolution", [scene.graphics.width, scene.graphics.height]);
	scene.render3D.setUniform("u_mouse", [map(mouseX, 0, width, 0, 1), map(mouseY, 0, height, 1, 0)]);
	scene.render3D.setUniform("u_toggle", [controller.l.value, controller.r.value]);
	scene.render3D.setUniform("u_freeView", [freeView.current.x, freeView.current.z, freeView.current.y]);
	scene.render3D.setUniform("u_freeMove", [freeMove.current.x, freeMove.current.z, freeMove.current.y]);
	scene.render3D.setUniform("u_clock", [hour(), minute(), second()]);
	scene.render3D.setUniform("hdri", scene.hdri);
	scene.render3D.setUniform("texture0", scene.texture0);
	scene.render3D.setUniform("texture1", scene.texture1);
	scene.graphics.shader(scene.render3D);
	scene.graphics.rect(0, 0, scene.graphics.width, scene.graphics.height);

	image(scene.graphics, 0, 0, width, height);

	if (data.loading) {
		push();
		translate(width / 2, height / 2);

		data.animate = animateData(data.animate, data.counter / numOfAssets, 0.125);

		rectMode(CENTER);
		strokeWeight(16);
		stroke(25);
		fill(25);
		rect(0, 0, width / 2, min(width, height) / 8, 16);
		noStroke();
		fill(55);
		rect(width / 4 * data.animate - width / 4, 0, width / 2 * data.animate, min(width, height) / 8, 16);

		fill(255, 125 + 130 * (sin(millis() / 250) / 2.0 + 0.5));
		textSize(min(width, height) / 16);
		textAlign(CENTER, CENTER);
		text('Loading', 0, 0);
		pop();

	}

	strokeJoin(ROUND);
	strokeWeight(min(width, height) / 128);
	stroke(25);
	fill(225);
	textAlign(LEFT, TOP);
	textSize(min(width, height) / 48);
	if (help) text(`Keyboard / GamePad Control
ADSW + Mouse / L + R Stick : Navigate
SHIFT / Trigger (L2 or R2) : Speed Boost
R key / Start Button       : Reset Position
Q key / Left Bumper (L1)   : Toggle Spot Light
P key / Y or △ Button      : Play / Pause Ambience Sound
H key / Select Button      : Show / Hide This Hints

This sketch uses custom dynamic scaling,
allowing the resolution to change based on
the frame rate and computer render power

FPS: ` + round(fps.current) + '\nScale: ' + round(100 * scene.pixScale) + '%', 16, 16);
	
	noStroke();
	fill(255);
	textAlign(LEFT, CENTER);
	textSize(min(width, height) / 48);
	text(`Welcome to the realm of 'Under Construction.'
While we're busy crafting our digital empire,
take a flight through this interactive cyber-wasteland.
Feel the rush of exploration as
we prepare to unveil our latest creation!`, width / 4, height /2);

	
	
	dynamicScaling(fps.minimum, fps.maximum);

}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	scene.graphics.resizeCanvas(windowWidth * scene.pixScale, windowHeight * scene.pixScale);
}