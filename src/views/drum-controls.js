import { drumControlElements } from './base';

export const setControls = (level, pitch) => {
    drumControlElements.gainSlider.value = level;
    drumControlElements.pitchSlider.value = pitch;
};