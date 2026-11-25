// Voice-over script and subtitle cues (seconds on the master timeline).
// The same cues are exported to WebVTT/SRT by tools/make_subs.mjs, so the burned-in subtitles,
// the website's caption track and the voice-over all share one source of truth.
export type Cue = {start: number; end: number; text: string};

/** Voice-over, one entry per line in the brief. `at` = when the line starts. */
export const VO: {id: string; at: number; text: string}[] = [
  {id: 'vo1', at: 0.5, text: 'Har I data i flere systemer – men mangler ét samlet overblik?'},
  {id: 'vo2', at: 7.3, text: 'Jeg hjælper jer med at få Power BI til at skabe reel værdi.'},
  {id: 'vo3', at: 15.0, text: 'Fra datagrundlag, integrationer og datamodeller til dashboards, der gør det lettere at træffe beslutninger.'},
  {id: 'vo4', at: 23.7, text: 'Jeg kan også overtage, vedligeholde og optimere jeres eksisterende løsninger, så rapporterne fortsat er pålidelige og fungerer i hverdagen.'},
  {id: 'vo5', at: 31.4, text: 'Med erfaring fra at opbygge og drive Power BI-løsninger i stor skala får I en hands-on partner hele vejen.'},
  {id: 'vo6', at: 37.0, text: 'Northbound Data. Komplekse data, gjort enkle.'},
];

/** Subtitle cues: max two lines, max ~42 characters per line. */
export const CUES: Cue[] = [
  {start: 0.5, end: 4.4, text: 'Har I data i flere systemer –\nmen mangler ét samlet overblik?'},
  {start: 7.3, end: 11.2, text: 'Jeg hjælper jer med at få Power BI\ntil at skabe reel værdi.'},
  {start: 15.0, end: 18.3, text: 'Fra datagrundlag, integrationer\nog datamodeller'},
  {start: 18.3, end: 21.6, text: 'til dashboards, der gør det lettere\nat træffe beslutninger.'},
  {start: 23.7, end: 27.5, text: 'Jeg kan også overtage, vedligeholde\nog optimere jeres eksisterende løsninger,'},
  {start: 27.5, end: 31.0, text: 'så rapporterne fortsat er pålidelige\nog fungerer i hverdagen.'},
  {start: 31.4, end: 34.4, text: 'Med erfaring fra at opbygge og drive\nPower BI-løsninger i stor skala'},
  {start: 34.4, end: 36.8, text: 'får I en hands-on partner hele vejen.'},
  {start: 37.0, end: 39.6, text: 'Northbound Data.\nKomplekse data, gjort enkle.'},
];
