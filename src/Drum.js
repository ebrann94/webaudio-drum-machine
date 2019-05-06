class Drum {
    constructor(audioFilename, audioContext) {
        this.audioBuffer;
        this.playBackSpeed = 1.0;
        this.audioContext = audioContext

        fetch(audioFilename)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Unable to load sound file');
                }
                return res.arrayBuffer();
            })
            .then(rawBuffer => {
                this.audioContext.decodeAudioData(rawBuffer, (decodedData) => {
                    this.audioBuffer = decodedData;
                }, err => {
                    console.log('Unable to create audiobuffer' + err);
                });
                
            });
        
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);

        this.sequence = Array(16).fill(false);
        
        this.play = this.play.bind(this);
    }

    setGain(newGain) {
        this.gainNode.gain.value = newGain;
    }

    shouldPlay(beatNumber) {
        if (this.sequence[beatNumber]) {
            this.play();
        }
    }

    setSequence(beatNumber) {
        this.sequence[beatNumber] = !this.sequence[beatNumber];
    } 

    play() {
        this.audioContext.resume();
        const source = this.audioContext.createBufferSource();
        source.buffer = this.audioBuffer;
        source.playbackRate.value = this.playBackSpeed;
        source.connect(this.gainNode);
        source.start(0);
    }    
}

export default Drum;