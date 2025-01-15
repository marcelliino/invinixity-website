class Webcam {
    constructor(custom = false, number = 1, label = '', settings = null) {
        this.device = {
            number: number,
            id: '',
            label: label
        };
        this.custom = custom;
        this.stream = null;
        this.canvas = null;
        this.button = {
            position: { x: 0.5, y: 0.8 }, radius: 0.2, tapped: false,
            timer: new Timer(3),
            push: this.#push.bind(this),
            pull: this.#pull.bind(this),
        };
        this.settings = settings ||
        {
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                resizeMode: 'crop-and-scale',
                framerate: {
                    ideal: 30,
                    min: 15,
                    max: 60
                }
            },
            audio: false
        }
        this.newstart = true;
        this.prepared = false;
        this.captured = false;

        this.#presetup();
    }

    async #presetup() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const cameraModule = devices.filter(device => device.kind === 'videoinput');

            if (cameraModule.length > 0) {
                let preferredCamera = cameraModule.find(device => device.label.includes(this.device.label));
                let videoCamera = preferredCamera ?? (cameraModule[this.device.number] || cameraModule[0]);

                this.device.id = videoCamera.deviceId;
                console.log('Selected camera:', this.device.label || 'Not specified');
                this.device.label = videoCamera.label;
                console.log('Detected camera:', this.device.label, 'ID:', this.device.id);
            } else {
                throw new Error('No camera modules found');
            }
        } catch (error) {
            console.error('Camera access error:', error);
        }
    }

    initiate() {
        if (this.stream) {
            this.stream.remove();
            this.prepared = false;
        }

        this.settings.video.deviceId = this.device.id;

        this.stream = createCapture(this.custom ? this.settings : VIDEO, { flipped: true }, () => {
            this.canvas = createGraphics(width, height);
            this.stream.hide();
            this.prepared = true;
            console.log('Webcam initiated', this.settings);
        });
    }

    render(target_canvas) {
        if (!this.prepared) return;

        const minWin = min(width, height);

        this.canvas.background(0);
        this.canvas.image(this.stream,
            0, 0,
            width, height,
            0, 0,
            this.stream.width, this.stream.height,
            COVER
        );

        this.button.timer.time = millis() / 1000;

        target_canvas.clear();
        target_canvas.ortho();

        // webcam live stream
        target_canvas.push();

        target_canvas.imageMode(CENTER);
        target_canvas.image(this.canvas, 0, 0);

        target_canvas.translate(-this.canvas.width * 0.5, -this.canvas.height * 0.5, 128);
        target_canvas.noStroke();
        target_canvas.noFill();

        target_canvas.textureMode(NORMAL);
        if (file.content.face.mask[0]) target_canvas.texture(file.content.face.mask[0]);

        if (this.button.timer.end() && this.captured) {
            mapper.face.draw(target_canvas);
        }

        //--------------------//
        // Mask Assignment Logic
        // if (this.button.timer.end() && this.captured) {
        //     const faceCount = mapper.face.data.length; // Number of detected faces
        //     const maskCount = file.content.face.mask.length;

        //     // Ensure lastAssignedMasks is initialized
        //     if (!this.lastAssignedMasks) this.lastAssignedMasks = [];

        //     // Get randomized mask indices
        //     const assignedMasks = getRandomizedMasks(faceCount, maskCount, this.lastAssignedMasks);

        //     // Assign textures for each face
        //     assignedMasks.forEach((maskIndex, faceIndex) => {
        //         if (file.content.face.mask[maskIndex]) {
        //             mapper.face.textures[faceIndex] = file.content.face.mask[maskIndex];
        //         }
        //     });

        //     // Draw faces with assigned masks
        //     mapper.face.draw(target_canvas);
        // }
        //--------------------//

        target_canvas.pop();

        // webcam graphical user interface
        push();

        image(target_canvas, 0, 0);

        const { position: pos, radius: rad, tapped: tap } = this.button;

        let pulse = sin(millis() / 1000 * PI) * 8,
            opacity = 55;
        if (tap) opacity = 125;

        noStroke();
        fill(255, opacity);
        textAlign(CENTER, CENTER);
        textFont(file.content.font.Figtree.Bold);

        if (this.button.timer.end()) {
            circle(pos.x * width, pos.y * height, rad * minWin * (tap ? 0.64 : 0.8));
            noFill();
            stroke(255, opacity);
            strokeWeight(rad * minWin * 0.125);
            circle(pos.x * width, pos.y * height, rad * minWin);

            if (!this.captured) {
                if (!this.newstart) {
                    this.stream.stop();
                    this.captured = true;
                    console.log('Webcam captured:', this.captured);
                }
            } else {
                noStroke();
                fill(255);
                textSize(minWin * 0.0625 + pulse);
                text('NEXT', width * 0.75, pos.y * height);
            }
        } else {
            pulse = cos(this.button.timer.counterDown * TAU) * 16;
            fill(255);
            textSize(minWin * 0.25 + pulse);
            text(floor(this.button.timer.counterDown + 0.5), width * 0.5, height * 0.5);
        }
    }

    resize(w, h) {
        if (this.prepared) this.canvas.resizeCanvas(w, h);
    }

    #push() {
        const minWin = min(width, height);
        const { position, radius, tapped } = this.button;

        if (!tapped && dist(mouseX, mouseY, position.x * width, position.y * height) <= radius * minWin * 0.5) {
            this.button.tapped = true;
            console.log('Button tapped');
        }
    }

    #pull() {
        const minWin = min(width, height);
        const { position, radius, tapped } = this.button;

        if (tapped && dist(mouseX, mouseY, position.x * width, position.y * height) <= radius * minWin * 0.5) {
            this.stream.play();
            if (!mapper.face.detected) mapper.initiate(this.canvas);
            this.button.timer.start();
            this.captured = false;
            console.log('New start: ', this.newstart, 'Webcam captured:', this.captured);
            this.newstart = false;
        }
        this.button.tapped = false;
    }
}

function getRandomizedMasks(faceCount, maskCount, lastAssignedMasks = []) {
    let masks = Array.from({ length: maskCount }, (_, i) => i); // Mask indices [0, 1, ..., maskCount-1]
    let assignedMasks = [];

    for (let i = 0; i < faceCount; i++) {
        // Ensure a random selection that avoids immediate repetition
        let availableMasks = masks.filter(m => m !== lastAssignedMasks[i]);
        if (availableMasks.length === 0) availableMasks = masks; // Allow repetition if no other choice

        let randomMask = random(availableMasks);
        assignedMasks.push(randomMask);

        // Update last assigned for the current face
        lastAssignedMasks[i] = randomMask;
    }

    return assignedMasks;
}