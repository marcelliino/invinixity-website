function touchStarted() {
    if(!inout.webcam.prepared) inout.webcam.initiate();
    inout.webcam.button.push();
}

function touchEnded() {
    inout.webcam.button.pull();
}
