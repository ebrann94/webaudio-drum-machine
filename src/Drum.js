class Drum {
    constructor(audioFilename, audioContext, DOMElement, setCurrentDrum) {
        this.audioContext = audioContext;

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
            })
            .catch(error => {
                console.log(error);
            });
        
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);

        this.playBackSpeed = 1.0;

        this.sequence = Array(16).fill(false);
        
        // Bind the play function before using as event listener callback
        this.play = this.play.bind(this);

        this.DOMElement = DOMElement;

        const playBtn = DOMElement.querySelector('.drum__play-btn');
        playBtn.addEventListener('click', this.play);

        const gainSlider = DOMElement.querySelector('.drum__gain-slider');
        gainSlider.addEventListener('input', (e) => {
            this.setGain(e.target.value);
        });

        const pitchSlider =DOMElement.querySelector('.drum__pitch-slider');
        pitchSlider.addEventListener('input', e => {
            this.playBackSpeed = e.target.value;
        });

        setCurrentDrum = setCurrentDrum.bind(this);
        const selectBtn = DOMElement.querySelector('.drum__select-btn');
        selectBtn.addEventListener('click', () => {
            setCurrentDrum();
        });
        
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