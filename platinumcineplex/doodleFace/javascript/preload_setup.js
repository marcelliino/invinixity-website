function preload() {
    mapper.presetup(mapper.settings);
}

function setup() {
    
    createCanvas(windowWidth, windowHeight);
    pixelDensity(1);
    smooth();

    // textFont(file.content.font);
    
    inout.webcam.presetup();
    scene.graphic = createGraphics(width, height, WEBGL);
    
    // load images
    // for (let n = 0; n < file.catalog.image.length; n++) {
    //     file.content.image[`mask${n}`] = loadImage(`resource/face/mask${n}.png`, file.fetched);
    // }
}

file.fetched = function () {
    file.counter += 1;
    file.loading = file.counter >= NUMBER_OF_ASSET ? false : true;
}
