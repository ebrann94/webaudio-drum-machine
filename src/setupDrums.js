import Drum from './Drum';

// const Kick = new Drum('/sounds/909-kick.wav', audioContext, document.getElementById('kick'), setCurrentDrum);
function setupDrums() {
    const Kick = new Drum('sounds/909-kick.wav');
    const Snare = new Drum('sounds/909-snare.wav');
    const HiHat = new Drum('sounds/909-hihat.wav');

    return {
        Kick,
        Snare,
        HiHat
    }
}

export default setupDrums;