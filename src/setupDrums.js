import Drum from './Drum';
import audioContext from './setupAudioContext';
import { setCurrentDrum } from './index';

const Kick = new Drum('/sounds/909-kick.wav', audioContext, document.getElementById('kick'), setCurrentDrum);
const Snare = new Drum('/sounds/909-snare.wav', audioContext, document.getElementById('snare'), setCurrentDrum);
const HiHat = new Drum('/sounds/909-hihat.wav', audioContext, document.getElementById('hihat'), setCurrentDrum);

export default [Kick, Snare, HiHat];