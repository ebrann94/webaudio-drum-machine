export default function createClock(audioCallback, uiCallback, audioContext) {
    const lookahead = 25.0;
    const scheduleAheadTime = 0.1;
    let currentNote = 0;
    let lastNoteDrawn = 15;
    let nextNoteTime = 0.0;

    let tempo = 128;

    let notesInQueue = [];

    let isPlaying = false;
    
    function nextNote() {
        const secondsPerBeat = 60.0 / (tempo * 4);

        nextNoteTime += secondsPerBeat;

        currentNote++;
        if (currentNote === 16) {
            currentNote = 0;
        }
    }

    function scheduleNote(beatNumber, time) {
        notesInQueue.push({ note: beatNumber, time: time });
        // Audio callback -----------------------------------------
        audioCallback(beatNumber);
    }

    function scheduler() {
        while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
            scheduleNote(currentNote, nextNoteTime);
            nextNote();
        }
        // If the nextNoteTime has not been passed it will trigger another timeout.
        if (isPlaying) {
            setTimeout(scheduler, lookahead);
        }
    }

    function draw() {
        let drawNote = lastNoteDrawn;
        let currentTime = audioContext.currentTime;

        while (notesInQueue.length && notesInQueue[0].time < currentTime) {
            drawNote = notesInQueue[0].note;
            notesInQueue.splice(0, 1);
        }

        if (lastNoteDrawn !== drawNote) {
            // UI Callback -----------------------------------------------
            uiCallback(drawNote, lastNoteDrawn);
            lastNoteDrawn = drawNote;
        }

        if (isPlaying) {
            requestAnimationFrame(draw);
        }
    }

    // Return public methods
    return {
        start() {
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            isPlaying = true;
            currentNote = 0;
            nextNoteTime = audioCtx.currentTime + scheduleAheadTime;
            notesInQueue = [];
            scheduler();
            requestAnimationFrame(draw);            
        },
        stop() {
            isPlaying = false;
        },
        setTempo(newTempo) {
            tempo = newTempo;
        },
        isPlaying() {
            return isPlaying
        }
    }
}