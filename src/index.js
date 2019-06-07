import './styles/base.css';
import './styles/sequencer.css';
import './styles/drum.css';

import createAudioContext from './setupAudioContext';
import CurrentDrum from './CurrentDrum';
import Clock from './Clock';
import setupDrums from './setupDrums';

window.audioCtx = createAudioContext();

const Drums = setupDrums();
window.currentDrum = new CurrentDrum(Drums[0]);

const sequencerPads = document.querySelectorAll('.pad');
const padBtns = document.querySelectorAll('.pad__btn');
// Re-renders the sequencers pads to show the current drum's sequence
export function renderSequencerPads() {
    sequencerPads.forEach((pad, i) => {
        if (currentDrum.drum.sequence[i]) {
            padBtns[i].classList.add('pad__btn--will-play');
        } else {
            padBtns[i].classList.remove('pad__btn--will-play');
        }
    });
}

sequencerPads.forEach((pad, i) => {
    pad.addEventListener('click', () => {
        currentDrum.drum.setSequence(i);
        renderSequencerPads();
    });
});

const indicators = document.querySelectorAll('.pad__indicator');
function uiUpdate(drawNote, prevNote) {
    indicators[drawNote].classList.add('pad__indicator--playing');
    indicators[prevNote].classList.remove('pad__indicator--playing');
}

function audioUpdate(beatNumber) {
    Drums.forEach(drum => {
        drum.shouldPlay(beatNumber);
    });
}

// const MainClock = new Clock(audioUpdate, uiUpdate, audioContext);
const MainClock = new Clock(audioUpdate, uiUpdate);

const startBtn = document.querySelector('.start-btn');
startBtn.addEventListener('click', (e) => {
    MainClock.start();
    e.target.blur();
});

const stopBtn = document.querySelector('.stop-btn');
stopBtn.addEventListener('click', (e) => {
    MainClock.stop();
    e.target.blur();
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
        if (MainClock.isPlaying) {
            MainClock.stop();
        } else {
            MainClock.start();
        }
    }
});

const tempoReadout = document.querySelector('.tempo-readout');
document.querySelector('.tempo__slider').addEventListener('input', (e) => {
    MainClock.setTempo(e.target.value);
    tempoReadout.textContent = e.target.value + ' bpm';
});