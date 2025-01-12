function preload() {
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

    file.content = file.scanner(file.catalog, path => {
        // Load each file and dynamically update progress
        file.extract(path)
            .then(resource => {
                
            })
            .catch(error => {
                console.error(`Failed to load: ${path}`, error);
            });
    });

    // textFont(file.content.font);
    
    inout.webcam.presetup();
    scene.graphic = createGraphics(width, height, WEBGL);
    
}