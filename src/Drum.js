function Drum(audioFilename) {
    // console.log(audioContext);
    this.gainNode = audioCtx.createGain();
    this.gainNode.connect(audioCtx.destination);

    this.playbackSpeed = 1.0;
    this.sequence = Array(16).fill(false);

    this.fetchAudioFile(audioFilename);
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
        .then(rawBuffer => {
            audioCtx.decodeAudioData(rawBuffer, (decodedData) => {
                this.audioBuffer = decodedData;
            }, (error) => {
                console.log(error);
            });
        })
        .catch(error => {
            console.log(error);
        });
};

export default Drum;