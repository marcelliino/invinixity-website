function draw() {
    background(86, 19, 187);
    scene.minWin = min(width, height);

    if (file.loading) {
        scene.logo.target = {
            x: width / 2,
            y: height / 2 - scene.minWin / 6,
            s: scene.minWin / 2,
        };

        scene.bar.target = {
            w: width / 2,
            h: width / 32,
            x: width / 2,
            y: height / 1.5
        };
    } else {
        scene.logo.target.s = scene.minWin / 4;
        scene.logo.target.x = scene.logo.target.s / 2;
        scene.logo.target.y = scene.logo.target.s / 2;
        scene.bar.target.x = width / 2;
        scene.bar.target.y = height / 2;
        scene.bar.target.w = width / 2;
        scene.bar.target.h = width / 8;
    }

    scene.logo.current = {
        x: lerp(scene.logo.current.x, scene.logo.target.x, 0.125),
        y: lerp(scene.logo.current.y, scene.logo.target.y, 0.125),
        s: lerp(scene.logo.current.s, scene.logo.target.s, 0.125)
    };

    scene.bar.current = {
        x: lerp(scene.bar.current.x, scene.bar.target.x, 0.125),
        y: lerp(scene.bar.current.y, scene.bar.target.y, 0.125),
        w: lerp(scene.bar.current.w, scene.bar.target.w, 0.125),
        h: lerp(scene.bar.current.h, scene.bar.target.h, 0.125)
    };


    push();
    tint(251, 128, 0);
    imageMode(CENTER);
    if (file.content.logo) image(file.content.logo, scene.logo.current.x, scene.logo.current.y, scene.logo.current.s, scene.logo.current.s, 0, 0);
    pop();

    file.tracker.update(file.counter);
    file.tracker.display.bar(scene.bar.current.x, scene.bar.current.y, scene.bar.current.w, scene.bar.current.h);

    if (inout.webcam.prepared) inout.webcam.render(scene.graphic);

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    inout.webcam.resize(width, height);

    scene.graphic.resizeCanvas(width, height);
}
