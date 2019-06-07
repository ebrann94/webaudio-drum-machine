function Drum(audioFilename, DOMElement, setCurrentDrum) {
    // console.log(audioContext);
    this.gainNode = audioContext.createGain();
    this.gainNode.connect(audioContext.destination);

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

    setCurrentDrum = setCurrentDrum.bind(this);
    const selectBtn = DOMElement.querySelector('.drum__select-btn');
    selectBtn.addEventListener('click', () => {
        setCurrentDrum();
    });
}

Drum.prototype.setGain = function(newGain) {
    this.gainNode.gain.value = newGain;
};

Drum.prototype.play = function() {
    audioContext.resume();
    const source = audioContext.createBufferSource();
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
        .then(rawBuffer => audioContext.decodeAudioData(rawBuffer))
        .then(decodedData => this.audioBuffer = decodedData)
        .catch(error => {
            console.log(error);
        });
};

export default Drum;