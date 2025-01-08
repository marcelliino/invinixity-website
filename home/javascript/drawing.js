function draw() {
	background(0);
	let elapsedTime = millis() / 1000.0;
	var spectrum = fft.analyze();

	gamepad.update();

	for (const button of controller.label) {
		let gc = gamepad.getButtonState(0, buttonIndexMapping[button]);
		if (!controller[button].press && gc.pressed) {
			controller[button].value = 1.0 - controller[button].value;
			controller[button].press = true;
		} else if (controller[button].press && !gc.pressed) {
			controller[button].press = false;
		}
	}

	help = controller.select.value ? true : false;

	if (gamepad.getButtonState(0, buttonIndexMapping['start']).pressed) {
		// reset freeView
		freeView.target.x = 0;
		freeView.target.y = 0;
		freeView.target.z = 0;
		// reset freeMove
		freeMove.target.x = 0;
		freeMove.target.y = 0;
		freeMove.target.z = 0;
	}

	if (!playButton && gamepad.getButtonState(0, buttonIndexMapping['y']).pressed) {
		if (sound.isLoaded() && !sound.isPlaying()) sound.loop();
		else sound.stop();
		playButton = true;
	} else if (playButton && !gamepad.getButtonState(0, buttonIndexMapping['y']).pressed) {
		playButton = false;
	}

	let ctrl = {
		LS: {
			x: gamepad.getAxisValue(0, 0),
			y: gamepad.getAxisValue(0, 1)
		},
		RS: {
			x: gamepad.getAxisValue(0, 2),
			y: gamepad.getAxisValue(0, 3)
		},
		LT: gamepad.getButtonState(0, buttonIndexMapping['lt']).value,
		RT: gamepad.getButtonState(0, buttonIndexMapping['rt']).value
	};

	let val = abs(gamepad.getButtonState(0, 6).value);
	if (val > 0) gamepad.startVibration(0, 125, 1.0 - ((1.0 - val) * (1.0 - val)), val * val * val);

	var speed = 0.8;

	if (keyIsDown(SHIFT)) {
		speed = 2.0;
	}

	speed = lerp(speed, 4.0, ctrl.LT);

	accelerate = animateData(accelerate, speed, 0.125);

	// freeView input

	let fvX = 1 - abs(ctrl.RS.y);
	fvX *= fvX;
	fvX = ctrl.RS.y >= 0 ? 1 - fvX : fvX - 1;

	// mouse or game controller mode
	freeView.target.x = mouseIsPressed ? map(mouseY, 0, height, -PI, PI) / 4.0 : fvX * PI / 4.0;
	freeView.target.z += (ctrl.RS.x * ctrl.RS.x * ctrl.RS.x) / 4.0 * accelerate / 4.0;

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
	if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
		freeMove.target.x += accelerate * cos(-freeView.target.z);
		freeMove.target.y += accelerate * sin(-freeView.target.z);
		tiltView.target.y = -PI / 8.0;
	}
	if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
		freeMove.target.x -= accelerate * cos(-freeView.target.z);
		freeMove.target.y -= accelerate * sin(-freeView.target.z);
		tiltView.target.y = PI / 8.0;
	}
	if ((keyIsDown(65) || keyIsDown(LEFT_ARROW)) && (keyIsDown(68) || keyIsDown(RIGHT_ARROW))) tiltView.target.y = 0.0;

	if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) {
		freeMove.target.z += accelerate * map(mouseY, 0, height, 1.0, -1.0) / 1.25;
		freeMove.target.y += accelerate * cos(freeView.target.z);
		freeMove.target.x += accelerate * sin(freeView.target.z);
		tiltView.target.x = PI / 8.0;
	}
	if (keyIsDown(87) || keyIsDown(UP_ARROW)) {
		freeMove.target.z -= accelerate * map(mouseY, 0, height, 1.0, -1.0) / 1.25;
		freeMove.target.y -= accelerate * cos(freeView.target.z);
		freeMove.target.x -= accelerate * sin(freeView.target.z);
		tiltView.target.x = -PI / 8.0;
	}

	freeMove.target.z = min(max(freeMove.target.z, -16.0), 2.0);

	freeMove.current.x = animateData(freeMove.current.x, freeMove.target.x, 0.25);
	freeMove.current.y = animateData(freeMove.current.y, freeMove.target.y, 0.25);
	freeMove.current.z = animateData(freeMove.current.z, freeMove.target.z, 0.25);


	// tiltView input

	// game controller mode
	if (!keyIsDown(65) && !keyIsDown(68)) tiltView.target.y = ((ctrl.LS.x * ctrl.LS.x * ctrl.LS.x) / 2.0 + ctrl.RS.x) * PI / 4.0;
	if (!keyIsDown(83) && !keyIsDown(87)) tiltView.target.x = (ctrl.LS.y / 1.25 - ctrl.RS.y) * PI / 4.0;

	tiltView.current.y = animateData(tiltView.current.y, tiltView.target.y, 0.0625);
	tiltView.current.x = animateData(tiltView.current.x, tiltView.target.x, 0.125);


	// smooth stick and trigger values

	stickVal.x = ctrl.LS.x * 0.125 + stickVal.x * 0.875;
	stickVal.y = ctrl.LS.y * 0.125 + stickVal.y * 0.875;
	stickVal.z = ctrl.RS.x * 0.125 + stickVal.z * 0.875;
	stickVal.w = ctrl.RS.y * 0.125 + stickVal.w * 0.875;

	triggVal.x = ctrl.LT * 0.125 + triggVal.x * 0.875;
	triggVal.y = ctrl.RT * 0.125 + triggVal.y * 0.875;



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
	scene.render3D.setUniform("u_trigger", [triggVal.x, triggVal.y]);
	scene.render3D.setUniform("u_tiltView", [tiltView.current.x, tiltView.current.z, tiltView.current.y]);
	scene.render3D.setUniform("u_freeView", [freeView.current.x, freeView.current.z, freeView.current.y]);
	scene.render3D.setUniform("u_freeMove", [freeMove.current.x, freeMove.current.z, freeMove.current.y]);
	scene.render3D.setUniform("u_stick", [stickVal.x, stickVal.y, stickVal.z, stickVal.w]);
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
	if (help) text(`Gnimrofarret v2.0 — Louis Marcellino
	
Keyboard / GamePad Control
ADSW + Mouse / L + R Stick : Navigate
(click and drag mouse)
SHIFT / Trigger (L2 or R2) : Speed Boost
R key / Start Button       : Reset Position
Q key / Left Bumper (L1)   : Toggle Spot Light
E key / Right Bumper (R1)   : Toggle Laser Scanner
P key / Y or △ Button      : Play / Pause Ambience Sound
H key / Select Button      : Show / Hide This Hints

This sketch uses custom dynamic scaling,
allowing the resolution to change based on
the frame rate and computer render power

FPS: ` + round(fps.current) + '\nScale: ' + round(100 * scene.pixScale) + '%', 16, 16);

noStroke();
fill(255);
textAlign(CENTER, CENTER);
textSize(min(width, height) / 32);
textWrap(WORD);
/*text(`Welcome to the realm of 'Under Construction.'
While we're busy crafting our digital empire, take a flight through this interactive cyber-wasteland. Feel the rush of exploration as we prepare to unveil our latest creation!`,
     width / 8,
     height / 16,
     width / 2,
     height);*/
text('www.invinixity.com\nis currently under reconstruction',
     width / 8,
     height / 16,
     width / 1.25,
     height);

if (dysc == true) dynamicScaling(fps.minimum, fps.maximum);

}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	scene.graphics.resizeCanvas(width * scene.pixScale, height * scene.pixScale);
}
