var
	inspect = false,
	winMin, winMax,
	timer,
	game = {
		winner: '',
		playing: false,
		ended: false
	},
	asset = {
		graphic: {
			file: {
				name: [
					'Background',
					'Backdrop',
					'Start',
					'Winner',
					'AppleBottleShadow',
					'AppleBottle',
					// 'AppleShadow',
					'Apple',
					'HoneyBottleShadow',
					'HoneyBottle',
					// 'HoneyShadow',
					'Honey',
					'JasmineBottleShadow',
					'JasmineBottle',
					// 'JasmineShadow',
					'Jasmine',
					'Bottle1',
					'Bottle2',
					'Bottle3',
					'Bottle4',
					'Bottle5'
				],
				data: {},
				prop: {},
				shadow: {}
			}
		},
		audio: {
			file: {
				name: []
			}
		},
	},
	loading = {
		status: true,
		counter: {
			number: 0
		},
		totalFile: 0
	},
	element = {},
	collector = {},
	midi = {
		input: {
			// set				-- declared in WebMIDI.js
			// listener		-- declared in WebMIDI.js > midi.input.set()
		},
	};