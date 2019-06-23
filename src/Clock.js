function Clock(audioCallback, uiCallback) {
    this.lookahead = 25.0;
    this.scheduleAheadTime = 0.1;
    this.currentNote = 0;
    this.nextNoteTime = 0.0;

    this.tempo = 128;

    this.notesInQueue = [];

    this.lastNoteDrawn = 15;
    this.isPlaying = false;

    this.audioCallback = audioCallback;
    this.uiCallback = uiCallback;

   // Bind all prototype methods ti this
    for (let key in this.__proto__) {
        this.__proto__[key] = this.__proto__[key].bind(this);
    }
}

Clock.prototype.setTempo = function(newTempo) {
    this.tempo = newTempo;
};

Clock.prototype.start = function() {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    this.isPlaying = true;
    this.currentNote = 0;
    this.nextNoteTime = audioCtx.currentTime + this.scheduleAheadTime;
    this.notesInQueue = [];
    this.scheduler();
    requestAnimationFrame(this.draw);
};

Clock.prototype.stop = function() {
    this.isPlaying = false;
};

Clock.prototype.nextNote = function() {
    const secondsPerBeat = 60.0 / (this.tempo * 4);

    this.nextNoteTime += secondsPerBeat;

    this.currentNote++;
    if (this.currentNote === 16) {
        this.currentNote = 0;
    }
};

Clock.prototype.scheduleNote = function(beatNumber, time) {
    this.notesInQueue.push({ note: beatNumber, time: time });
    // Audio callback -----------------------------------------
    this.audioCallback(beatNumber);
};

Clock.prototype.scheduler = function() {
    while (this.nextNoteTime < audioCtx.currentTime + this.scheduleAheadTime) {
        this.scheduleNote(this.currentNote, this.nextNoteTime);
        this.nextNote();
    }
    // If the nextNoteTime has not been passed it will trigger another timeout.
    if (this.isPlaying) {
        setTimeout(this.scheduler, this.lookahead);
    }
};

Clock.prototype.draw = function() {
    let drawNote = this.lastNoteDrawn;
    let currentTime = audioCtx.currentTime;

    while (this.notesInQueue.length && this.notesInQueue[0].time < currentTime) {
        drawNote = this.notesInQueue[0].note;
        this.notesInQueue.splice(0, 1);
    }

    if (this.lastNoteDrawn !== drawNote) {
        // UI Callback -----------------------------------------------
        this.uiCallback(drawNote, this.lastNoteDrawn);
        this.lastNoteDrawn = drawNote;
    }

    if (this.isPlaying) {
        requestAnimationFrame(this.draw);
    }
};

export default Clock;