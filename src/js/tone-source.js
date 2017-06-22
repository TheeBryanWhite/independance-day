let audioContext = null;
let beatsPerMeasure = 4;
let tapLength = 0.05;
let beepLength = 0.1;

let measure = 0;
let beat = 0;

audioContext = new (window.AudioContext || window.webkitAudioContext)();
let analyser = audioContext.createAnalyser();
analyser.connect(audioContext.destination);
var bufferLength = analyser.frequencyBinCount;
var waveformData = new Float32Array(bufferLength);
var frequencyData = new Uint8Array(16);

let whiteNoise = generateWhiteNoiseBuffer();

function generateWhiteNoiseBuffer(){
    let buffer = audioContext.createBuffer(1, audioContext.sampleRate, audioContext.sampleRate);
    let output = buffer.getChannelData(0);

    for(var i=0; i < audioContext.sampleRate; i++){
        output[i] = (Math.random() * 2) - 1;
    }

    return buffer;
}

export function beep(frequency){
    let o = audioContext.createOscillator();
    o.connect(analyser);
    // o.connect(audioContext.destination);
    o.frequency.value = frequency;
    o.start(audioContext.currentTime);
    o.stop(audioContext.currentTime + beepLength);
}

export function tap(){
    let t = audioContext.createBufferSource();
    // t.connect(audioContext.destination);
    t.connect(analyser);
    t.buffer = whiteNoise;
    t.start(audioContext.currentTime);
    t.stop(audioContext.currentTime + tapLength);
}

export function getWaveform(){
    analyser.getFloatTimeDomainData(waveformData);
    return waveformData;
}

export function getFrequencies(){
    analyser.getByteFrequencyData(frequencyData);
    return frequencyData;
}
