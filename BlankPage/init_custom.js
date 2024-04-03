let
	numOfAssets = 4,
	mic, sound,
	fft, spectex,
	scene = {
		pixScale: 0.0625
	};

var
	help = false,
	data = {
		loading: false,
		counter: 0,
		animate: 0
	},
	fps = {
		numstep: 0,
		current: 0,
		minimum: 12,
		maximum: 30
	},
	mouseIsClicked = false,
	mX = 0,
	playButton = false,
	accelerate = 0,
	controller = {
		label: ['a', 'b', 'x', 'y', 'l', 'r', 'lt', 'rt', 'up', 'down', 'left', 'right', 'lsb', 'rsb', 'start', 'select']
	},
	freeView = {
		target: {
			x: 0.0,
			y: 4.0,
			z: 0.0
		},
		current: {
			x: 0.0,
			y: 0.0,
			z: 0.0
		},
		earlier: {
			x: 0.0,
			y: 0.0,
			z: 0.0
		}
	},
	freeMove = {
		target: {
			x: 0.0,
			y: 4.0,
			z: 0.0
		},
		current: {
			x: 0.0,
			y: 0.0,
			z: 0.0
		}
	};

function loaded() {
	data.counter += 1;
	// data.loading = data.counter >= numOfAssets ? false : true;
	if(sound.isLoaded()) sound.loop();
}

function animateData(activeValues, targetValues, smoothFactor) {
	return  activeValues * (1 - smoothFactor) + targetValues * smoothFactor;
}

function dynamicScaling(minFPS, maxFPS) {

	fps.current = animateData(fps.current, frameRate(), 0.25);

	if (fps.current < minFPS && scene.pixScale > 0.04398046511104) {
		scene.pixScale = max(scene.pixScale / 1.25, 0.04398046511104);
		scene.graphics.resizeCanvas(windowWidth * scene.pixScale, windowHeight * scene.pixScale);
		// console.log('down', fps.numstep);
	} else if (fps.current > maxFPS && scene.pixScale < 1 && frameCount % 8 == 0) {
		scene.pixScale = min(scene.pixScale / 0.8, 1);
		scene.graphics.resizeCanvas(windowWidth * scene.pixScale, windowHeight * scene.pixScale);
		// console.log('up', fps.numstep);
	} else {
		// console.log('idle');
	}

}