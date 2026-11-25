// Writes the Power BI video's subtitle cues (src/pbi/script.ts) as WebVTT and SRT.
//   node tools/make_subs.mjs out/
import {readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const src = readFileSync(new URL('../src/pbi/script.ts', import.meta.url), 'utf8');
const block = src.slice(src.indexOf('export const CUES'));
const cues = [...block.matchAll(/\{start: ([\d.]+), end: ([\d.]+), text: '((?:[^'\\]|\\.)*)'\}/g)].map((m) => ({
  start: +m[1], end: +m[2], text: m[3].replace(/\\n/g, '\n').replace(/\\'/g, "'"),
}));

const ts = (s, sep) => {
  const ms = Math.round(s * 1000);
  const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
  const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
  const sec = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
  return `${h}:${m}:${sec}${sep}${String(ms % 1000).padStart(3, '0')}`;
};

const out = process.argv[2] ?? 'out';
writeFileSync(join(out, 'northbound-data-powerbi.da.vtt'), 'WEBVTT\n\n' + cues.map((c, i) => `${i + 1}\n${ts(c.start, '.')} --> ${ts(c.end, '.')}\n${c.text}\n`).join('\n'));
writeFileSync(join(out, 'northbound-data-powerbi.da.srt'), cues.map((c, i) => `${i + 1}\n${ts(c.start, ',')} --> ${ts(c.end, ',')}\n${c.text}\n`).join('\n'));
console.log(`${cues.length} cues written to ${out}`);
