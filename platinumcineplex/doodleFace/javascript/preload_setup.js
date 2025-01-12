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

    const loadTasks = [];

    file.content = file.scanner(file.catalog, path => {
        const loadTask = file.extract(path).then(resource => {
            if (resource) {
                file.counter++;
                console.log(file.counter + "/" + file.catalog.length)
            }
            return resource;
        });
        loadTasks.push(loadTask);
    });
    
    Promise.all(loadTasks)
        .then(() => {
            console.log("All resources loaded!");
            file.loading = false;
        })
        .catch(error => {
            console.error("Error loading some resources:", error);
        });

    // textFont(file.content.font);
    
    inout.webcam.presetup();
    scene.graphic = createGraphics(width, height, WEBGL);
    
}