import { sequencerElements } from './base';

export const renderSequencerPads = sequence => {
    sequencerElements.padBtns.forEach((padBtn, i) => {
        if (sequence[i]) {
            padBtn.classList.add('pad__btn--will-play');
        } else {
            padBtn.classList.remove('pad__btn--will-play');
        }
    });
};

export const renderSequencerIndicators = (drawNote, prevNote) => {
    sequencerElements.indicators[drawNote].classList.add('indicator-on');
    sequencerElements.indicators[prevNote].classList.remove('indicator-on');
};