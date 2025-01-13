mapper.presetup = function (config) {
    mapper.face.mesh = ml5.faceMesh(config);
}

mapper.initiate = function () {
    mapper.face.mesh.detectStart(inout.webcam.canvas, (results) => mapper.face.data = results);
    mapper.face.detected = true;
    mapper.face.tris = mapper.face.mesh.getTriangles();
    mapper.face.uvst = mapper.face.mesh.getUVCoords();
    
    console.log('Mapper settings:', mapper.settings);
    console.log('Mapper data', mapper.face.data);
}

mapper.face.draw = function (target_canvas) {
    mapper.face.data.forEach(face => {
        target_canvas.beginShape(TRIANGLES);
        mapper.face.tris.forEach(triad => {
            triad.forEach(index => {
                let pt = face.keypoints[index],
                    uv = mapper.face.uvst[index];
                target_canvas.vertex(pt.x, pt.y, -pt.z, uv[0], uv[1]);
            });
        });
        target_canvas.endShape();
    });
}
