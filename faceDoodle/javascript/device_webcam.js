inout.webcam.presetup = function () {
    navigator.mediaDevices.enumerateDevices().then(function (devices) {
        const cameraModule = devices.filter(device => device.kind === 'videoinput');
        if (cameraModule.length > 0) {
            let preferredCamera = cameraModule.find(device => device.label.includes('Front Camera'));

            let videoCamera = preferredCamera ??
            cameraModule[inout.webcam.device.number] ??
            cameraModule[0];
            inout.webcam.device.id = videoCamera.deviceId;
            inout.webcam.device.label = videoCamera.label;

            console.log('\nSelected camera: ' + videoCamera.label);

            inout.webcam.initiate();
        } else {
            console.error('No camera modules found.');
        }
    }).catch(function (error) {
        console.error('Error enumerating devices:', error);
    });
}

inout.webcam.initiate = function () {
    if (inout.webcam.stream) inout.webcam.stream.remove();
//    inout.webcam.settings.video.deviceId = inout.webcam.device.id;
    inout.webcam.settings.video.facingMode = 'user';

    inout.webcam.stream = createCapture(inout.webcam.settings, () => {
        inout.webcam.canvas = createGraphics(windowWidth, windowHeight);
        mapper.initiate();
        inout.webcam.stream.hide();
        inout.webcam.prepared = true;
    });

    console.log('Webcam settings:', inout.webcam.settings);
}


inout.webcam.render = function () {
    inout.webcam.canvas.image(inout.webcam.stream,
                        0, 0,
                        width, height,
                        0, 0,
                        inout.webcam.stream.width, inout.webcam.stream.height,
                        COVER);
    
    push();
    
    imageMode(CENTER);
    image(inout.webcam.canvas, 0, 0);
    
    translate(-inout.webcam.canvas.width * 0.5, -inout.webcam.canvas.height * 0.5, 128);
    noStroke();
    fill(255, 125);
    textureMode(NORMAL);
    mapper.face.draw();
    
    pop();
}

inout.webcam.resize = function (w, h) {
    inout.webcam.canvas.resizeCanvas(w, h);
}
