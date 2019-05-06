import './styles/sequencer.css';
// import './styles/drum.css';

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

const Kick= new Drum('/sounds/909-kick.wav', audioContext, document.getElementById('kick'));
const Snare = new Drum('/sounds/909-snare.wav', audioContext, document.getElementById('snare'));


const drums = [Kick, Snare];

let currentDrum = Kick;

function setCurrentDrum(newDrum) {
    currentDrum = newDrum;
    renderSequencerPads();
}

function renderSequencerPads() {
    sequencerPads.forEach((pad, i) => {
        if (currentDrum.sequence[i]) {
            pad.classList.add('will-play');
        } else {
            pad.classList.remove('will-play');
        }
    });
}

document.getElementById('select-kick').addEventListener('click', () => {
    setCurrentDrum(Kick);
});

document.getElementById('select-snare').addEventListener('click', () => {
    setCurrentDrum(Snare);
});

const sequencerPads = document.querySelectorAll('.sequencer__beat');

sequencerPads.forEach((pad, i) => {
    pad.addEventListener('click', () => {
        currentDrum.setSequence(i);
        renderSequencerPads();
    });
});

function audioUpdate(beatNumber) {
    Kick.shouldPlay(beatNumber);
    Snare.shouldPlay(beatNumber);
}

let prevNote = 15;

function uiUpdate(drawNote) {

    sequencerPads[drawNote].classList.add('playing');
    sequencerPads[prevNote].classList.remove('playing');

    prevNote = drawNote;
}

const MainClock = new Clock(audioUpdate, uiUpdate, audioContext);

document.querySelector('.start-btn').addEventListener('click', MainClock.start);
document.querySelector('.stop-btn').addEventListener('click', MainClock.stop);

document.querySelector('.tempo__slider').addEventListener('input', (e) => {
    MainClock.setTempo(e.target.value);
});

