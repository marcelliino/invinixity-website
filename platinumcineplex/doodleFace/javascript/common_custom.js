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
        catalog: {
            image: [
                "resource/face/mask_0.png",
                "resource/face/mask_1.png",
                "resource/face/mask_2.png",
                "resource/face/mask_3.png",
                "resource/face/mask_4.png"
            ],
            sound: [

            ],
            font: [
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
            ]
        },
        content: {
            image: {},
            sound: {},
            font: {}
            
        },
        fetched: null,
        loading: true,
        counter: 0,
        animate: 0
    };
