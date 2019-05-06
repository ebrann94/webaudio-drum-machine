import Drum from './Drum';
import audioContext from './setupAudioContext';

const Kick = new Drum('/sounds/909-kick.wav', audioContext, document.getElementById('kick'));
const Snare = new Drum('/sounds/909-snare.wav', audioContext, document.getElementById('snare'));
const HiHat = new Drum('/sounds/909-hihat.wav', audioContext, document.getElementById('hihat'));

export default [Kick, Snare, HiHat];