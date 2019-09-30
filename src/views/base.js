import {Drums} from "../index";

 export const drumListElements = (function() {
    const drums = document.querySelectorAll('.drum');
    const elements = {
        indicators: {},
        drums
    };

    drums.forEach(drum => {
        const key = drum.dataset.name;
        elements[key] = drum;
        elements.indicators[key] = drum.querySelector('.drum__indicator');
    });

    return elements
})();

export const drumControlElements = {
    playBtn: document.querySelector('.drum__play-btn'),
    gainSlider: document.querySelector('.drum__gain-slider'),
    pitchSlider: document.querySelector('.drum__pitch-slider')
};

export const sequencerElements = {
    startBtn: document.querySelector('.sequencer__start-btn'),
    pads: document.querySelectorAll('.pad'),
    padBtns: document.querySelectorAll('.pad__btn'),
    indicators: document.querySelectorAll('.pad__indicator')
};

export const tempoElements = {
    readout: document.querySelector('.tempo-readout'),
    tempoSlider: document.querySelector('.tempo__slider')
};

export const clockUiUpdate = (drawNote, prevNote) => {
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
};