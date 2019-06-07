import Drum from './Drum';
import { setCurrentDrum } from './index';

// const Kick = new Drum('/sounds/909-kick.wav', audioContext, document.getElementById('kick'), setCurrentDrum);
const Kick = new Drum('/sounds/909-kick.wav', document.getElementById('kick'), setCurrentDrum);
const Snare = new Drum('/sounds/909-snare.wav', document.getElementById('snare'), setCurrentDrum);
const HiHat = new Drum('/sounds/909-hihat.wav', document.getElementById('hihat'), setCurrentDrum);

export default [Kick, Snare, HiHat];