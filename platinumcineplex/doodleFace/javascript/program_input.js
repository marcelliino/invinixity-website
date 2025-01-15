function touchStarted() {

    let {x, y, w, h} = scene.bar.current;
    if (mouseX > x - w / 2 && mouseX < x + w / 2 && mouseY > y - h / 2 && mouseY < y + h / 2) {
        scene.tap = true;
    }

    inout.webcam.button.push();
}

function touchEnded() {

    let {x, y, w, h} = scene.bar.current;
    if (mouseX > x - w / 2 && mouseX < x + w / 2 && mouseY > y - h / 2 && mouseY < y + h / 2) {
        if(scene.tap && !inout.webcam.prepared) inout.webcam.initiate();
    }
    scene.tap = false;

    inout.webcam.button.pull();
}
