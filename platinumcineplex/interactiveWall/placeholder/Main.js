function preload() {
	asset.graphic.file.data['FresteaLogoShadow'] = loadImage('FresteaLogoShadow.png');
	asset.graphic.file.data['FresteaLogo'] = loadImage('FresteaLogo.png');
	asset['font'] = loadFont('LilitaOne-Regular.ttf');

	asset.graphic.file.data['Apple2'] = loadImage('Apple.png');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	smooth();

	angleMode(RADIANS);
	rectMode(CENTER);
	imageMode(CENTER);
	strokeJoin(ROUND);

	timer = new Timer(15);

	loading.totalFile = asset.graphic.file.name.length + asset.audio.file.name.length;

	// loading all graphics
	for (let i = 0; i < asset.graphic.file.name.length; i++) {
		let name = asset.graphic.file.name[i];
		asset.graphic.file.data[name] = loadImage(name + '.png', loading.counter.add);
		asset.graphic.file.prop[name] = {
			position: {
				target: createVector(0, 0),
				follow: createVector(0, 0)
			},
			size: {
				target: 1,
				follow: 1
			},
			opacity: {
				target: 0,
				follow: 0
			}
		};
		if (name == 'Apple' || name == 'Honey' || name == 'Jasmine') {
			element[name] = new Entity(asset.graphic.file.data[name],
				name == 'Apple' ? [1, 6, 8] : name == 'Honey' ? [2, 4, 9] : [3, 5, 7]);
			collector[name] = new Accumulator(asset.graphic.file.data[name + 'Bottle'], asset.graphic.file.data[name + 'BottleShadow'],
				name == 'Apple' ? createVector(width / 6 * 1, height / 0.625) :
				name == 'Honey' ? createVector(width / 6 * 3, height / 0.625) : createVector(width / 6 * 5, height / 0.625));
		}
	}

	element.Apple.img = asset.graphic.file.data.Apple2;

	var n = 1;
	for (var key in element) {

		for (let n = 1; n <= 5; n++) {
			collector[key].imgSteps.push(asset.graphic.file.data['Bottle' + n]);
		}

		asset.graphic.file.prop[key + 'Bottle'] = {
			position: {
				target: createVector(width / 6 * n, height / 0.625),
				follow: createVector(width / 6 * n, height / 0.625)
			},
			size: {
				target: width / 4,
				follow: width / 4
			},
			opacity: {
				target: 0,
				follow: 0
			}
		};

		n += 2;

	}

	asset.graphic.file.prop['FresteaLogoShadow'] = {
		position: {
			target: createVector(width / 2, -height / 3),
			follow: createVector(width / 2, -height / 3)
		},
		size: {
			target: 1,
			follow: 1
		},
		opacity: {
			target: 0,
			follow: 0
		}
	};

	asset.graphic.file.prop['FresteaLogo'] = {
		position: {
			target: createVector(width / 2, -height / 3),
			follow: createVector(width / 2, -height / 3)
		},
		size: {
			target: 1,
			follow: 1
		},
		opacity: {
			target: 0,
			follow: 0
		}
	};

	asset.graphic.file.prop.Background.opacity.target = 0;

	asset.graphic.file.prop.Start.position.target.y = height / 0.8;

	textFont(asset.font);
}

loading.counter.add = function() {
	if (inspect) console.log('Asset number ' + (loading.counter.number + 1) + ' is loaded');
	loading.counter.number += 1;
}

