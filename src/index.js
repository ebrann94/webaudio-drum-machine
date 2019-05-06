import './styles/sequencer.css';
// import './styles/drum.css';

import Clock from './Clock';
import Drums from './setupDrums';
import audioContext from './setupAudioContext';

let currentDrum = Drums[0];

function renderSequencerPads() {
    sequencerPads.forEach((pad, i) => {
        if (currentDrum.sequence[i]) {
            pad.classList.add('will-play');
        } else {
            pad.classList.remove('will-play');
        }
    });
}

document.querySelectorAll('.drum__select-btn').forEach((btn, i) => {
    btn.addEventListener('click', () => {
        currentDrum = Drums[i];
        renderSequencerPads();
    });
});

const sequencerPads = document.querySelectorAll('.sequencer__beat');

sequencerPads.forEach((pad, i) => {
    pad.addEventListener('click', () => {
        currentDrum.setSequence(i);
        renderSequencerPads();
    });
});

function audioUpdate(beatNumber) {
    Drums.forEach(drum => {
        drum.shouldPlay(beatNumber);
    });
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

