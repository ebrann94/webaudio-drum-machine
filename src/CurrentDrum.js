import { renderSequencerPads } from "./views/sequencer-view";
import { Drums } from './index';

function CurrentDrum(drum) {
    this.drum = drum || null;
    this.domEl = null;
}

CurrentDrum.prototype.set = function(drumElement) {
    const newDrumName = drumElement.dataset.name;
    if (this.domEl) {
        this.domEl.classList.remove('drum--selected');
    }
    this.drum = Drums[newDrumName];
    drumElement.classList.add('drum--selected');
    this.domEl = drumElement;
    renderSequencerPads(this.drum.sequence);
};

export default CurrentDrum;