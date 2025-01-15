class Entity {
	constructor(img, randomX) {
		this.img = img;
		this.randomX = randomX;
		this.targetX = random(this.randomX);
		this.size = width / 5;
		this.position = createVector(0, -this.size / 0.5);
		this.tapCounts = 0;
		this.tapping = false;
		this.speed = random(16, 32);
		this.sound = {
			playing: false
		}
		this.sound['osc'] = new p5.Oscillator('sine');
	}

	draw() {
		this.tapping = false;
		this.size = width / 5;
		this.position.x = width / 10 * this.targetX;
		this.position.y += height / 10 / this.speed;

		if (this.position.y > height + this.size / 0.5) {
			this.targetX = random(this.randomX);
			this.position.y = -this.size / 0.5;
			this.speed = random(16, 32);
		}

		push();
		translate(this.position.x, this.position.y);
		rotate(cos(millis() / 1000 + this.speed) * PI / 2);
		image(this.img, 0, 0, this.size, this.size, 0, 0, this.img.width, this.img.height, CONTAIN);
		pop();

	}

	resetCounts() {
		this.tapCounts = 0;
	}

	tapped(touch) {
		if (touch.x > this.position.x - this.size / 2 && touch.x < this.position.x + this.size / 2 &&
			touch.y > this.position.y - this.size / 2 && touch.y < this.position.y + this.size / 2) {
			this.tapping = true;
			this.tapCounts += 1;
			this.targetX = random(this.randomX);
			this.position.y = -this.size / 0.5;
			this.speed = random(16, 32);

			this.sound.osc.start();

			this.sound.osc.freq(800);
			this.sound.osc.amp(0.8);

			this.sound.osc.freq(600, 0.1);
			this.sound.osc.freq(1200, 0.2);
			this.sound.osc.amp(0.0, 0.4);

			this.sound.osc.pan(map(touch.x, 0.0, width, -1.0, 1.0));
			this.sound.playing = true;
		}
	}
}