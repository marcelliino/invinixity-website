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
        inout.webcam.canvas = createGraphics(width, height);
        mapper.initiate();
        inout.webcam.stream.hide();
        inout.webcam.prepared = true;
    });

    console.log('Webcam settings:', inout.webcam.settings);
}


inout.webcam.render = function (target_canvas) {
    inout.webcam.canvas.background(0);
    inout.webcam.canvas.image(inout.webcam.stream,
                        0, 0,
                        width, height,
                        0, 0,
                        inout.webcam.stream.width, inout.webcam.stream.height,
                        COVER);
    
    target_canvas.background(0);
    target_canvas.ortho();
    
    // webcam live stream
    target_canvas.push();
    
    target_canvas.imageMode(CENTER);
    target_canvas.image(inout.webcam.canvas, 0, 0);
    
    target_canvas.translate(-inout.webcam.canvas.width * 0.5, -inout.webcam.canvas.height * 0.5, 128);
    target_canvas.noStroke();
    target_canvas.noFill();
    
    target_canvas.textureMode(NORMAL);
    if (file.content.image.mask0) target_canvas.texture(file.content.image.mask0);
    
    if (inout.webcam.captured){
        mapper.face.draw(target_canvas);
        mapper.face.mesh.detectStop();
    }
    
    target_canvas.pop();
    
    // webcam graphical user interface
    push();
    
    image(target_canvas, 0, 0);
    
    let tap = inout.webcam.button.tapped,
        opacity = 55;
    if(tap) opacity = 125;
    
    noStroke();
    fill(255, opacity);
    
    let pos = inout.webcam.button.position,
        rad = inout.webcam.button.radius;
    if (!inout.webcam.captured) {
        circle(pos.x * width, pos.y * height, rad * min(width, height) * (tap ? 0.64 : 0.8));
        noFill();
        stroke(255, opacity);
        strokeWeight(rad * min(width, height) * 0.125);
        circle(pos.x * width, pos.y * height, rad * min(width, height));
    }
    
    pop();
}

inout.webcam.resize = function (w, h) {
    inout.webcam.canvas.resizeCanvas(w, h);
}

inout.webcam.snapshot.push = function () {
    let pos = inout.webcam.button.position,
        rad = inout.webcam.button.radius,
        tap = inout.webcam.button.tapped;
    
    if (!tap && dist(mouseX, mouseY, pos.x * width, pos.y * height) <= rad * min(width, height)) {
        inout.webcam.button.tapped = true;
    }
}

inout.webcam.snapshot.pull = function () {
    let pos = inout.webcam.button.position,
        rad = inout.webcam.button.radius,
        tap = inout.webcam.button.tapped;
    
    if (tap && dist(mouseX, mouseY, pos.x * width, pos.y * height) <= rad * min(width, height)) {
        inout.webcam.stream.stop();
        inout.webcam.captured = true;
    } else {
        inout.webcam.button.tapped = false;
    }
}
