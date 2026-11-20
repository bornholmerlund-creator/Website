// 0:00–0:05  Hook: fragmented data sources that don't agree, pulled together into one overview.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, CheckIcon, DeepBg, EXPO, F, INOUT, Kicker, MaskLine, Sfx, lerp, useProg, useSec, useSpringAt} from '../kit';

type Frag = {src: string; value: string; tag?: string; x: number; y: number; r: number};
const FRAGS: Frag[] = [
  {src: 'ERP', value: 'Debitor 10482 · Hansen A/S', tag: 'Dublet', x: 1010, y: 140, r: -4},
  {src: 'CRM', value: 'Hansen ApS · 10482', tag: 'Dublet', x: 1450, y: 250, r: 5},
  {src: 'Regneark_v7_FINAL.xlsx', value: 'Omsætning Q3: 1.284.000', x: 1050, y: 420, r: 3},
  {src: 'Webshop', value: 'Ordre #55821', tag: 'Ikke bogført', x: 1470, y: 560, r: -6},
  {src: 'Faktura.pdf', value: 'Leverandør 2291', tag: 'Manuel', x: 990, y: 720, r: -2},
  {src: 'Rapport', value: 'Omsætning Q3: 1.248.000', x: 1420, y: 820, r: 4},
];
const W = 410, H = 128;
// tidy grid they snap into
const GX0 = (1920 - (3 * W + 2 * 28)) / 2, GY0 = 470;
const gridPos = (i: number) => ({x: GX0 + (i % 3) * (W + 28), y: GY0 + Math.floor(i / 3) * (H + 28)});

const CONVERGE = 2.85; // seconds
const COLLAPSE = 4.45;

