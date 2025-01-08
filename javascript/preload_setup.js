function preload() {
	scene['render3D'] = loadShader('shader/vert.glsl', 'shader/frag.glsl');
}

function setup() {
	
	scene['hdri'] = loadImage('image/DiExposureSky4K.jpg', loaded);
	scene['texture0'] = loadImage('image/coast_land_rocks_01_cnd_4k.png', loaded);
	scene['texture1'] = loadImage('image/rocky_trail_02_cnd_4k.png', loaded);
	sound = loadSound('sound/a-gentle-breeze-wind-4-14681.mp3', loaded);
	soundFX = loadSound('sound/Gnimrofarret SoundFX.m4a', loaded);

	createCanvas(windowWidth, windowHeight);
	if (pixelDensity() > 1) {
		scene.pixScale = 0.125;
		dysc = false;
	}
	pixelDensity(1);
	noSmooth();
	textFont('Courier New');

//	noCursor();

	angleMode(RADIANS);

	mic = new p5.AudioIn();
	mic.amp(1.0);
	// mic.start();
	fft = new p5.FFT(0.25, 64);
	fft.setInput(sound);
	spectex = createImage(8, 8);

	scene['graphics'] = createGraphics(width * scene.pixScale, height * scene.pixScale, WEBGL);
	
	gamepad = new GamePad();

	for (const button of controller.label) {
		controller[button] = {
			value: 0,
			press: false
		};
	}

	controller.l.value = 1.0;
	controller.r.value = 1.0;
	controller.select.value = help ? 1.0 : 0.0;
	controller.b.value = sound.isPlaying() ? 1.0 : 0.0;
	
	console.clear();
}
