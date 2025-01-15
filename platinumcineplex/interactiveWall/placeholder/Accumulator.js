class Accumulator {
	constructor(img, imgShadow, position) {
		this.count = 0;
		this.imgSteps = [];
		this.img = img;
		this.imgShadow = imgShadow;
		this.size = width / 4;
		this.position = position;
	}

	draw() {

		push();
		translate(this.position.x, this.position.y + this.size / 5);
		image(this.imgShadow, 0, 0, this.size / 0.8, this.size / 0.8, 0, 0, this.imgShadow.width, this.imgShadow.height, CONTAIN);
		pop();

		push();
		translate(this.position.x, this.position.y);
		image(this.img, 0, 0, this.size, this.size, 0, 0, this.img.width, this.img.height, CONTAIN);
		if (this.count != 0) image(this.imgSteps[this.count-1], 0, 0, this.size / 0.999, this.size / 0.999, 0, 0, this.img.width, this.img.height, CONTAIN);
		pop();

	}

	resetCounts() {
		this.tapCounts = 0;
	}
}