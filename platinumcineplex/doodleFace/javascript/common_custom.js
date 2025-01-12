let scene = {
        graphic: null,
        runtime: 0.0,
        frameps: {
            numstep: 0,
            current: 0,
            minimum: 12,
            maximum: 30
        }
    },
    inout = {
        webcam: {
            presetup: null,
            initiate: null,
            snapshot: {
                push: null,
                pull: null
            },
            captured: false,
            button: {
                position: {x: 0.5, y: 0.8},
                radius: 0.2,
                tapped: false
            },
            timer: null,
            canvas: null,
            render: null,
            resize: null,
            /*settings: {
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
            },*/
            prepared: false,
            stream: null,
            device: {
                number: 1,
                label: '',
                id: ''
            }
        }
    },
    mapper = {
        presetup: null,
        initiate: null,
        settings: {
            maxFaces: 4,
            refineLandmarks: false,
            flipped: false
        },
        detected: false,
        face: {
            mesh: null,
            data: [],
            draw: null,
        }
    },
    file = {
        catalog: [
            "resource/face/mask_0.png",
            "resource/face/mask_1.png",
            "resource/face/mask_2.png",
            "resource/face/mask_3.png",
            "resource/face/mask_4.png",
            "resource/font/Figtree-Black.ttf",
            "resource/font/Figtree-BlackItalic.ttf",
            "resource/font/Figtree-Bold.ttf",
            "resource/font/Figtree-BoldItalic.ttf",
            "resource/font/Figtree-ExtraBold.ttf",
            "resource/font/Figtree-ExtraBoldItalic.ttf",
            "resource/font/Figtree-Italic.ttf",
            "resource/font/Figtree-Light.ttf",
            "resource/font/Figtree-LightItalic.ttf",
            "resource/font/Figtree-Medium.ttf",
            "resource/font/Figtree-MediumItalic.ttf",
            "resource/font/Figtree-Regular.ttf",
            "resource/font/Figtree-SemiBold.ttf",
            "resource/font/Figtree-SemiBoldItalic.ttf"
        ],
        content: {},
        fetched: null,
        scanner: null,
        extract: null,
        loading: true,
        counter: 0,
        animate: 0
    };

file.scanner = function (paths, loadFile) {
    let structure = {};

    paths.forEach(path => {
        const parts = path.split('/'); // Split path into parts
        let current = structure;

        // Traverse directories up to the second-to-last part
        for (let i = 0; i < parts.length - 1; i++) {
            current[parts[i]] = current[parts[i]] || {};
            current = current[parts[i]];
        }

        const fileName = parts[parts.length - 1].split('.')[0]; // Extract file name (without extension)

        // Handle mask files as arrays based on naming
        if (fileName.startsWith('mask_')) {
            const index = parseInt(fileName.split('_')[1]); // Extract the number from "mask_n"
            if (!Array.isArray(current.mask)) current.mask = []; // Initialize as array if not present
            current.mask[index] = loadFile(path); // Add to the array at the correct index
        } else {
            // For other files, treat them as key-value pairs
            current[fileName] = loadFile(path);
        }
    });

    return structure;
}

file.extract = async function (path) {
    try {
        console.log(`Loading resource: ${path}`);
        if (path.endsWith('.png')) return await loadImage(path);
        if (path.endsWith('.ttf')) return await loadFont(path);
        console.warn(`Unsupported file type: ${path}`);
        return null;
    } catch (error) {
        console.error(`Error loading resource: ${path}`, error);
        return null;
    }
};