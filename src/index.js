import './styles/main.scss';

import createAudioContext from './audio/setupAudioContext';
import CurrentDrum from './CurrentDrum';
import Clock from './audio/Clock';
import setupDrums from './audio/setupDrums';
import  {
    drumListElements,
    drumControlElements,
    sequencerElements,
    tempoElements
} from './views/base';
import { renderSequencerPads, renderSequencerIndicators } from './views/sequencer-view';
import { renderDrumIndicators, flashIndicator } from './views/drum-list-view';
import { setControls } from "./views/drum-controls";

window.audioCtx = createAudioContext();

export const Drums = setupDrums();
window.currentDrum = new CurrentDrum();
currentDrum.set(document.querySelector('.drum[data-name="Kick"]'));

const state = {
    currentDrum: Drums['Kick'],
    currentDrumKey: 'Kick'
};
//
// const setCurrentDrum = (drumName) => {
//     state.currentDrum = Drums[drumName];
// };

sequencerElements.pads.forEach((pad, i) => {
    pad.addEventListener('click', () => {
        currentDrum.drum.setSequence(i);
        renderSequencerPads(currentDrum.drum.sequence);
    });
});

function clockUiUpdate(drawNote, prevNote) {
    renderSequencerIndicators(drawNote, prevNote);

    for (let key in Drums) {
        if (Drums[key].sequence[drawNote]) {
            flashIndicator(key);
        }
    }
}

function clockAudioUpdate(beatNumber) {
    for (let key in Drums) {
        Drums[key].shouldPlay(beatNumber);
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
   flashIndicator(state.currentDrumKey);
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
        setControls(currentDrum.drum.gainNode.gain.value, currentDrum.drum.playbackSpeed);
        state.currentDrumKey = drum.dataset.name;
    });
});

tempoElements.tempoSlider.addEventListener('input', (e) => {
    MainClock.setTempo(e.target.value);
    tempoElements.readout.textContent = e.target.value + ' bpm';
});