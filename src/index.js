import Drum from './Drum';
import Clock from './Clock';

function createAudioContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    return new AudioContext();
}
    
const audioContext = createAudioContext();
if (audioContext) {
    console.log('Audio Context Created', audioContext);
}

const beatReadout = document.getElementById('beatReadout')

const Kick= new Drum('/sounds/909-kick.wav', audioContext, null);
const Snare = new Drum('/sounds/909-snare.wav', audioContext, null);

document.getElementById('play-kick').addEventListener('mousedown', Kick.play);
document.getElementById('play-snare').addEventListener('mousedown', Snare.play);

const drums = [Kick, Snare];

let currentDrum = Kick;

function setCurrentDrum(newDrum) {
    currentDrum = newDrum;

    sequencerPads.forEach((pad, i) => {
        if (currentDrum.sequence[i]) {
            pad.style.border = 'solid 1px blue';
        } else {
            pad.style.border = 'none';
        }
    });
}

document.getElementById('choose-kick').addEventListener('click', () => {
    // currentDrum = Kick;
    setCurrentDrum(Kick);
});

document.getElementById('choose-snare').addEventListener('click', () => {
    // currentDrum = Snare;
    setCurrentDrum(Snare);
});

const sequencerPads = document.querySelectorAll('.sequencer__beat');

sequencerPads.forEach((pad, i) => {
    pad.addEventListener('click', () => {
        currentDrum.setSequence(i);
        console.log(currentDrum.sequence);
    });
});

function audioUpdate(beatNumber) {
    Kick.shouldPlay(beatNumber);
    Snare.shouldPlay(beatNumber);
}

let prevNote = 15;

function uiUpdate(drawNote) {
    beatReadout.textContent = drawNote;

    sequencerPads[drawNote].style.color = 'green';
    sequencerPads[prevNote].style.color = 'black';

    prevNote = drawNote;
}

const MainClock = new Clock(audioUpdate, uiUpdate, audioContext);

document.querySelector('.start-btn').addEventListener('click', MainClock.start);
document.querySelector('.stop-btn').addEventListener('click', MainClock.stop);

