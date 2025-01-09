function touchStarted() {
    inout.webcam.snapshot.push();
}

function touchEnded() {
    inout.webcam.snapshot.pull();
}
