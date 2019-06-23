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
function clockUiUpdate(drawNote, prevNote) {
    indicators[drawNote].classList.add('pad__indicator--playing');
    indicators[prevNote].classList.remove('pad__indicator--playing');

    Drums.forEach(drum => {
        if (drum.sequence[drawNote]) {
            drum.indicator.classList.add('drum__indicator--active');
            setTimeout(() => {
                drum.indicator.classList.remove('drum__indicator--active');
            }, 100);
        }
    });
}

function clockAudioUpdate(beatNumber) {
    Drums.forEach(drum => {
        drum.shouldPlay(beatNumber);
    });
}

const MainClock = new Clock(clockAudioUpdate, clockUiUpdate);

const toggleRunClock = () => {
    if (MainClock.isPlaying) {
        MainClock.stop();
        startBtn.textContent = 'START';
        startBtn.classList.remove('sequencer__start-btn--playing');
    } else {
        MainClock.start();
        startBtn.textContent ='STOP';
        startBtn.classList.add('sequencer__start-btn--playing');
    }
};

const startBtn = document.querySelector('.sequencer__start-btn');
startBtn.addEventListener('click', (e) => {
    toggleRunClock();
    e.target.blur();
});

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        startBtn.classList.add('start-btn-active');
    }
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
        startBtn.classList.remove('start-btn-active');
        toggleRunClock();
    }
});

const tempoReadout = document.querySelector('.tempo-readout');
document.querySelector('.tempo__slider').addEventListener('input', (e) => {
    MainClock.setTempo(e.target.value);
    tempoReadout.textContent = e.target.value + ' bpm';
});