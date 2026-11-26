// 0:33–0:40  Brand reveal and call to action, with Frederik's portrait: the customer works directly
// with the specialist, not a large consultancy.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Arrow, C, DeepBg, EXPO, F, INOUT, Keystone, MaskLine, Pop, Rise, Sfx, lerp, useProg, useSec, useSpringAt} from '../kit';

const PX = 270, PY = 205, PS = 380;   // portrait card
const RX = 770;                        // right column

export const S5Brand: React.FC = () => {
  const p = useProg();
  const s = useSec();
  const sp = useSpringAt();
  const draw = p(0.15, 0.8, INOUT);
  const core = sp(0.75, {damping: 10, stiffness: 170});
  const underline = p(2.6, 0.7, INOUT);
  const glow = s > 1.2 ? 0.5 + 0.5 * Math.sin((s - 1.2) * 2.2) : 0;
  const por = p(0.1, 0.9, EXPO);
  // very slow push-in on the photo
  const zoom = lerp(1.0, 1.05, Math.min(1, s / 7));

  return (
    <AbsoluteFill>
      <DeepBg drift={30} />

      {/* portrait */}
      <div style={{position: 'absolute', left: PX, top: PY, width: PS, opacity: por, transform: `translateY(${(1 - por) * 40}px)`}}>
        <div style={{width: PS, height: PS, borderRadius: 24, overflow: 'hidden', border: `2px solid ${C.deepLine}`, boxShadow: '0 40px 80px -30px rgb(0 0 0 / 0.7)', background: C.deep2}}>
          <Img src={staticFile('portrait.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`}} />
        </div>
        <div style={{marginTop: 30, opacity: p(0.7, 0.5), transform: `translateY(${(1 - p(0.7, 0.6, EXPO)) * 16}px)`}}>
          <div style={{fontFamily: F.display, fontWeight: 500, fontSize: 34, letterSpacing: '-0.01em', color: C.onDeep, whiteSpace: 'nowrap'}}>Frederik Skovgaard Lund</div>
          <div style={{fontFamily: F.mono, fontSize: 17, letterSpacing: '0.06em', color: C.onDeepMuted, marginTop: 8, whiteSpace: 'nowrap'}}>Grundlægger af Northbound Data</div>
        </div>
      </div>

      {/* brand + CTA */}
      <div style={{position: 'absolute', left: RX, top: 205}}>
        <Rise at={0.25} y={20}>
          <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
            <div style={{filter: `drop-shadow(0 0 ${10 + glow * 18}px rgb(47 203 189 / ${0.25 + glow * 0.25}))`}}>
              <Keystone size={92} draw={draw} fill={core} />
            </div>
            <span style={{fontFamily: F.display, fontWeight: 600, fontSize: 80, letterSpacing: '-0.02em', color: C.onDeep, opacity: p(0.45, 0.5), transform: `translateX(${(1 - p(0.45, 0.7, EXPO)) * -30}px)`, display: 'inline-block'}}>Northbound Data</span>
          </div>
        </Rise>

        <div style={{display: 'flex', gap: 20, marginTop: 44}}>
          <MaskLine at={1.0} dur={0.55} style={{fontFamily: F.display, fontWeight: 500, fontSize: 72, letterSpacing: '-0.025em', color: C.onDeep}}>Komplekse data,</MaskLine>
          <MaskLine at={1.2} dur={0.55} style={{fontFamily: F.display, fontStyle: 'italic', fontWeight: 500, fontSize: 72, letterSpacing: '-0.025em', color: C.accentHi}}>gjort enkle.</MaskLine>
        </div>

        <div style={{marginTop: 24, fontFamily: F.mono, fontWeight: 500, fontSize: 24, letterSpacing: '0.16em', color: C.onDeepMuted, opacity: p(1.6, 0.5), textTransform: 'uppercase'}}>
          Power BI · Dataopsætning · Automatisering
        </div>

        <Pop at={2.05} from={0.85} style={{marginTop: 48, transformOrigin: 'left center', display: 'inline-block'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, fontFamily: F.sans, fontWeight: 600, fontSize: 34, color: C.onAccent, background: C.accent, padding: '22px 42px', borderRadius: 14, boxShadow: '0 18px 40px -16px rgb(0 0 0 / 0.6)'}}>
            Book et uforpligtende møde
            <Arrow size={28} />
          </div>
        </Pop>

        <div style={{marginTop: 40, opacity: p(2.45, 0.4)}}>
          <div style={{fontFamily: F.display, fontWeight: 500, fontSize: 58, letterSpacing: '-0.02em', color: C.onDeep}}>northbound-data.dk</div>
          <div style={{height: 4, width: 490, marginTop: 4, background: C.accentHi, transform: `scaleX(${underline})`, transformOrigin: 'left center', borderRadius: 2}} />
        </div>
      </div>

      <Sfx at={0.15} src="card-slide-1.ogg" volume={0.2} />
      <Sfx at={0.75} src="chime_soft.wav" volume={0.3} />
      <Sfx at={2.05} src="click_003.ogg" volume={0.2} />
    </AbsoluteFill>
  );
};
