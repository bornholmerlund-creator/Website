// 0:23–0:30  Call to action: value + trust, then logo, a clicked "Book" button and the URL.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Arrow, C, CheckIcon, Cursor, DeepBg, EXPO, F, INOUT, Keystone, MaskLine, Pop, Rise, Sfx, lerp, useProg, useSpringAt} from '../kit';

const SWAP = 2.55;   // value statement -> end card
const CLICK = 4.05;

export const Cta: React.FC = () => {
  const p = useProg();
  const sp = useSpringAt();
  const out = p(SWAP, 0.4, INOUT);

  // cursor path
  const move = p(3.35, 0.65, EXPO);
  const curX = lerp(1520, 1120, move), curY = lerp(930, 540, move);
  const press = p(CLICK, 0.08) * (1 - p(CLICK + 0.1, 0.18));
  const ripple = p(CLICK, 0.6);
  const underline = p(4.45, 0.6, INOUT);

  return (
    <AbsoluteFill>
      <DeepBg drift={12} />

      {/* part 1: value + trust */}
      <AbsoluteFill style={{alignItems: 'center', top: 300, opacity: 1 - out, transform: `translateY(${-out * 80}px)`}}>
        <MaskLine at={0.12} dur={0.55} style={{fontFamily: F.display, fontWeight: 500, fontSize: 124, lineHeight: 1.06, letterSpacing: '-0.03em', color: C.onDeep}}>
          Komplekse data,
        </MaskLine>
        <MaskLine at={0.35} dur={0.55} style={{fontFamily: F.display, fontStyle: 'italic', fontWeight: 500, fontSize: 124, lineHeight: 1.06, letterSpacing: '-0.03em', color: C.accentHi}}>
          gjort enkle.
        </MaskLine>
        <div style={{display: 'flex', gap: 22, marginTop: 70}}>
          {['Leverandøruafhængig', 'Ingen binding', 'Svar inden for én arbejdsdag'].map((t, i) => (
            <Pop key={t} at={1.0 + i * 0.16} from={0.7}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, fontFamily: F.sans, fontWeight: 500, fontSize: 30, color: C.onDeep, background: C.deep2, border: `1.5px solid ${C.deepLine}`, padding: '16px 26px', borderRadius: 14}}>
                <CheckIcon size={26} color={C.accentHi} stroke={3} />
                {t}
              </div>
            </Pop>
          ))}
        </div>
      </AbsoluteFill>

      {/* part 2: end card */}
      <AbsoluteFill style={{alignItems: 'center', top: 170}}>
        <Rise at={SWAP + 0.2} y={30}>
          <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
            <Keystone size={84} draw={p(SWAP + 0.2, 0.6, INOUT)} fill={sp(SWAP + 0.55, {damping: 10, stiffness: 180})} />
            <span style={{fontFamily: F.display, fontWeight: 600, fontSize: 74, letterSpacing: '-0.02em', color: C.onDeep}}>Northbound Data</span>
          </div>
        </Rise>
        <MaskLine at={SWAP + 0.45} dur={0.55} style={{marginTop: 64, fontFamily: F.display, fontWeight: 500, fontSize: 84, letterSpacing: '-0.025em', color: C.onDeep}}>
          Lad os tale om jeres data.
        </MaskLine>

        <Pop at={SWAP + 0.75} from={0.8} style={{marginTop: 54}}>
          <div style={{position: 'relative', transform: `scale(${1 - press * 0.05})`}}>
            <div style={{position: 'absolute', inset: 0, borderRadius: 14, boxShadow: `0 0 0 ${ripple * 34}px rgb(47 203 189 / ${ripple > 0 ? 0.35 * (1 - ripple) : 0})`}} />
            <div style={{display: 'flex', alignItems: 'center', gap: 16, fontFamily: F.sans, fontWeight: 600, fontSize: 38, color: C.onAccent, background: press > 0.2 || ripple > 0.3 ? C.accentHi : C.accent, padding: '26px 48px', borderRadius: 14, boxShadow: '0 18px 40px -16px rgb(0 0 0 / 0.6)'}}>
              Book et uforpligtende møde
              <div style={{transform: `translateX(${ripple > 0 ? Math.sin(ripple * Math.PI) * 8 : 0}px)`}}><Arrow size={32} /></div>
            </div>
          </div>
        </Pop>

        <div style={{marginTop: 70, opacity: p(4.35, 0.35), transform: `translateY(${(1 - p(4.35, 0.5, EXPO)) * 24}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{fontFamily: F.display, fontWeight: 500, fontSize: 92, letterSpacing: '-0.02em', color: C.onDeep}}>northbound-data.dk</div>
          <div style={{height: 4, width: 760, marginTop: 6, background: C.accentHi, transform: `scaleX(${underline})`, transformOrigin: 'left center', borderRadius: 2}} />
          <div style={{marginTop: 30, fontFamily: '"IBM Plex Mono", monospace', fontSize: 28, color: C.onDeepMuted, letterSpacing: '0.04em', opacity: p(4.7, 0.4)}}>
            frlu@northbound-data.dk  ·  +45 40 99 77 24
          </div>
        </div>
      </AbsoluteFill>

      {/* cursor */}
      <div style={{position: 'absolute', left: curX, top: curY, opacity: p(3.3, 0.2) * (1 - p(4.9, 0.3)), transform: `scale(${1 - press * 0.15})`}}>
        <Cursor size={54} />
      </div>

      {[0, 1, 2].map((i) => <Sfx key={i} at={1.0 + i * 0.16} src="click_003.ogg" volume={0.18} />)}
      <Sfx at={SWAP + 0.2} src="card-slide-1.ogg" volume={0.25} />
      <Sfx at={SWAP + 0.55} src="chime_soft.wav" volume={0.3} />
      <Sfx at={CLICK} src="click2.ogg" volume={0.6} />
      <Sfx at={4.4} src="bong_001.ogg" volume={0.3} />
    </AbsoluteFill>
  );
};
