let
	numOfAssets = 5,
	mic, sound, soundFX,
	fft, spectex,
	gamepad
scene = {
	pixScale: 0.0625
};

const buttonIndexMapping = {
	a: 0,
	b: 1,
	x: 2,
	y: 3,
	l: 4,
	r: 5,
	lt: 6,
	rt: 7,
	select: 8,
	start: 9,
	lsb: 10,
	rsb: 11,
	up: 12,
	down: 13,
	left: 14,
	right: 15
};

var
	dysc = true,
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
	tiltView = {
		target: {
			x: 0.0,
			y: 0.0,
			z: 0.0
		},
		current: {
			x: 0.0,
			y: 0.0,
			z: 0.0
		}
	},
	freeView = {
		target: {
			x: 0.0,
			y: 0.0,
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
			y: 0.0,
			z: 0.0
		},
		current: {
			x: 0.0,
			y: 0.0,
			z: 0.0
		}
	},
	stickVal = {
		x: 0.0,
		y: 0.0,
		z: 0.0,
		w: 0.0
	},
	triggVal = {
		x: 0.0,
		y: 0.0
	};

function loaded() {
	data.counter += 1;
	// data.loading = data.counter >= numOfAssets ? false : true;
//	if (soundFX.isLoaded() && !soundFX.isPlaying()) soundFX.loop();
}

function animateData(activeValues, targetValues, smoothFactor) {
    return activeValues * (1 - smoothFactor) + targetValues * smoothFactor;
}

function dynamicScaling(minFPS, maxFPS) {
    const lowerThreshold = minFPS - 5; // Lower buffer to prevent oscillation
    const upperThreshold = maxFPS + 5; // Upper buffer to prevent oscillation

    fps.current = animateData(fps.current, frameRate(), 0.25);

    if (fps.current < lowerThreshold && scene.pixScale > 0.04398046511104) {
        scene.pixScale = max(scene.pixScale / 1.25, 0.04398046511104);
        scene.graphics.resizeCanvas(width * scene.pixScale, height * scene.pixScale);
        // console.log('down', fps.numstep);
    } else if (fps.current > upperThreshold && scene.pixScale < 1 && frameCount % 8 == 0) {
        scene.pixScale = min(scene.pixScale / 0.8, 1);
        scene.graphics.resizeCanvas(width * scene.pixScale, height * scene.pixScale);
        // console.log('up', fps.numstep);
    } else {
        // console.log('idle');
    }
}

