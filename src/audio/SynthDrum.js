function SynthDrum () {
    this.oscNode = audioCtx.createOscillator()
    this.oscNode.frequency.setValueAtTime(440, audioCtx.currentTime)
    this.oscNode.start()
    
    this.gainNode = audioCtx.createGain()
    this.gainNode.gain.value = 0

    this.gainNoe.connect(this.oscNode)
    audioCtx.connect(this.gainNode)
}

SynthDrum.prototype.play = function () {
    this.gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 10)

    this.gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 100)
}