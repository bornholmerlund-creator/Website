// 0:05–0:12  Introduction: the keystone mark draws itself, the wordmark arrives, then the core message.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, DeepBg, EXPO, F, INOUT, Keystone, Kicker, MaskLine, Pop, Rise, Sfx, lerp, useProg, useSpringAt} from '../kit';

const MARK = 230;          // mark size while it draws
const LOCK_MARK = 128;     // mark size in the lockup
const WORD = 124;          // wordmark font size
const WORD_W = 1000;       // measured width of "Northbound Data" at WORD px (Fraunces 600)
const GAP = 40;

export const Intro: React.FC = () => {
  const p = useProg();
  const sp = useSpringAt();

  const draw = p(0.05, 0.8, INOUT);
  const fill = sp(0.6, {damping: 10, stiffness: 180});
  const ring = p(0.6, 0.7);
  const lock = p(1.15, 0.6, EXPO);          // mark slides left, wordmark wipes in
  const up = p(2.55, 0.65, EXPO);           // lockup moves to the top

  const markSize = lerp(MARK, LOCK_MARK, lock);
  const lockW = LOCK_MARK + GAP + WORD_W;
  // group translate: centred mark alone -> centred full lockup
  const groupX = lerp(lockW / 2 - LOCK_MARK / 2, 0, lock);
  const groupY = lerp(0, -330, up);
  const groupS = lerp(1, 0.5, up);

  return (
    <AbsoluteFill>
      <DeepBg drift={5} />

      {/* lockup */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{transform: `translate(0px, ${groupY}px) scale(${groupS})`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: GAP, width: lockW, transform: `translateX(${groupX}px)`}}>
            <div style={{width: LOCK_MARK, height: LOCK_MARK, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
              <div style={{position: 'absolute', width: markSize * (1 + ring * 1.6), height: markSize * (1 + ring * 1.6), borderRadius: '50%', border: `2px solid ${C.accentHi}`, opacity: ring > 0 ? (1 - ring) * 0.7 : 0}} />
              <Keystone size={markSize} draw={draw} fill={fill} />
            </div>
            <div style={{width: WORD_W, clipPath: `inset(-20% ${(1 - lock) * 100}% -20% 0)`, transform: `translateX(${(1 - lock) * -40}px)`}}>
              <span style={{fontFamily: F.display, fontWeight: 600, fontSize: WORD, letterSpacing: '-0.02em', color: C.onDeep, whiteSpace: 'nowrap'}}>Northbound Data</span>
            </div>
          </div>
          <div style={{display: 'flex', justifyContent: 'center', marginTop: 34, opacity: p(1.6, 0.4) * (1 - up)}}>
            <Kicker size={26}>Dataopsætning · Automatisering · ERP</Kicker>
          </div>
        </div>
      </AbsoluteFill>

      {/* core message */}
      <AbsoluteFill style={{top: 350, alignItems: 'center'}}>
        <MaskLine at={2.85} dur={0.6} style={{fontFamily: F.display, fontWeight: 500, fontSize: 112, lineHeight: 1.08, letterSpacing: '-0.025em', color: C.onDeep}}>
          Få styr på jeres data —
        </MaskLine>
        <MaskLine at={3.1} dur={0.6} style={{fontFamily: F.display, fontWeight: 500, fontSize: 112, lineHeight: 1.08, letterSpacing: '-0.025em', color: C.onDeep}}>
          og <span style={{fontStyle: 'italic', color: C.accentHi}}>timerne tilbage</span>.
        </MaskLine>
        <Rise at={4.15} style={{marginTop: 46, fontFamily: F.sans, fontSize: 38, color: C.onDeepMuted, textAlign: 'center'}}>
          Partneren, der gør jeres data til en <span style={{color: C.onDeep, fontWeight: 600}}>konkret konkurrencefordel</span>.
        </Rise>
        <div style={{display: 'flex', gap: 18, marginTop: 52}}>
          {['Praktisk', 'Leverandøruafhængig', 'Til teams på 5–250'].map((t, i) => (
            <Pop key={t} at={4.85 + i * 0.14} from={0.7}>
              <div style={{fontFamily: F.mono, fontWeight: 500, fontSize: 24, color: C.accentHi, border: `1.5px solid rgb(47 203 189 / 0.45)`, background: 'rgb(47 203 189 / 0.08)', padding: '10px 22px', borderRadius: 999}}>{t}</div>
            </Pop>
          ))}
        </div>
      </AbsoluteFill>

      <Sfx at={0.6} src="chime_soft.wav" volume={0.35} />
      <Sfx at={1.15} src="card-slide-1.ogg" volume={0.25} />
      <Sfx at={2.85} src="impactSoft_medium_001.ogg" volume={0.3} />
      {[0, 1, 2].map((i) => <Sfx key={i} at={4.85 + i * 0.14} src="click_003.ogg" volume={0.18} />)}
    </AbsoluteFill>
  );
};
