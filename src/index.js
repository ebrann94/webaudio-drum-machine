import './styles/base.css';
import './styles/sequencer.css';
import './styles/drum.css';

import Clock from './Clock';
import Drums from './setupDrums';
import audioContext from './setupAudioContext';


let currentDrum = Drums[0];
currentDrum.DOMElement.style.background = 'lightgreen';

export function setCurrentDrum() {
    currentDrum.DOMElement.style.background = 'none';
    currentDrum = this;
    currentDrum.DOMElement.style.background = 'lightgreen';
    renderSequencerPads();
}

const sequencerPads = document.querySelectorAll('.pad');
const padBtns = document.querySelectorAll('.pad__btn');
// Rerenders the sequencers pads to show the current drum's sequence
function renderSequencerPads() {
    sequencerPads.forEach((pad, i) => {
        if (currentDrum.sequence[i]) {
            padBtns[i].classList.add('pad__btn--will-play');
        } else {
            padBtns[i].classList.remove('pad__btn--will-play');
        }
    });
}

sequencerPads.forEach((pad, i) => {
    pad.addEventListener('click', () => {
        currentDrum.setSequence(i);
        renderSequencerPads();
    });
});

const indicators = document.querySelectorAll('.pad__indicator');

function audioUpdate(beatNumber) {
    Drums.forEach(drum => {
        drum.shouldPlay(beatNumber);
    });
}


let prevNote = 15;
function uiUpdate(drawNote) {

    indicators[drawNote].classList.add('pad__indicator--playing');
    indicators[prevNote].classList.remove('pad__indicator--playing');

    prevNote = drawNote;
}

const MainClock = new Clock(audioUpdate, uiUpdate, audioContext);

document.querySelector('.start-btn').addEventListener('click', MainClock.start);
document.querySelector('.stop-btn').addEventListener('click', MainClock.stop);

document.querySelector('.tempo__slider').addEventListener('input', (e) => {
    MainClock.setTempo(e.target.value);
});