export const Hook: React.FC = () => {
  const p = useProg();
  const s = useSec();
  const sp = useSpringAt();

  const textOut = p(CONVERGE - 0.1, 0.35, INOUT);
  const conv = p(CONVERGE, 0.75, EXPO);
  const collapse = p(COLLAPSE, 0.45, Easing2);
  const flash = p(COLLAPSE + 0.28, 0.4);
  const mismatch = p(1.35, 0.3) * (1 - p(CONVERGE - 0.15, 0.2));

  return (
    <AbsoluteFill>
      <DeepBg />

      {/* left: the problem, three punchy lines */}
      <AbsoluteFill style={{left: 140, top: 300, opacity: 1 - textOut, transform: `translateY(${-textOut * 60}px)`}}>
        <Kicker size={22} color={C.onDeepMuted}>ERP · CRM · Regneark · Webshop</Kicker>
        <div style={{height: 34}} />
        {[
          {t: 'Data i hvert system.', at: 0.2},
          {t: 'Tal, der ikke stemmer.', at: 0.75},
        ].map((l) => (
          <MaskLine key={l.t} at={l.at} dur={0.5} style={{fontFamily: F.display, fontWeight: 500, fontSize: 88, lineHeight: 1.08, letterSpacing: '-0.02em', color: C.onDeep}}>
            {l.t}
          </MaskLine>
        ))}
        <MaskLine at={1.3} dur={0.5} style={{fontFamily: F.display, fontStyle: 'italic', fontWeight: 500, fontSize: 88, lineHeight: 1.08, letterSpacing: '-0.02em', color: C.accentHi}}>
          Og intet overblik.
        </MaskLine>
      </AbsoluteFill>

      {/* mismatch connector between the two revenue figures */}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: mismatch}}>
        <path d={`M ${FRAGS[2].x + W - 40} ${FRAGS[2].y + H} C ${FRAGS[2].x + W + 60} ${FRAGS[2].y + 320}, ${FRAGS[5].x - 40} ${FRAGS[5].y - 80}, ${FRAGS[5].x + 60} ${FRAGS[5].y}`} stroke={C.dangerOnDeep} strokeWidth={2.5} strokeDasharray="8 8" strokeDashoffset={-s * 40} fill="none" />
        <g transform={`translate(${(FRAGS[2].x + FRAGS[5].x) / 2 + W / 2 - 10}, ${(FRAGS[2].y + FRAGS[5].y) / 2 + 70})`}>
          <circle r={30} fill={C.deep} stroke={C.dangerOnDeep} strokeWidth={2.5} />
          <text textAnchor="middle" dominantBaseline="central" fontFamily="Inter" fontWeight={700} fontSize={32} fill={C.dangerOnDeep}>≠</text>
        </g>
      </svg>

      {/* headline after the pieces snap into place */}
      <AbsoluteFill style={{top: 250, alignItems: 'center', opacity: 1 - collapse, transform: `scale(${1 - collapse * 0.6})`}}>
        <MaskLine at={CONVERGE + 0.35} dur={0.55} style={{fontFamily: F.display, fontWeight: 500, fontSize: 92, letterSpacing: '-0.02em', color: C.onDeep, textAlign: 'center'}}>
          Samlet til <span style={{fontStyle: 'italic', color: C.accentHi}}>ét overblik</span>.
        </MaskLine>
      </AbsoluteFill>

      {/* fragments */}
      {FRAGS.map((f, i) => {
        const enter = sp(0.1 + i * 0.16, {damping: 14, stiffness: 200});
        const wob = 1 - conv;
        const jx = Math.sin(s * 1.6 + i * 1.7) * 10 * wob + (f.tag && mismatch > 0.5 ? Math.sin(s * 40 + i) * 1.5 : 0);
        const jy = Math.cos(s * 1.3 + i * 2.1) * 10 * wob;
        const g = gridPos(i);
        const x = lerp(f.x, g.x, conv) + jx;
        const y = lerp(f.y, g.y, conv) + jy;
        // collapse to the centre of the frame
        const cx = lerp(x, 960 - W / 2, collapse), cy = lerp(y, 540 - H / 2, collapse);
        const sc = (0.7 + 0.3 * enter) * (1 - collapse * 0.92);
        const rot = f.r * (1 - conv);
        const tagShow = Math.min(1, p(1.3 + i * 0.06, 0.25)) * (1 - p(CONVERGE, 0.2));
        const ok = p(CONVERGE + 0.45 + i * 0.05, 0.3);
        return (
          <div
            key={i}
            style={{
              position: 'absolute', left: cx, top: cy, width: W, height: H, boxSizing: 'border-box',
              transform: `rotate(${rot}deg) scale(${sc})`, opacity: Math.min(1, enter * 1.4) * (1 - collapse),
              background: C.deep2, borderRadius: 16, padding: '22px 26px',
              border: `1.5px solid ${ok > 0 ? `color-mix(in srgb, ${C.accentHi} ${Math.round(ok * 70)}%, ${C.deepLine})` : C.deepLine}`,
              boxShadow: '0 20px 50px -20px rgb(0 0 0 / 0.6)',
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
              <div style={{width: 10, height: 10, borderRadius: 2, background: ok > 0.5 ? C.accentHi : C.onDeepMuted}} />
              <div style={{fontFamily: F.mono, fontSize: 19, color: C.onDeepMuted, letterSpacing: '0.04em'}}>{f.src}</div>
            </div>
            <div style={{fontFamily: F.sans, fontWeight: 500, fontSize: 27, color: C.onDeep, marginTop: 14, whiteSpace: 'nowrap'}}>{f.value}</div>
            {f.tag && tagShow > 0 && (
              <div style={{position: 'absolute', right: 18, top: 18, transform: `scale(${0.6 + 0.4 * tagShow})`, opacity: tagShow, fontFamily: F.mono, fontSize: 16, fontWeight: 500, color: C.dangerOnDeep, background: 'rgb(255 155 143 / 0.12)', border: `1px solid rgb(255 155 143 / 0.4)`, padding: '4px 10px', borderRadius: 999}}>
                {f.tag}
              </div>
            )}
            {ok > 0 && (
              <div style={{position: 'absolute', right: 20, top: 20, opacity: ok, transform: `scale(${0.4 + 0.6 * ok})`}}>
                <CheckIcon size={28} color={C.accentHi} stroke={3} />
              </div>
            )}
          </div>
        );
      })}

      {/* flash ring as everything folds into one point (becomes the logo) */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'}}>
        <div style={{width: 40 + flash * 900, height: 40 + flash * 900, borderRadius: '50%', border: `${3 + (1 - flash) * 6}px solid ${C.accentHi}`, opacity: flash > 0 ? (1 - flash) * 0.9 : 0}} />
        <div style={{position: 'absolute', width: 22, height: 22, borderRadius: '50%', background: C.accentHi, opacity: collapse > 0.6 ? 1 - flash : 0, boxShadow: `0 0 40px ${C.accentHi}`}} />
      </AbsoluteFill>

      {FRAGS.map((_, i) => <Sfx key={i} at={0.1 + i * 0.16} src="keypress-001.wav" volume={0.18} />)}
      <Sfx at={1.35} src="switch_002.ogg" volume={0.25} />
      <Sfx at={CONVERGE} src="card-slide-1.ogg" volume={0.45} />
      <Sfx at={CONVERGE + 0.5} src="drop_002.ogg" volume={0.25} />
      <Sfx at={COLLAPSE + 0.25} src="impactSoft_heavy_003.ogg" volume={0.45} />
    </AbsoluteFill>
  );
};

function Easing2(t: number) {
  // ease-in (accelerating fold)
  return t * t * t;
}
