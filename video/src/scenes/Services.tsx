// 0:12–0:19  Solutions: the three services from the site as animated UI cards, each with a live mini-visual.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, CheckIcon, EXPO, F, FrostBg, INOUT, Kicker, MaskLine, SHADOW, Sfx, da, lerp, mix, useProg, useSec, useSpringAt} from '../kit';

const CW = 540, CH = 562, CX0 = 120, CGAP = 30, CY = 330;
const FOCUS0 = 1.25, FOCUS = 1.95; // each card gets ~2 s in focus

type Card = {n: string; title: string; desc: string; result: string; Viz: React.FC<{t0: number}>};

// ---------- mini visual 1: sources merge into one customer register ----------
const VizStructure: React.FC<{t0: number}> = ({t0}) => {
  const p = useProg();
  const s = useSec();
  const lines = p(t0 + 0.1, 0.55, INOUT);
  const count = p(t0 + 0.35, 1.0, INOUT);
  const srcs = ['ERP', 'CRM', 'Regneark'];
  return (
    <div style={{position: 'relative', width: '100%', height: '100%'}}>
      <svg width={460} height={210} style={{position: 'absolute', inset: 0}}>
        {srcs.map((_, i) => {
          const y = 38 + i * 66;
          const d = `M 142 ${y} C 205 ${y}, 205 105, 262 105`;
          return (
            <g key={i}>
              <path d={d} stroke={C.line} strokeWidth={3} fill="none" />
              <path d={d} stroke={C.accent} strokeWidth={3} fill="none" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - lines} />
            </g>
          );
        })}
        {lines >= 1 && srcs.map((_, i) => {
          const y = 38 + i * 66;
          const u = ((s * 1.4 + i * 0.33) % 1);
          // cubic bezier point
          const P = [[142, y], [205, y], [205, 105], [262, 105]];
          const b = (k: number) => (1 - u) ** 3 * P[0][k] + 3 * (1 - u) ** 2 * u * P[1][k] + 3 * (1 - u) * u ** 2 * P[2][k] + u ** 3 * P[3][k];
          return <circle key={i} cx={b(0)} cy={b(1)} r={5.5} fill={C.accent} />;
        })}
      </svg>
      {srcs.map((t, i) => (
        <div key={t} style={{position: 'absolute', left: 14, top: 18 + i * 66, width: 128, height: 40, boxSizing: 'border-box', borderRadius: 10, background: '#fff', border: `1.5px solid ${C.line}`, fontFamily: F.mono, fontSize: 17, color: C.muted, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{t}</div>
      ))}
      <div style={{position: 'absolute', left: 262, top: 40, width: 182, height: 130, boxSizing: 'border-box', borderRadius: 14, background: '#fff', border: `2px solid ${lines >= 1 ? C.accent : C.line}`, padding: '14px 16px'}}>
        <div style={{fontFamily: F.mono, fontSize: 14, color: C.muted, letterSpacing: '0.08em'}}>KUNDEDUBLETTER</div>
        <div style={{fontFamily: F.display, fontWeight: 500, fontSize: 60, lineHeight: 1.1, color: count >= 1 ? C.accentInk : C.ink, fontVariantNumeric: 'tabular-nums'}}>{Math.round(lerp(214, 0, count))}</div>
      </div>
    </div>
  );
};

// ---------- mini visual 2: invoice flow runs by itself ----------
const VizFlow: React.FC<{t0: number}> = ({t0}) => {
  const p = useProg();
  const s = useSec();
  const nodes = ['Faktura', 'Afstem', 'Bogført'];
  const run = mix(0, 1, (s - (t0 + 0.1)) / 0.9); // first pass of the dot
  const looping = s > t0 + 1.0 ? ((s - t0 - 1.0) / 0.9) % 1 : run;
  const hours = p(t0 + 0.4, 1.0, INOUT);
  const NX = [14, 162, 310], NW = 132;
  const dotX = lerp(NX[0] + NW / 2, NX[2] + NW / 2, looping);
  return (
    <div style={{position: 'relative', width: '100%', height: '100%'}}>
      <div style={{position: 'absolute', left: NX[0] + NW / 2, top: 47, width: NX[2] - NX[0], height: 3, background: C.line}} />
      <div style={{position: 'absolute', left: NX[0] + NW / 2, top: 47, width: (NX[2] - NX[0]) * run, height: 3, background: C.accent}} />
      {nodes.map((t, i) => {
        const passed = run >= i / 2 - 0.001 && s > t0 + 0.1;
        return (
          <div key={t} style={{position: 'absolute', left: NX[i], top: 22, width: NW, height: 54, boxSizing: 'border-box', borderRadius: 10, background: '#fff', border: `2px solid ${passed ? C.accent : C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: F.sans, fontWeight: 600, fontSize: 19, color: C.ink}}>
            {passed && <CheckIcon size={18} color={C.accent} stroke={3} />}
            {t}
          </div>
        );
      })}
      {s > t0 + 0.1 && <div style={{position: 'absolute', left: dotX - 8, top: 40, width: 16, height: 16, borderRadius: '50%', background: C.accent, boxShadow: `0 0 0 6px rgb(15 181 166 / 0.18)`}} />}
      <div style={{position: 'absolute', left: 14, top: 104, fontFamily: F.mono, fontSize: 15, color: C.muted, letterSpacing: '0.06em'}}>AFSTEMNING AF FAKTURAER · PR. UGE</div>
      <div style={{position: 'absolute', left: 14, top: 128, fontFamily: F.display, fontWeight: 500, fontSize: 58, lineHeight: 1.1, color: hours >= 1 ? C.accentInk : C.ink, fontVariantNumeric: 'tabular-nums'}}>
        {da(lerp(6.5, 0.5, hours))} t
        <span style={{fontFamily: F.sans, fontSize: 22, color: C.muted, marginLeft: 14, fontWeight: 500}}>{hours > 0 ? 'før 6,5 t' : ''}</span>
      </div>
    </div>
  );
};

// ---------- mini visual 3: ERP health check ----------
const VizHealth: React.FC<{t0: number}> = ({t0}) => {
  const p = useProg();
  const g = p(t0 + 0.1, 1.1, INOUT);
  const val = lerp(58, 94, g);
  const R = 68, CIRC = 2 * Math.PI * R;
  const rows = ['Opsætning', 'Integrationer', 'Brugertræning'];
  return (
    <div style={{position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', gap: 28, paddingLeft: 14}}>
      <div style={{position: 'relative', width: 170, height: 170}}>
        <svg width={170} height={170} style={{transform: 'rotate(-90deg)'}}>
          <circle cx={85} cy={85} r={R} stroke={C.line} strokeWidth={14} fill="none" />
          <circle cx={85} cy={85} r={R} stroke={C.accent} strokeWidth={14} fill="none" strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - val / 100)} />
        </svg>
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontFamily: F.display, fontWeight: 500, fontSize: 46, color: C.ink, fontVariantNumeric: 'tabular-nums'}}>{Math.round(val)}%</div>
          <div style={{fontFamily: F.mono, fontSize: 12, color: C.muted, letterSpacing: '0.08em', marginTop: -4}}>SUNDHEDSTJEK</div>
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
        {rows.map((t, i) => {
          const c = p(t0 + 0.35 + i * 0.3, 0.3);
          return (
            <div key={t} style={{display: 'flex', alignItems: 'center', gap: 10, fontFamily: F.sans, fontWeight: 500, fontSize: 21, color: C.ink}}>
              <div style={{width: 28, height: 28, borderRadius: 8, border: `2px solid ${c > 0.5 ? C.accent : C.line}`, background: c > 0.5 ? C.accentSoft : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{transform: `scale(${c})`}}><CheckIcon size={18} color={C.accentInk} stroke={3.2} /></div>
              </div>
              {t}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CARDS: Card[] = [
  {n: '01', title: 'Dataopsætning', desc: 'Et rent fundament, som rapporter, systemer og beslutninger kan stole på.', result: 'Ét tal, I kan stole på.', Viz: VizStructure},
  {n: '02', title: 'Automatisering', desc: 'Gentagne, fejlbehæftede opgaver kører af sig selv mellem systemerne.', result: 'Timer sparet hver uge.', Viz: VizFlow},
  {n: '03', title: 'ERP-assistance', desc: 'Få mere ud af det ERP-system, I allerede betaler for.', result: 'Et ERP, teamet kan lide at bruge.', Viz: VizHealth},
];

const SYSTEMS = ['Business Central', 'e-conomic', 'Visma', 'Uniconta', 'Tripletex', 'NetSuite', 'Power BI', 'Power Automate', 'Make'];

export const Services: React.FC = () => {
  const p = useProg();
  const sp = useSpringAt();
  const s = useSec();

  return (
    <AbsoluteFill>
      <FrostBg />

      {/* header */}
      <div style={{position: 'absolute', left: CX0, top: 100}}>
        <div style={{opacity: p(0.1, 0.4)}}><Kicker color={C.accentInk}>Løsninger</Kicker></div>
        <div style={{height: 18}} />
        <MaskLine at={0.15} dur={0.55} style={{fontFamily: F.display, fontWeight: 500, fontSize: 76, letterSpacing: '-0.02em', color: C.ink}}>
          Tre måder at give jeres team <span style={{fontStyle: 'italic', color: C.accentInk}}>tiden tilbage</span>.
        </MaskLine>
      </div>

      {/* cards */}
      {CARDS.map((c, i) => {
        const enter = sp(0.35 + i * 0.13, {damping: 16, stiffness: 170});
        const fStart = FOCUS0 + i * FOCUS;
        const on = p(fStart, 0.3, EXPO) * (1 - p(fStart + FOCUS, 0.3, EXPO));
        const Viz = c.Viz;
        return (
          <div
            key={c.n}
            style={{
              position: 'absolute', left: CX0 + i * (CW + CGAP), top: CY, width: CW, height: CH, boxSizing: 'border-box',
              background: '#fff', borderRadius: 24, padding: 38,
              border: `2px solid ${on > 0.05 ? `color-mix(in srgb, ${C.accent} ${Math.round(on * 100)}%, ${C.line})` : C.line}`,
              boxShadow: SHADOW,
              opacity: Math.min(1, enter * 1.3),
              transform: `translateY(${(1 - enter) * 120 - on * 16}px) scale(${1 + on * 0.015})`,
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div style={{fontFamily: F.mono, fontWeight: 500, fontSize: 20, color: C.accentInk, letterSpacing: '0.1em'}}>{c.n}</div>
              <div style={{width: 12, height: 12, borderRadius: '50%', background: on > 0.5 ? C.accent : C.line}} />
            </div>
            <div style={{fontFamily: F.display, fontWeight: 500, fontSize: 48, letterSpacing: '-0.02em', color: C.ink, marginTop: 10}}>{c.title}</div>
            <div style={{fontFamily: F.sans, fontSize: 23, lineHeight: 1.45, color: C.muted, marginTop: 10, height: 68}}>{c.desc}</div>
            <div style={{marginTop: 22, height: 212, borderRadius: 16, background: C.frost, overflow: 'hidden'}}>
              <Viz t0={fStart} />
            </div>
            <div style={{marginTop: 24, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderRadius: 12, background: on > 0.5 || s > fStart + FOCUS ? C.accentSoft : C.frost}}>
              <CheckIcon size={24} color={C.accentInk} stroke={3} />
              <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 22, color: C.ink}}>{c.result}</div>
            </div>
          </div>
        );
      })}

      {/* systems ticker */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 982, display: 'flex', alignItems: 'center', gap: 28, paddingLeft: CX0, opacity: p(1.0, 0.5)}}>
        <div style={{fontFamily: F.mono, fontWeight: 500, fontSize: 18, color: C.accentInk, letterSpacing: '0.14em', flexShrink: 0}}>SYSTEMER</div>
        <div style={{overflow: 'hidden', flex: 1, WebkitMaskImage: 'linear-gradient(to right, transparent, #000 6%, #000 90%, transparent)', maskImage: 'linear-gradient(to right, transparent, #000 6%, #000 90%, transparent)'}}>
          <div style={{display: 'flex', gap: 44, whiteSpace: 'nowrap', transform: `translateX(${-s * 70}px)`, fontFamily: F.mono, fontSize: 21, color: C.muted}}>
            {[...SYSTEMS, ...SYSTEMS].map((t, i) => <span key={i}>{t}</span>)}
          </div>
        </div>
      </div>

      {CARDS.map((_, i) => <Sfx key={i} at={0.35 + i * 0.13} src="card-slide-1.ogg" volume={0.2} />)}
      {CARDS.map((_, i) => <Sfx key={`f${i}`} at={FOCUS0 + i * FOCUS} src="switch_002.ogg" volume={0.22} />)}
    </AbsoluteFill>
  );
};
