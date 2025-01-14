function draw() {
    background(86, 19, 187);
    let minWin = min(width, height);

    if (file.loading) {
        let progress = file.counter / file.catalog.length;
        let barWidth = width * 0.6;

        push();
        tint(251, 128, 0);
        imageMode(CENTER);
        if (file.content.logo) image(file.content.logo, width / 2, height / 2 - minWin / 4, minWin / 2, minWin / 2);
        pop();

        noFill();
        stroke(255);
        strokeWeight(8);
        rect((width - barWidth) / 2 - 16, height / 2 - 32, barWidth + 32, 64, 32);
        noStroke();
        fill(255);
        rect((width - barWidth) / 2, height / 2 - 16, barWidth * progress, 32, 32);

    } else {
        if (inout.webcam.prepared) inout.webcam.render(scene.graphic);
    }

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    inout.webcam.resize(width, height);
    scene.graphic.resizeCanvas(width, height);
}
