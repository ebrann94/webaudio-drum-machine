class Clock {
    constructor(audioCallback, uiCallback, audioContext) {

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

        this.audioContext = audioContext;

        this.scheduler = this.scheduler.bind(this);
        this.draw = this.draw.bind(this);

        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
    }

    setTempo(newTempo) {
        this.tempo = newTempo;
    }

    start() {
        if (this.audioContext.state == 'suspended') {
            this.audioContext.resume();
        }
        this.isPlaying = true;
        this.currentNote = 0;
        this.nextNoteTime = this.audioContext.currentTime + this.scheduleAheadTime;
        this.notesInQueue = [];
        this.scheduler();
        requestAnimationFrame(this.draw);
    }

    stop() {
        this.isPlaying = false;
    }

    nextNote() {
        const secondsPerBeat = 60.0 / (this.tempo * 4);

        this.nextNoteTime += secondsPerBeat;

        this.currentNote++;
        if (this.currentNote === 16) {
            this.currentNote = 0;
        }
    }

    scheduleNote(beatNumber, time) {
        this.notesInQueue.push({ note: beatNumber, time: time });
        // Audio callback -----------------------------------------
        this.audioCallback(beatNumber);
    }

    scheduler() {
        // When the audio context time is passed the next note time it triggers another scheduling.
        // And advances to the next note.
        while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
            this.scheduleNote(this.currentNote, this.nextNoteTime);
            this.nextNote();
        }
        // If the nextNoteTime has not been passed it will trigger another timeout.
        if (this.isPlaying) {
            window.setTimeout(this.scheduler, this.lookahead);
        }
    }

    

    draw() {
        let drawNote = this.lastNoteDrawn;
        let currentTime = this.audioContext.currentTime;

        while (this.notesInQueue.length && this.notesInQueue[0].time < currentTime) {
            drawNote = this.notesInQueue[0].note;
            this.notesInQueue.splice(0, 1);
        }

        if (this.lastNoteDrawn != drawNote) {
            // UI Callback -----------------------------------------------
            this.uiCallback(drawNote);
            this.lastNoteDrawn = drawNote;
        }

        if (this.isPlaying) {
            requestAnimationFrame(this.draw);
        }
    }
}

export default Clock;