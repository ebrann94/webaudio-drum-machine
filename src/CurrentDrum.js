import { renderSequencerPads } from "./index";

function CurrentDrum(drum) {
    this.drum = drum;
    this.drum.DOMElement.classList.add('drum--active');
}

CurrentDrum.prototype.set = function(newDrum) {
    this.drum.DOMElement.classList.remove('drum--active');
    this.drum = newDrum;
    this.drum.DOMElement.classList.add('drum--active');
    renderSequencerPads();
};

export default CurrentDrum;