export const octx = new OfflineAudioContext({
    numberOfChannels: 2,
    length: 44100 * 40,
    sampleRate: 44100,
});

export const ctx = new AudioContext();