function draw() {
	background(125, 25, 200);
	textAlign(CENTER, CENTER);

	let Time = millis() / 1000;
	timer.time = Time;
	winMin = min(width, height);
	winMax = max(width, height);

	image(asset.graphic.file.data.Background, width / 2, height / 2, width, height, 0, 0, asset.graphic.file.data.Background.width, asset.graphic.file.data.Background.height, COVER);

	asset.graphic.file.prop.Background.opacity.follow = smoothData(asset.graphic.file.prop.Background.opacity.target, asset.graphic.file.prop.Background.opacity.follow, 0.25);
	fill(125, 25, 200, 255 - asset.graphic.file.prop.Background.opacity.follow);
	rect(width / 2, height / 2, width, height);

	asset.graphic.file.prop.Start.position.follow.y = smoothData(asset.graphic.file.prop.Start.position.target.y, asset.graphic.file.prop.Start.position.follow.y, 0.125);

	asset.graphic.file.prop.FresteaLogoShadow.opacity.target = 255;
	asset.graphic.file.prop.FresteaLogoShadow.position.target.x = width / 2;

	asset.graphic.file.prop.FresteaLogo.opacity.target = 255;
	asset.graphic.file.prop.FresteaLogo.position.target.x = width / 2;

	if (loading.counter.number == loading.totalFile) loading.status = false;
	if (loading.status == true) {

		asset.graphic.file.prop.FresteaLogoShadow.position.target.y = height / 3;
		asset.graphic.file.prop.FresteaLogo.position.target.y = height / 3;

		noFill();
		stroke(225, 55, 255);
		strokeWeight(winMin / 256);
		rect(width / 2, height / 1.6, winMin / 2 + winMin / 64, winMin / 16 + winMin / 64, winMin / 64);

		noStroke();
		fill(155, 10, 225);
		rect(width / 2 - winMin / 4 + winMin / 4 * loading.counter.number / loading.totalFile, height / 1.6, winMin / 2 * loading.counter.number / loading.totalFile, winMin / 16, winMin / 128);

		fill(255)
		textSize(winMin / 32);
		text('Loading...', width / 2, height / 1.6);

	} else {

		strokeWeight(winMin / 64);
		textSize(winMin / 16);

		if (game.playing && timer.end() && !game.ended) {
			game.playing = false;
			game.ended = true;
			game.winner = 'TimeOut!';
			for (key in element) {
				element[key].resetCounts();
				collector[key].count = 0;
			}
		} else if (!game.ended && (element.Apple.tapCounts == 5 || element.Honey.tapCounts == 5 || element.Jasmine.tapCounts == 5)) {
			game.playing = false;
			game.ended = true;
			game.winner = element.Apple.tapCounts == 5 ? 'Apple' : element.Honey.tapCounts == 5 ? 'Honey' : 'Jasmine';
			for (key in element) {
				element[key].resetCounts();
				collector[key].count = 0;
			}
		}

		if (game.playing && !game.ended) {

			asset.graphic.file.prop.Background.opacity.target = 255;
			asset.graphic.file.prop.FresteaLogoShadow.position.target.y = height / 5;
			asset.graphic.file.prop.FresteaLogoShadow.size.target = 0.8;
			asset.graphic.file.prop.FresteaLogo.position.target.y = height / 6.25;
			asset.graphic.file.prop.FresteaLogo.size.target = 0.8;

			var n = 1;
			for (var key in element) {
				asset.graphic.file.prop[key + 'Bottle'].position.target.x = width / 6 * n;
				asset.graphic.file.prop[key + 'Bottle'].position.target.y = element[key].tapping ? height / 1.6 : height / 1.25;
				collector[key].count = element[key].tapCounts + 1;
				element[key].draw();
				n += 2;
			}

			asset.graphic.file.prop.Start.position.target.y = height / 0.8;

			stroke(155, 10, 225);
			fill(255);
			textSize(winMin / 8);
			push();
			translate(width / 2, height / 3.2);
			scale(1 + 0.25 * (cos(Time / (timer.counterDown / 15.0 + 0.25)) * 0.5 + 0.5));
			text(floor(timer.counterDown + 0.5), 0, 0);
			pop();

		}

		for (var key in element) {

			asset.graphic.file.prop[key + 'Bottle'].size.follow = smoothData(asset.graphic.file.prop[key + 'Bottle'].size.target, asset.graphic.file.prop[key + 'Bottle'].size.follow, 0.125);
			collector[key].size = asset.graphic.file.prop[key + 'Bottle'].size.follow;

			asset.graphic.file.prop[key + 'Bottle'].position.follow.x = smoothData(asset.graphic.file.prop[key + 'Bottle'].position.target.x, asset.graphic.file.prop[key + 'Bottle'].position.follow.x, 0.125);
			collector[key].position.x = asset.graphic.file.prop[key + 'Bottle'].position.follow.x;

			asset.graphic.file.prop[key + 'Bottle'].position.follow.y = smoothData(asset.graphic.file.prop[key + 'Bottle'].position.target.y, asset.graphic.file.prop[key + 'Bottle'].position.follow.y, 0.125);
			collector[key].position.y = asset.graphic.file.prop[key + 'Bottle'].position.follow.y;

			collector[key].draw();

		}

		if (!game.playing && game.ended) {

			asset.graphic.file.prop.Background.opacity.target = 0;

			// image(asset.graphic.file.data.Winner, width / 2, height / 3.2, winMin / 2.5, winMin / 2.5, 0, 0, asset.graphic.file.data.Winner.width, asset.graphic.file.data.Winner.height, CONTAIN);
			stroke(155, 10, 225);
			fill(255);
			text(game.winner != 'TimeOut!' ? 'Winner!' : game.winner, width / 2, height / 3.2);

			asset.graphic.file.prop.Start.position.target.y = height / 1.28;

			if (game.winner == 'Apple') {

				asset.graphic.file.prop.AppleBottle.size.target = width / 1.28;
				asset.graphic.file.prop.AppleBottle.position.target.x = width / 2;
				asset.graphic.file.prop.AppleBottle.position.target.y = height / 1.6;

				asset.graphic.file.prop.HoneyBottle.position.target.y = height / 0.625;
				asset.graphic.file.prop.JasmineBottle.position.target.y = height / 0.625;

			} else if (game.winner == 'Honey') {

				asset.graphic.file.prop.HoneyBottle.size.target = width / 1.28;
				asset.graphic.file.prop.HoneyBottle.position.target.x = width / 2;
				asset.graphic.file.prop.HoneyBottle.position.target.y = height / 1.6;

				asset.graphic.file.prop.AppleBottle.position.target.y = height / 0.625;
				asset.graphic.file.prop.JasmineBottle.position.target.y = height / 0.625;

			} else if (game.winner == 'Jasmine') {

				asset.graphic.file.prop.JasmineBottle.size.target = width / 1.28;
				asset.graphic.file.prop.JasmineBottle.position.target.x = width / 2;
				asset.graphic.file.prop.JasmineBottle.position.target.y = height / 1.6;

				asset.graphic.file.prop.AppleBottle.position.target.y = height / 0.625;
				asset.graphic.file.prop.HoneyBottle.position.target.y = height / 0.625;

			} else {

				asset.graphic.file.prop.AppleBottle.position.target.y = height / 0.625;
				asset.graphic.file.prop.HoneyBottle.position.target.y = height / 0.625;
				asset.graphic.file.prop.JasmineBottle.position.target.y = height / 0.625;

			}

		} else if (!game.playing && !game.ended) {

			var
				n = 1,
				m = 0;
			for (var key in element) {
				asset.graphic.file.prop[key + 'Bottle'].size.target = width / 4;
				asset.graphic.file.prop[key + 'Bottle'].position.target.x = width / 6 * n;
				asset.graphic.file.prop[key + 'Bottle'].position.target.y = height / (1.024 + 0.128 * (cos(Time - PI / 2 * m) * 0.5 + 0.5) * max(0, sin(Time)));
				n += 2;
				m += 1;
			}

			asset.graphic.file.prop.Background.opacity.target = 0;
			asset.graphic.file.prop.FresteaLogoShadow.position.target.y = height / 2.5;
			asset.graphic.file.prop.FresteaLogo.position.target.y = height / 3;
			asset.graphic.file.prop.FresteaLogo.size.target = 1.25;

			asset.graphic.file.prop.Start.position.target.y = height / 1.6;

		}

		push();
		translate(width / 2, asset.graphic.file.prop.Start.position.follow.y);
		scale(1 + 0.125 * (cos(Time / 0.5) * 0.5 + 0.5));

		image(asset.graphic.file.data.Start, 0, 0, winMin / 4, winMin / 4, 0, 0, asset.graphic.file.data.Start.width, asset.graphic.file.data.Start.height, CONTAIN);

		scale(1 + 0.125 * (sin(Time / 0.5) * 0.5 + 0.5));
		stroke(155, 10, 225);
		fill(255);
		if (!game.playing && game.ended) text('Try Again!', 0, 0);
		else if (!game.playing && !game.ended) text('Ready?', 0, 0);
		pop();

	}

	noStroke();

	asset.graphic.file.prop.FresteaLogoShadow.position.follow.x = smoothData(asset.graphic.file.prop.FresteaLogoShadow.position.target.x, asset.graphic.file.prop.FresteaLogoShadow.position.follow.x, 0.2);
	asset.graphic.file.prop.FresteaLogoShadow.position.follow.y = smoothData(asset.graphic.file.prop.FresteaLogoShadow.position.target.y, asset.graphic.file.prop.FresteaLogoShadow.position.follow.y, 0.2);
	asset.graphic.file.prop.FresteaLogoShadow.opacity.follow = smoothData(asset.graphic.file.prop.FresteaLogoShadow.opacity.target, asset.graphic.file.prop.FresteaLogoShadow.opacity.follow, 0.08);
	image(
		asset.graphic.file.data.FresteaLogoShadow,
		asset.graphic.file.prop.FresteaLogoShadow.position.follow.x,
		asset.graphic.file.prop.FresteaLogoShadow.position.follow.y,
		width / 1.25 * asset.graphic.file.prop.FresteaLogoShadow.size.follow,
		height / 4 * asset.graphic.file.prop.FresteaLogoShadow.size.follow,
		0,
		0,
		asset.graphic.file.data.FresteaLogoShadow.width,
		asset.graphic.file.data.FresteaLogoShadow.height,
		CONTAIN
	);

	fill(125, 25, 200, 255 - asset.graphic.file.prop.FresteaLogoShadow.opacity.follow);
	rect(width / 2, height / 2, width, height);

	asset.graphic.file.prop.FresteaLogo.position.follow.x = smoothData(asset.graphic.file.prop.FresteaLogo.position.target.x, asset.graphic.file.prop.FresteaLogo.position.follow.x, 0.125);
	asset.graphic.file.prop.FresteaLogo.position.follow.y = smoothData(asset.graphic.file.prop.FresteaLogo.position.target.y, asset.graphic.file.prop.FresteaLogo.position.follow.y, 0.125);
	asset.graphic.file.prop.FresteaLogo.opacity.follow = smoothData(asset.graphic.file.prop.FresteaLogo.opacity.target, asset.graphic.file.prop.FresteaLogo.opacity.follow, 0.0625);
	asset.graphic.file.prop.FresteaLogo.size.follow = smoothData(asset.graphic.file.prop.FresteaLogo.size.target, asset.graphic.file.prop.FresteaLogo.size.follow, 0.125);
	image(
		asset.graphic.file.data.FresteaLogo,
		asset.graphic.file.prop.FresteaLogo.position.follow.x,
		asset.graphic.file.prop.FresteaLogo.position.follow.y,
		width / 2 * asset.graphic.file.prop.FresteaLogo.size.follow,
		height / 4 * asset.graphic.file.prop.FresteaLogo.size.follow,
		0,
		0,
		asset.graphic.file.data.FresteaLogo.width,
		asset.graphic.file.data.FresteaLogo.height,
		CONTAIN
	);

	fill(125, 25, 200, 255 - asset.graphic.file.prop.FresteaLogo.opacity.follow);
	rect(width / 2, height / 2, width, height);

}

function smoothData(currentValue, previousSmoothedValue, smoothingFactor) {
	return smoothingFactor * currentValue + (1 - smoothingFactor) * previousSmoothedValue;
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {

	if (mouseX > width / 2 - winMin / 4 && mouseX < width / 2 + winMin / 4 &&
		mouseY > asset.graphic.file.prop.Start.position.follow.y - winMin / 16 && mouseY < asset.graphic.file.prop.Start.position.follow.y + winMin / 16) {
		if (!game.playing && !game.ended) {
			game.playing = true;
			timer.start();
		} else if (!game.playing && game.ended) {
			game.ended = false;
		}
	}

	if (game.playing) {
		let mouseXY = createVector(mouseX, mouseY);
		for (var key in element) {
			element[key].tapped(mouseXY);
		}
		if (inspect) console.log('apple: ' + element.Apple.tapCounts, 'honey: ' + element.Honey.tapCounts, 'jasmine: ' + element.Jasmine.tapCounts);
	}
}

function touchMoved() {
	// event.preventDefault();
}

function keyPressed() {
	let fs = fullscreen();
	if (key == 'f') fullscreen(!fs);
}