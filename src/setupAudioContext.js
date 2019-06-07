const createAudioContext = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    return new AudioContext();
};

export default createAudioContext;
