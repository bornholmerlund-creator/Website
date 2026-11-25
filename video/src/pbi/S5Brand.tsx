// 0:33–0:40  Brand reveal and call to action.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Arrow, C, DeepBg, EXPO, F, INOUT, Keystone, MaskLine, Pop, Rise, Sfx, useProg, useSec, useSpringAt} from '../kit';

export const S5Brand: React.FC = () => {
  const p = useProg();
  const s = useSec();
  const sp = useSpringAt();
  const draw = p(0.15, 0.8, INOUT);
  const core = sp(0.75, {damping: 10, stiffness: 170});
  const underline = p(2.6, 0.7, INOUT);
  // subtle, slow breathing glow on the mark once it's in place
  const glow = s > 1.2 ? 0.5 + 0.5 * Math.sin((s - 1.2) * 2.2) : 0;

  return (
    <AbsoluteFill>
      <DeepBg drift={30} />
      <AbsoluteFill style={{alignItems: 'center', top: 190}}>
        <Rise at={0.1} y={20}>
          <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
            <div style={{filter: `drop-shadow(0 0 ${10 + glow * 18}px rgb(47 203 189 / ${0.25 + glow * 0.25}))`}}>
              <Keystone size={110} draw={draw} fill={core} />
            </div>
            <span style={{fontFamily: F.display, fontWeight: 600, fontSize: 92, letterSpacing: '-0.02em', color: C.onDeep, opacity: p(0.45, 0.5), transform: `translateX(${(1 - p(0.45, 0.7, EXPO)) * -30}px)`, display: 'inline-block'}}>Northbound Data</span>
          </div>
        </Rise>

        <div style={{display: 'flex', gap: 22, marginTop: 56}}>
          <MaskLine at={1.0} dur={0.55} style={{fontFamily: F.display, fontWeight: 500, fontSize: 80, letterSpacing: '-0.025em', color: C.onDeep}}>Komplekse data,</MaskLine>
          <MaskLine at={1.2} dur={0.55} style={{fontFamily: F.display, fontStyle: 'italic', fontWeight: 500, fontSize: 80, letterSpacing: '-0.025em', color: C.accentHi}}>gjort enkle.</MaskLine>
        </div>

        <div style={{marginTop: 30, fontFamily: F.mono, fontWeight: 500, fontSize: 26, letterSpacing: '0.16em', color: C.onDeepMuted, opacity: p(1.6, 0.5), textTransform: 'uppercase'}}>
          Power BI · Dataopsætning · Automatisering
        </div>

        <Pop at={2.05} from={0.85} style={{marginTop: 52}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, fontFamily: F.sans, fontWeight: 600, fontSize: 36, color: C.onAccent, background: C.accent, padding: '24px 46px', borderRadius: 14, boxShadow: '0 18px 40px -16px rgb(0 0 0 / 0.6)'}}>
            Book et uforpligtende møde
            <Arrow size={30} />
          </div>
        </Pop>

        <div style={{marginTop: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: p(2.45, 0.4)}}>
          <div style={{fontFamily: F.display, fontWeight: 500, fontSize: 64, letterSpacing: '-0.02em', color: C.onDeep}}>northbound-data.dk</div>
          <div style={{height: 4, width: 540, marginTop: 4, background: C.accentHi, transform: `scaleX(${underline})`, transformOrigin: 'left center', borderRadius: 2}} />
        </div>
      </AbsoluteFill>

      <Sfx at={0.15} src="card-slide-1.ogg" volume={0.2} />
      <Sfx at={0.75} src="chime_soft.wav" volume={0.3} />
      <Sfx at={2.05} src="click_003.ogg" volume={0.2} />
    </AbsoluteFill>
  );
};
