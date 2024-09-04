// Constants
export const SYNTH_BORDERS = 4;
export const SYNTH_TITLEBAR_HEIGHT = 20;

// Get frequency in hertz from MIDI note value
export function noteHz(note: number) {
    return (440 / 32) * (2 ** ((note - 9) / 12));
}

export function pointWithin(x: number, y: number,
    rx: number, ry: number,
    rw: number, rh: number,) {
    return ((x >= rx) && (x < rx + rw)) &&
        ((y >= ry) && (y < ry + rh));
}

export function isBlackKey(note: number) {
    return [
        //	C#,	D#, F#, G#, A#
        1, 3, 6, 8, 10
    ].includes(note % 12);
}

export function whiteKeyBelow(note: number) {
    if (!isBlackKey(note)) return note;

    const rel = note % 12;

    const offset = [3, 10].includes(rel) ? 1 : -1;

    return note + offset;
}

