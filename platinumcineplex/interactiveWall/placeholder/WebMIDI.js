midi.input['set'] = function(n) {
	midi.input['listener'] = WebMidi.inputs[n].addListener("controlchange", e => {
		if (inspect) console.log(e);
	}, [1, 2, 3, 4, 5, 6, 7, 8])
}