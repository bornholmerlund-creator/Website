// 0:00–0:06  The problem: fast, controlled close-up cuts of scattered business data, then pull back.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, DeepBg, EXPO, F, INOUT, Kicker, MaskLine, Sfx, lerp, useProg, useSec} from '../kit';
import {SCATTER, WINDOWS, WH, WW} from './Windows';

const SHOT = 0.95;          // length of each close-up cut
const PULL = 4 * SHOT;      // 3.8 s: camera pulls back to show everything at once
// close-up framing per shot: where the (scaled) window sits and how it moves during the cut
const FRAMING = [
  {x: 820, y: 170, s: 1.75, dx: -40, dy: -10, r: -1.5},
  {x: 860, y: 210, s: 1.7, dx: -30, dy: 20, r: 1.2},
  {x: 840, y: 150, s: 1.8, dx: -50, dy: 0, r: -0.8},
  {x: 870, y: 200, s: 1.72, dx: -35, dy: -15, r: 1.6},
];

export const S1Problem: React.FC = () => {
  const s = useSec();
  const p = useProg();
  const shot = Math.min(3, Math.floor(s / SHOT));
  const inShot = s - shot * SHOT;
  const pull = p(PULL, 0.9, EXPO);
  const showClose = s < PULL + 0.05;
  const cutFlash = s < PULL ? Math.max(0, 1 - inShot / 0.14) : 0;
  const scrim = 1 - p(PULL + 0.2, 0.6) * 0.35;

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DeepBg />

      {/* close-up cuts */}
      {showClose && (() => {
        const Win = WINDOWS[shot];
        const f = FRAMING[shot];
        const k = INOUT(Math.min(1, inShot / SHOT));
        const sc = f.s * (1 + 0.07 * k);
        return (
          <div style={{position: 'absolute', left: f.x + f.dx * k, top: f.y + f.dy * k, width: WW, height: WH, transform: `rotate(${f.r}deg) scale(${sc})`, transformOrigin: 'top left'}}>
            <Win tag={p(shot * SHOT + 0.3, 0.25)} />
          </div>
        );
      })()}

      {/* pulled back: all sources at once, slightly askew, drifting */}
      {s >= PULL - 0.02 && WINDOWS.map((Win, i) => {
        const g = SCATTER[i];
        const e = p(PULL + i * 0.06, 0.8, EXPO);
        const drift = Math.sin(s * 1.3 + i * 1.9) * 6;
        return (
          <div key={i} style={{position: 'absolute', left: lerp(g.x - 120, g.x, e), top: lerp(g.y + 40, g.y, e) + drift, width: WW, height: WH, transform: `rotate(${g.r}deg) scale(${lerp(g.s * 1.9, g.s, e)})`, transformOrigin: 'top left', opacity: Math.min(1, e * 2)}}>
            <Win tag={p(PULL + 0.5 + i * 0.1, 0.3)} />
          </div>
        );
      })}

      {/* left scrim keeps the headline readable over the windows */}
      <AbsoluteFill style={{background: `linear-gradient(90deg, ${C.deep} 0%, ${C.deep} 38%, rgb(11 31 51 / 0.85) 50%, rgb(11 31 51 / 0) 66%)`, opacity: scrim}} />
      <AbsoluteFill style={{background: '#fff', opacity: cutFlash * 0.08}} />

      {/* headline */}
      <div style={{position: 'absolute', left: 120, top: 300}}>
        <Kicker color={C.onDeepMuted}>Excel · ERP · Mail · Databaser</Kicker>
        <div style={{height: 30}} />
        <MaskLine at={0.25} dur={0.5} style={{fontFamily: F.display, fontWeight: 500, fontSize: 86, lineHeight: 1.08, letterSpacing: '-0.02em', color: C.onDeep}}>Har I data overalt –</MaskLine>
        <MaskLine at={0.95} dur={0.5} style={{fontFamily: F.display, fontWeight: 500, fontSize: 86, lineHeight: 1.08, letterSpacing: '-0.02em', color: C.onDeep}}>men mangler ét</MaskLine>
        <MaskLine at={1.2} dur={0.5} style={{fontFamily: F.display, fontStyle: 'italic', fontWeight: 500, fontSize: 86, lineHeight: 1.08, letterSpacing: '-0.02em', color: C.accentHi}}>samlet overblik?</MaskLine>
      </div>

      {[0, 1, 2, 3].map((i) => <Sfx key={i} at={i * SHOT + 0.01} src="switch_002.ogg" volume={0.16} />)}
      {[0, 1, 2, 3].map((i) => <Sfx key={`t${i}`} at={i * SHOT + 0.3} src="click_003.ogg" volume={0.12} />)}
      <Sfx at={PULL} src="card-slide-1.ogg" volume={0.35} />
    </AbsoluteFill>
  );
};
