function preload() {
    mapper.presetup(mapper.settings);
}

function setup() {
    
    createCanvas(windowWidth, windowHeight, WEBGL);
    pixelDensity(1);
    smooth();
    
    angleMode(DEGREES);
    
    inout.webcam.presetup();
}

file.fetched = function () {
    file.counter += 1;
    file.loading = file.counter >= NUMBER_OF_ASSET ? false : true;
}
