function draw() {
	background(0);
	let elapsedTime = millis() / 1000.0;
	var spectrum = fft.analyze();

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

	scene.render3D.setUniform('maxRayBounces', maxRayBounces);
	scene.render3D.setUniform("u_time", elapsedTime);
	scene.render3D.setUniform("u_resolution", [scene.graphics.width, scene.graphics.height]);
	scene.render3D.setUniform("u_mouse", [mouseX, map(mouseY, 0, height, height, 0)]);
	scene.render3D.setUniform("tex0", scene.texture0);
	scene.render3D.setUniform("tex1", scene.texture1);
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
		rect(0, 0, width / 2, min(width, height) / 8, 8);
		noStroke();
		fill(55);
		rect(width / 4 * data.animate - width / 4, 0, width / 2 * data.animate, min(width, height) / 8, 8);


		fill(255);
		textSize(min(width, height) / 16);
		textAlign(CENTER, CENTER);
		text('Loading', 0, 0);
		pop();

	}

	dynamicScaling(fps.minimum, fps.maximum);

}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	scene.graphics.resizeCanvas(windowWidth * scene.pixScale, windowHeight * scene.pixScale);
}