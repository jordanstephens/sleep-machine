import _ from 'lodash';
import { VoseAliasMethod } from 'vose-alias-method';
import { EventEmitter } from 'events';

const Tone = require('tone');

export type Waveform = 'sine' | 'square' | 'triangle' | 'sawtooth'
export type DelayTime = '1m' | '2n' | '4n' | '4t' | '8n' | '8t'

export interface PartialParams {
  tempo?: number;
  waveform?: Waveform;
  delay_wet?: number;
  delay_time?: DelayTime;
  delay_feedback?: number;
  chorus_frequency?: number;
  chorus_delay_time?: number;
  chorus_depth?: number;
  width?: number;
}

export interface Params {
  tempo: number;
  waveform: Waveform;
  delay_wet: number;
  delay_time: DelayTime;
  delay_feedback: number;
  chorus_frequency: number;
  chorus_delay_time: number;
  chorus_depth: number;
  width: number;
}

const DEFAULT_PARAMS: Params = {
  tempo: 90,
  waveform: 'sine',
  delay_wet: 0.5,
  delay_time: '4n',
  delay_feedback: 0.33,
  chorus_frequency: 4,
  chorus_delay_time: 1.5,
  chorus_depth: 0.25,
  width: 0.1,
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

export default class Machine extends EventEmitter {
  generators: VoseAliasMethod[];
  probabilities: number[][];
  pattern: ChordPattern;
  current: number;
  range: number;
  synth: Synth;

  constructor(probabilities: number[][], params: PartialParams = {}) {
    super();
    params = { ...DEFAULT_PARAMS, ...params }
    this.synth = new Synth(params as Params);
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
      waveform: this.synth.waveform,
      delay_wet: this.synth.delay.wet.value,
      delay_time: Tone.Time(this.synth.delay.delayTime.value).toNotation(),
      delay_feedback: this.synth.delay.feedback.value,
      chorus_frequency: this.synth.chorus.frequency.value,
      chorus_delay_time: this.synth.chorus.delayTime,
      chorus_depth: this.synth.chorus.depth,
      width: this.synth.width,
    }
  }

  updateParams = (_params: PartialParams = {}) => {
    const params = { ...this.params, ..._params };
    Tone.Transport.bpm.value = params.tempo;
    this.synth.update(params);
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
  delay: any;
  chorus: any;
  voice: any;
  width: number;
  waveform: Waveform;

  constructor(params: Params) {
    this.width = params.width;
    this.delay = new Tone.PingPongDelay(params.delay_time, params.delay_feedback)
    this.delay.wet.value = params.delay_wet;
    this.chorus = new Tone.Chorus(params.chorus_frequency, params.chorus_delay_time, params.chorus_depth);
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
    this.voice.chain(this.chorus, this.delay, Tone.Master);
  }

  update(params: Params) {
    this.width = params.width;
    this.voice.set({
      oscillator: { type: params.waveform }
    })

    this.delay.wet.value = params.delay_wet;
    this.delay.delayTime.value = params.delay_time;
    this.delay.feedback.value = params.delay_feedback;
    this.chorus.frequency.value = params.chorus_frequency;
    this.chorus.delayTime = params.chorus_delay_time;
    this.chorus.depth = params.chorus_depth;
  }

  trigger(note: number | string, velocity: number = 0.1) {
    this.voice.triggerAttackRelease(note, this.width, undefined, velocity);
  }
}
