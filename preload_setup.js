function preload() {
	scene['render3D'] = loadShader('vert.glsl', 'frag.glsl');
}

function setup() {

	createCanvas(windowWidth, windowHeight);
	pixelDensity(1);
	noSmooth();

	colorMode(HSB, 360, 100, 100, 100);
	angleMode(DEGREES);

	mic = new p5.AudioIn();
	mic.amp(1.0);
	// mic.start();
	fft = new p5.FFT(0.25, 64);
	fft.setInput(mic);
	spectex = createImage(8, 8);

	scene['graphics'] = createGraphics(windowWidth * scene.pixScale, windowHeight * scene.pixScale, WEBGL);
	scene['texture0'] = loadImage('AlienSpace2K.png', loaded);
	scene['texture1'] = loadImage('AlienSpace2K_depth.png', loaded);
	
	describe('An abstract object with multi colors, made with Ray Marching technique in Fragment Shader, floating and rotating at center, reacting to audio input from microphone');
}
