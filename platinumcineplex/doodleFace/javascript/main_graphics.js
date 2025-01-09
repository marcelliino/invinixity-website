function draw() {
    background(25);
    
    if(inout.webcam.prepared) inout.webcam.render(scene.graphic);
    
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    inout.webcam.resize(width, height);
    scene.graphic.resizeCanvas(width, height);
}
