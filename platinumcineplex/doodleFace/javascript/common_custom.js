const
    NUMBER_OF_ASSET = 8;


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
            settings: {
                video: {
//                    width: { ideal: 1280 },
//                    height: { ideal: 720 },
//                    resizeMode: 'crop-and-scale',
                    framerate: {
                        ideal: 30,
                        min: 15,
                        max: 60
                    }
                },
                audio: false
            },
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
        content: {
            image: {},
            sound: {}
        },
        fetched: null,
        loading: true,
        counter: 0,
        animate: 0
    };
