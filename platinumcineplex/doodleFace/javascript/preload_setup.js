function preload() {
    scene.logo = loadImage('PlatinumCineplexLogo.png');
    mapper.presetup(mapper.settings);
}

function setup() {
    
    createCanvas(windowWidth, windowHeight);
    pixelDensity(1);
    smooth();

    console.log("Initializing...");

    file.loading = true;
    file.counter = 0;
    file.content = {};

    file.content = file.scanner(file.catalog, file.extract);

    // textFont(file.content.font);
    
    inout.webcam.presetup();
    scene.graphic = createGraphics(width, height, WEBGL);
    
}