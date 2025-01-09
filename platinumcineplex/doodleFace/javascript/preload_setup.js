function preload() {
    mapper.presetup(mapper.settings);
    file.content.font = loadFont('resource/font/Quicksand-VariableFont_wght.ttf');
}

function setup() {
    
    createCanvas(windowWidth, windowHeight);
    pixelDensity(1);
    smooth();
    
    angleMode(DEGREES);

    textFont(file.content.font);
    
    inout.webcam.presetup();
    scene.graphic = createGraphics(width, height, WEBGL);
    
    for (let n = 0; n < 1; n++) {
        file.content.image[`mask${n}`] = loadImage(`resource/face/mask${n}.png`, file.fetched);
    }
}

file.fetched = function () {
    file.counter += 1;
    file.loading = file.counter >= NUMBER_OF_ASSET ? false : true;
}
