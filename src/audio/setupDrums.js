import Drum from './Drum';

// const Kick = new Drum('/sounds/909-kick.wav', audioContext, document.getElementById('kick'), setCurrentDrum);
function setupDrums() {
    const Kick = new Drum('sounds/909-kick.wav');
    const Snare = new Drum('sounds/909-snare.wav');
    const HiHatOpen = new Drum('sounds/909-hihat-open.wav');
    const HiHatClosed = new Drum('sounds/909-hihat-closed.wav');
    const Clap = new Drum('sounds/909-clap.wav');

    return {
        Kick,
        Snare,
        HiHatOpen,
        HiHatClosed,
        Clap
    }
}

export default setupDrums;