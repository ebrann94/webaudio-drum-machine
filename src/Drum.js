function Drum(audioFilename, DOMElement) {
    // console.log(audioContext);
    this.gainNode = audioCtx.createGain();
    this.gainNode.connect(audioCtx.destination);

    this.playbackSpeed = 1.0;
    this.sequence = Array(16).fill(false);

    this.fetchAudioFile(audioFilename);

    this.DOMElement = DOMElement;

    const playBtn = DOMElement.querySelector('.drum__play-btn');
    playBtn.addEventListener('click', () => {
        this.play();
    });

    const gainSlider = DOMElement.querySelector('.drum__gain-slider');
    gainSlider.addEventListener('input', (e) => {
        this.setGain(e.target.value);
    });

    const pitchSlider = DOMElement.querySelector('.drum__pitch-slider');
    pitchSlider.addEventListener('input', e => {
        this.playbackSpeed = e.target.value;
    });

    const selectBtn = DOMElement.querySelector('.drum__select-btn');
    selectBtn.addEventListener('click', () => {
        currentDrum.set(this);
    });
}

Drum.prototype.setGain = function(newGain) {
    this.gainNode.gain.value = newGain;
};

Drum.prototype.play = function() {
    audioCtx.resume();
    const source = audioCtx.createBufferSource();
    source.buffer = this.audioBuffer;
    source.playbackRate.value = this.playbackSpeed;
    source.connect(this.gainNode);
    source.start(0);
};

Drum.prototype.shouldPlay = function(beatNumber) {
    if (this.sequence[beatNumber]) {
        this.play();
    }
};

Drum.prototype.setSequence = function(beatNumber) {
    this.sequence[beatNumber] = !this.sequence[beatNumber];
};

Drum.prototype.fetchAudioFile = function(fileURL) {
    fetch(fileURL)
        .then(res => {
            if (!res.ok) {
                throw new Error('Unable to load sound file');
            }
            return res.arrayBuffer();
        })
        .then(rawBuffer => audioCtx.decodeAudioData(rawBuffer))
        .then(decodedData => this.audioBuffer = decodedData)
        .catch(error => {
            console.log(error);
        });
};

export default Drum;