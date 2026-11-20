// 0:19–0:23  Value: the site's own before/after example, as an animated bar chart.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, EXPO, F, FrostBg, INOUT, Kicker, MaskLine, Rise, SHADOW, Sfx, da, lerp, useProg} from '../kit';

// "Manuelle timer pr. uge — En grossist med 25 ansatte, før og efter" (northbound-data.dk)
const ROWS = [
  {label: 'Afstemning af leverandørfakturaer', before: 6.5, after: 0.5},
  {label: 'Indtastning af webshopordrer', before: 4, after: 0, auto: true},
  {label: 'Månedlig lagerrapport', before: 3, after: 0.25},
  {label: 'Oprydning i kundedubletter', before: 2, after: 0.25},
];
const MAX = 6.5, BAR = 760;
const SHRINK = 1.05;

export const Proof: React.FC = () => {
  const p = useProg();
  const total = p(SHRINK, 0.9, INOUT);

  return (
    <AbsoluteFill>
      <FrostBg />

      {/* left: headline number */}
      <div style={{position: 'absolute', left: 120, top: 210, width: 700}}>
        <div style={{opacity: p(0.05, 0.4)}}><Kicker color={C.accentInk}>Eksempel · grossist med 25 ansatte</Kicker></div>
        <div style={{height: 20}} />
        <MaskLine at={0.1} dur={0.5} style={{fontFamily: F.display, fontWeight: 500, fontSize: 68, letterSpacing: '-0.02em', color: C.ink}}>
          Manuelle timer pr. uge
        </MaskLine>
        <div style={{marginTop: 30, fontFamily: F.display, fontWeight: 500, fontSize: 210, lineHeight: 1, letterSpacing: '-0.04em', color: total > 0.98 ? C.accentInk : C.ink, fontVariantNumeric: 'tabular-nums', opacity: p(0.25, 0.3)}}>
          {da(lerp(15.5, 1, total))}<span style={{fontSize: 110, marginLeft: 16}}>t</span>
        </div>
        <div style={{marginTop: 14, fontFamily: F.sans, fontSize: 28, color: C.muted, opacity: p(SHRINK, 0.3)}}>
          ned fra 15,5 timer
        </div>
        <Rise at={2.05} style={{marginTop: 46}}>
          <div style={{display: 'inline-block', fontFamily: F.sans, fontWeight: 600, fontSize: 34, color: C.ink, background: C.accentSoft, padding: '16px 24px', borderRadius: 14}}>
            ≈ 750 timer om året frigjort
          </div>
        </Rise>
      </div>

      {/* right: bar chart card */}
      <div
        style={{
          position: 'absolute', left: 890, top: 200, width: 910, height: 620, boxSizing: 'border-box', padding: '46px 52px',
          background: '#fff', borderRadius: 24, border: `1.5px solid ${C.line}`, boxShadow: SHADOW,
          opacity: p(0.1, 0.35), transform: `translateX(${(1 - p(0.1, 0.6, EXPO)) * 80}px)`,
        }}
      >
        <div style={{display: 'flex', gap: 30, fontFamily: F.mono, fontSize: 18, color: C.muted, letterSpacing: '0.06em'}}>
          <span style={{display: 'flex', alignItems: 'center', gap: 10}}><span style={{width: 16, height: 16, borderRadius: 4, background: '#c9d6e3'}} />FØR</span>
          <span style={{display: 'flex', alignItems: 'center', gap: 10, opacity: p(SHRINK, 0.3)}}><span style={{width: 16, height: 16, borderRadius: 4, background: C.accent}} />EFTER</span>
        </div>
        {ROWS.map((r, i) => {
          const grow = p(0.3 + i * 0.08, 0.55, EXPO);
          const shrink = p(SHRINK + i * 0.1, 0.7, INOUT);
          const v = lerp(r.before, r.after, shrink);
          const w = (r.before / MAX) * BAR * grow;
          const wAfter = (v / MAX) * BAR;
          return (
            <div key={r.label} style={{marginTop: i === 0 ? 40 : 34}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <div style={{fontFamily: F.sans, fontWeight: 500, fontSize: 25, color: C.ink}}>{r.label}</div>
                <div style={{fontFamily: F.mono, fontWeight: 500, fontSize: 22, color: shrink > 0.98 ? C.accentInk : C.muted, fontVariantNumeric: 'tabular-nums'}}>
                  {shrink > 0 ? `${da(r.before)} t → ${r.auto && shrink > 0.98 ? 'automatiseret' : `${da(v, 2)} t`}` : `${da(r.before)} t`}
                </div>
              </div>
              <div style={{position: 'relative', marginTop: 12, height: 26, width: BAR}}>
                <div style={{position: 'absolute', left: 0, top: 0, height: 26, width: w, borderRadius: 7, background: shrink > 0 ? '#e3eaf1' : '#c9d6e3'}} />
                {shrink > 0 && <div style={{position: 'absolute', left: 0, top: 0, height: 26, width: Math.max(wAfter, r.auto ? 0 : 8), borderRadius: 7, background: C.accent}} />}
              </div>
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 52, bottom: 36, fontFamily: F.mono, fontSize: 15, color: C.muted, opacity: 0.85}}>
          Illustrative tal for et typisk projektomfang.
        </div>
      </div>

      <Sfx at={0.3} src="card-slide-1.ogg" volume={0.22} />
      <Sfx at={SHRINK} src="switch_002.ogg" volume={0.25} />
      <Sfx at={2.05} src="drop_002.ogg" volume={0.3} />
    </AbsoluteFill>
  );
};
