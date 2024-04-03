function preload() {
	scene['render3D'] = loadShader('vert.glsl', 'frag.glsl');
}

function setup() {

	scene['hdri'] = loadImage('DiExposureSky4K.jpg', loaded);
	scene['texture0'] = loadImage('coast_land_rocks_01_cnd_4k.png', loaded);
	scene['texture1'] = loadImage('rocky_trail_02_cnd_4k.png', loaded);
	sound = loadSound('a-gentle-breeze-wind-4-14681.mp3', loaded);

	createCanvas(windowWidth, windowHeight);
	pixelDensity(1);
	noSmooth();
	textFont('Courier New');

	angleMode(RADIANS);

	mic = new p5.AudioIn();
	mic.amp(1.0);
	// mic.start();
	fft = new p5.FFT(0.25, 64);
	fft.setInput(sound);
	spectex = createImage(8, 8);

	scene['graphics'] = createGraphics(windowWidth * scene.pixScale, windowHeight * scene.pixScale, WEBGL);

	for (const button of controller.label) {
		controller[button] = {
			value: 0,
			press: false
		};
	}

	controller.l.value = 1.0;
	controller.select.value = help ? 1.0 : 0.0;
	controller.b.value = sound.isPlaying() ? 1.0 : 0.0;
	
	console.clear();
}