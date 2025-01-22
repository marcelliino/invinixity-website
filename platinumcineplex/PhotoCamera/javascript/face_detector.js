class Mapper {
    constructor(settings = null) {
        this.settings = settings ||
        {
            maxFaces: 4,
            refineLandmarks: false,
            flipped: false
        };
        this.prepared = false;
        this.detected = false;
        this.face = {
            mesh: null,
            data: [],
            draw: this.draw.bind(this),
            tris: [],
            uvst: [],
            textures:[],
        };

        this.#presetup();
    }

    #presetup() {
        this.face.mesh = ml5.faceMesh(this.settings, () => {
            this.face.prepared = true;
            console.log('FaceMesh model is ready!', this.settings);
        });
    }

    initiate(videoInput) {
        this.face.mesh.detectStart(videoInput, (results) => {
            this.face.data = results;
            this.face.detected = true;
            // console.log('Face detected with data:', this.face.data);

            this.face.tris = this.face.mesh.getTriangles();
            this.face.uvst = this.face.mesh.getUVCoords();
        });
    }

    draw(target_canvas) {
        this.face.data.forEach(face => {
            target_canvas.beginShape(TRIANGLES);
            this.face.tris.forEach(triad => {
                triad.forEach(index => {
                    const
                        pt = face.keypoints[index],
                        uv = this.face.uvst[index];
                    target_canvas.vertex(pt.x, pt.y, -pt.z, uv[0], uv[1]);
                });
            });
            target_canvas.endShape();
        });
    }
}
