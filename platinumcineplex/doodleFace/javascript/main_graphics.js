function draw() {
    background(86, 19, 187);
    let minWin = min(width, height);

    if (file.loading) {

        file.tracker.update(file.counter);

        push();
        tint(251, 128, 0);
        imageMode(CENTER);
        if (file.content.logo) image(file.content.logo, width / 2, height / 2 - minWin / 4, minWin / 2, minWin / 2);
        pop();


        file.tracker.display.bar(width / 2, height / 1.5, width / 2);

    } else {
        if (inout.webcam.prepared) inout.webcam.render(scene.graphic);
    }

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    inout.webcam.resize(width, height);
    scene.graphic.resizeCanvas(width, height);
}
