import './styles/main.scss';

import createAudioContext from './setupAudioContext';
import CurrentDrum from './CurrentDrum';
import Clock from './Clock';
import setupDrums from './setupDrums';

window.audioCtx = createAudioContext();

const drumListElements = {
    drums: document.querySelectorAll('.drum'),
    indicators: document.querySelectorAll('.drum__indicator')
};

const drumControlElements = {
    playBtn: document.querySelector('.drum__play-btn'),
    gainSlider: document.querySelector('.drum__gain-slider'),
    pitchSlider: document.querySelector('.drum__pitch-slider')
};

const sequencerElements = {
    startBtn: document.querySelector('.sequencer__start-btn'),
    pads: document.querySelectorAll('.pad'),
    padBtns: document.querySelectorAll('.pad__btn'),
    indicators: document.querySelectorAll('.pad__indicator')
};

export const Drums = setupDrums();
window.currentDrum = new CurrentDrum(Drums['Kick']);

// Re-renders the sequencers pads to show the current drum's sequence
export function renderSequencerPads() {
    sequencerElements.pads.forEach((pad, i) => {
        if (currentDrum.drum.sequence[i]) {
            sequencerElements.padBtns[i].classList.add('pad__btn--will-play');
        } else {
            sequencerElements.padBtns[i].classList.remove('pad__btn--will-play');
        }
    });
}

sequencerElements.pads.forEach((pad, i) => {
    pad.addEventListener('click', () => {
        currentDrum.drum.setSequence(i);
        renderSequencerPads();
    });
});

function clockUiUpdate(drawNote, prevNote) {
    sequencerElements.indicators[drawNote].classList.add('indicator-on');
    sequencerElements.indicators[prevNote].classList.remove('indicator-on');

    drumListElements.indicators.forEach((indicator, i) => {
        const drumName = indicator.closest('.drum').dataset.name;
        if (Drums[drumName].sequence[drawNote]) {
            indicator.classList.add('indicator-on');
            setTimeout(() => {
                indicator.classList.remove('indicator-on');
            }, 100);
        }
    });
}

function clockAudioUpdate(beatNumber) {
    for (let drum in Drums) {
        Drums[drum].shouldPlay(beatNumber);
    }
}

const MainClock = new Clock(clockAudioUpdate, clockUiUpdate);

const toggleRunClock = () => {
    if (MainClock.isPlaying) {
        MainClock.stop();
        sequencerElements.startBtn.textContent = 'START';
        sequencerElements.startBtn.classList.remove('sequencer__start-btn--playing');
    } else {
        MainClock.start();
        sequencerElements.startBtn.textContent ='STOP';
        sequencerElements.startBtn.classList.add('sequencer__start-btn--playing');
    }
};

sequencerElements.startBtn.addEventListener('click', (e) => {
    toggleRunClock();
    e.target.blur();
});

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        sequencerElements.startBtn.classList.add('start-btn-active');
    }
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
        sequencerElements.startBtn.classList.remove('start-btn-active');
        toggleRunClock();
    }
});

drumControlElements.playBtn.addEventListener('click', () => {
   currentDrum.drum.play();
});

drumControlElements.gainSlider.addEventListener('input', (e) => {
    currentDrum.drum.setGain(e.target.value);
});

drumControlElements.pitchSlider.addEventListener('input', (e) => {
    currentDrum.drum.playbackSpeed = e.target.value;
});

drumListElements.drums.forEach(drum => {
    drum.addEventListener('click', () => {
        currentDrum.set(drum);
    });
});

const tempoReadout = document.querySelector('.tempo-readout');
document.querySelector('.tempo__slider').addEventListener('input', (e) => {
    MainClock.setTempo(e.target.value);
    tempoReadout.textContent = e.target.value + ' bpm';
});