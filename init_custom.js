let
	font,
	numOfAssets = 2,
	mic, fft, spectex,
	scene = {
		pixScale: 0.4096
	};

var
	data = {
		loading: true,
		counter: 0,
		animate: 0
	},
	fps = {
		numstep: 0,
		current: 0,
		minimum: 12,
		maximum: 30
	},
	maxRayBounces = 3;

function loaded() {
	data.counter += 1;
	data.loading = data.counter == numOfAssets ? false : true;
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

function animateData(activeValues, targetValues, smoothFactor) {
	return  activeValues * (1 - smoothFactor) + targetValues * smoothFactor;
}