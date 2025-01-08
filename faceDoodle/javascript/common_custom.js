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
            canvas: null,
            render: null,
            resize: null,
            settings: {
                video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    resizeMode: 'crop-and-scale',
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
            image: [],
            sound: []
        },
        fetched: null,
        loading: true,
        counter: 0,
        animate: 0
    };
