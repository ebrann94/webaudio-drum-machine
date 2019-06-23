import Drum from './Drum';

// const Kick = new Drum('/sounds/909-kick.wav', audioContext, document.getElementById('kick'), setCurrentDrum);
function setupDrums() {
    const Kick = new Drum('sounds/909-kick.wav', document.getElementById('kick'));
    const Snare = new Drum('sounds/909-snare.wav', document.getElementById('snare'));
    const HiHat = new Drum('sounds/909-hihat.wav', document.getElementById('hihat'));

    return [Kick, Snare, HiHat];
}

export default setupDrums;