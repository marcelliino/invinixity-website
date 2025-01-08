function draw() {
    background(25);
    
    ortho();
    
    if(inout.webcam.prepared) inout.webcam.render();
    
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    inout.webcam.resize(width, height);
}
