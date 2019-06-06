function Drum2(audioFilename, DOMElement, setCurrentDrum) {
    console.log(window.audioContext);
    this.gainNode = window.audioContext.createGain();
    this.gainNode.connect(window.audioContext.destination);

    this.playbackSpeed = parseFloat('1.0');

    this.sequence = Array(16).fill(false);

    fetch(audioFilename)
        .then(res => {
            if (!res.ok) {
                throw new Error('Unable to load sound file');
            }
            return res.arrayBuffer();
        })
        .then(rawBuffer => {
            window.audioContext.decodeAudioData(rawBuffer, (decodedData) => {
                this.audioBuffer = decodedData;
            }, err => {
                console.log('Unable to create Audio Buffer' + err);
            });
        })
        .catch(error => {
            console.log(error);
        });

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

Drum2.prototype.setGain = function(newGain) {
    this.gainNode.gain.value = newGain;
};

Drum2.prototype.play = function() {
    window.audioContext.resume();
    const source = window.audioContext.createBufferSource();
    source.buffer = this.audioBuffer;
    source.playbackRate.value = this.playbackSpeed;
    source.connect(this.gainNode);
    source.start(0);
};

Drum2.prototype.shouldPlay = function(beatNumber) {
    if (this.sequence[beatNumber]) {
        this.play();
    }
};

Drum2.prototype.setSequence = function(beatNumber) {
    this.sequence[beatNumber] = !this.sequence[beatNumber];
};

export default Drum2;