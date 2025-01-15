function preload() {
    file.content = {logo: loadImage('resource/logo.png')};
}

function setup() {

    createCanvas(windowWidth, windowHeight);
    pixelDensity(1);
    smooth();

    inout.webcam = new Webcam()
    mapper = new Mapper();

    console.log('Loading resources...');

    const logo = file.content.logo;
    file = new Loader(file.catalog);
    file.content.logo = logo;
    file.tracker = new ProgressStat(file.overall);

    textFont(file.content.font.Figtree.Regular, min(width, height) / 16);

    scene.graphic = createGraphics(width, height, WEBGL);

}