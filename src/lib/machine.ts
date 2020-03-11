import _ from 'lodash';
import { VoseAliasMethod } from 'vose-alias-method';
import { EventEmitter } from 'events';

const Tone = require('tone');

export type Waveform = 'sine' | 'square' | 'triangle' | 'sawtooth'

const DEFAULT_PARAMS = {
  tempo: 90,
  waveform: 'sine' as Waveform
};

const C4 = 48;
const MAJOR_TRIAD = [0, 4, 7];
const MINOR_TRIAD = [0, 3, 7];
const DIMINISHED_TRIAD = [0, 3, 6];
const SCALE_DEGREE_TRIADS = [
  MAJOR_TRIAD,
  MINOR_TRIAD,
  MINOR_TRIAD,
  MAJOR_TRIAD,
  MAJOR_TRIAD,
  MINOR_TRIAD,
  DIMINISHED_TRIAD
];

const ROOT_OFFSETS = [0, 2, 4, 5, 7, 9, 11];

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);

export interface Params {
  tempo?: number;
  waveform?: Waveform
}

export default class Machine extends EventEmitter {
  generators: VoseAliasMethod[];
  probabilities: number[][];
  pattern: ChordPattern;
  current: number;
  range: number;
  synth: Synth;

  constructor(probabilities: number[][], params: Params = {}) {
    super();
    params = { ...DEFAULT_PARAMS, ...params }
    this.synth = new Synth(params);
    this.current = 0;
    this.range = 2;
    this.pattern = new ChordPattern(this.current, this.range);
    this.probabilities = [];
    this.generators = [];
    this.updateParams(params);
    this.updateProbabilities(probabilities);

    Tone.Transport.latencyHint = "playback"
    Tone.Transport.loop = true;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = '1m';

    // half way through a loop
    Tone.Transport.scheduleRepeat((t: number) => {
      Tone.Draw.schedule(() => {
        const next = this.next(this.current);
        this.emit('select', next, this.current)
        this.current = next;
      }, t);
    }, '1:0:0', '0:2:0');

    // start of each loop
    Tone.Transport.scheduleRepeat((t: number) => {
      Tone.Draw.schedule(() => {
        this.pattern = new ChordPattern(this.current, this.range);
        this.emit('change', this.pattern, this.current)
      }, t);
    }, '1:0:0', '0:0:0');

    // quarter notes
    Tone.Transport.scheduleRepeat((t: number) => {
      Tone.Draw.schedule(() => {
        const { position } = Tone.Transport
        const beat = parseInt(position.split(':')[1], 10);
        this.emit('beat', beat);
      }, t);
    }, '0:0:1', '0:0:0');

    // eighth notes
    Tone.Transport.scheduleRepeat((t: number) => {
      const i = rand(0, this.pattern.notes.length)
      const note = this.pattern.notes[i];
      this.synth.trigger(note);
    }, '0:0:2', '0:0:0');
  }

  get params(): Params {
    return {
      tempo: Tone.Transport.bpm.value,
      waveform: this.synth.waveform
    }
  }

  updateParams = (params: Params = {}) => {
    if (params.tempo) {
      Tone.Transport.bpm.value = params.tempo;
    }
    if (params.waveform) {
      this.synth = new Synth(params);
    }
  }

  updateProbabilities(probabilities: number[][]) {
    this.probabilities = probabilities;
    this.generators = probabilities.map((col) => new VoseAliasMethod(col));
  }

  next(i: number) {
    return this.generators[i].next();
  }

  start() {
    if (Tone.Transport.state === 'started') return;
    Tone.Transport.start();
  }

  stop() {
    Tone.Transport.stop();
  }
}

class ChordPattern {
  notes: number[];
  constructor(index: number, range: number) {
    const root = C4 + ROOT_OFFSETS[index];
    const degrees = SCALE_DEGREE_TRIADS[index];
    const shifts = new Array(range).fill(0).map((x, i) => i);
    this.notes = _.flatten(
      shifts.map((delta) => degrees.map((d) => root + d + (delta * 12)))
    ).map((note) => Tone.Frequency(note, 'midi').toNote());
  }
}

class Synth {
  voice: any;
  width: number;
  waveform: Waveform;

  constructor(params: Params) {
    const delay = new Tone.FeedbackDelay('4n', 0.33)
    const chorus = new Tone.Chorus(4, 1.5, 0.25);
    this.waveform = params.waveform || DEFAULT_PARAMS.waveform;
    this.voice = new Tone.PolySynth(4, Tone.Synth, {
      oscillator: { type: params.waveform }
    });
    this.voice.set({
      envelope: {
        attack: 0.01,
        sustain: 0.1,
        release: 0.5,
        decay: 0.5
      }
    })
    this.voice.chain(chorus, delay, Tone.Master);
    this.width = 0.1;
  }

  trigger(note: number | string, velocity: number = 0.1) {
    this.voice.triggerAttackRelease(note, this.width, undefined, velocity);
  }
}
