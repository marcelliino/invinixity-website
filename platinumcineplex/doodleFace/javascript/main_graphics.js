function draw() {
    background(25);
    
    if (file.loading) {
        let progress = file.counter / file.catalog.length;
        let barWidth = width * 0.6;

        noFill();
        stroke(255);
        strokeWeight(8);
        rect((width - barWidth) / 2, height / 2 - 32, barWidth, 64, 32);
        noStroke();
        fill(255);
        rect((width - barWidth) / 2, height / 2 - 16, barWidth * progress, 32, 32);

    } else {
        if(inout.webcam.prepared) inout.webcam.render(scene.graphic);
    }
    
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    inout.webcam.resize(width, height);
    scene.graphic.resizeCanvas(width, height);
}
