// 0:14.8–0:23.4  What Northbound Data delivers: data model and integrations, an outdated report
// rebuilt as a clean dashboard, and optimisation – with the four services as a list on the left.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, Cursor, EXPO, F, FrostBg, INOUT, MaskLine, SHADOW, Sfx, da, lerp, useProg, useSec, useSpringAt} from '../kit';
import {Dashboard, DH, DW, ramp} from './Dashboard';

const SERVICES = ['Implementering', 'Integrationer', 'Dashboards', 'Vedligeholdelse & optimering'];
const ACTIVE = [0.25, 1.9, 3.6, 6.1, 99]; // when each service becomes the active one
const SEG_B = 3.6, WIPE = 4.55, SEG_C = 6.1;
const ST = {x: 640, y: 118, w: 1190, h: 790}; // stage

// ---------- A: star-schema data model ----------
type Tbl = {name: string; cols: string[]; x: number; y: number; src?: string; fact?: boolean};
const TABLES: Tbl[] = [
  {name: 'Salg', cols: ['OrdreID', 'DatoID', 'KundeID', 'ProduktID', 'RegionID', 'Beløb'], x: 470, y: 270, fact: true},
  {name: 'Dato', cols: ['DatoID', 'År', 'Måned'], x: 70, y: 130, src: 'Kalender'},
  {name: 'Kunde', cols: ['KundeID', 'Navn', 'Segment'], x: 870, y: 130, src: 'CRM'},
  {name: 'Produkt', cols: ['ProduktID', 'Gruppe', 'Kostpris'], x: 70, y: 530, src: 'ERP'},
  {name: 'Region', cols: ['RegionID', 'Region', 'Budget'], x: 870, y: 530, src: 'Excel'},
];
const TW = 250;
const tblH = (t: Tbl) => 52 + t.cols.length * 34;

const DataModel: React.FC<{t: number}> = ({t}) => {
  const fact = TABLES[0];
  return (
    <div style={{position: 'absolute', inset: 0, background: '#fff', borderRadius: 20, border: `1px solid ${C.line}`, boxShadow: SHADOW, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 28, top: 22, fontFamily: F.mono, fontSize: 16, letterSpacing: '0.12em', color: C.muted}}>DATAMODEL · STJERNESKEMA</div>
      {/* faint grid */}
      <div style={{position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle, ${C.line} 1.3px, transparent 1.5px)`, backgroundSize: '28px 28px', opacity: 0.7}} />
      <svg width={ST.w} height={ST.h} style={{position: 'absolute', inset: 0}}>
        {TABLES.slice(1).map((d, i) => {
          const fx = fact.x + TW / 2, fy = fact.y + tblH(fact) / 2;
          const dx = d.x + TW / 2, dy = d.y + tblH(d) / 2;
          const pr = ramp(t, 0.9 + i * 0.15, 0.6, INOUT);
          const mx = lerp(dx, fx, 0.5), my = lerp(dy, fy, 0.5);
          return (
            <g key={d.name}>
              <line x1={dx} y1={dy} x2={lerp(dx, fx, pr)} y2={lerp(dy, fy, pr)} stroke={C.accent} strokeWidth={2.5} />
              {pr >= 1 && (
                <g>
                  <circle cx={mx} cy={my} r={15} fill="#fff" stroke={C.accent} strokeWidth={2} />
                  <text x={mx} y={my + 5} textAnchor="middle" fontFamily="Inter" fontWeight={700} fontSize={14} fill={C.accentInk}>1:*</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
      {TABLES.map((tb, i) => {
        const e = ramp(t, 0.1 + i * 0.12, 0.5);
        const src = ramp(t, 1.9 + i * 0.12, 0.4);
        return (
          <div key={tb.name} style={{position: 'absolute', left: tb.x, top: tb.y, width: TW, opacity: e, transform: `translateY(${(1 - e) * 20}px)`}}>
            <div style={{borderRadius: 12, overflow: 'hidden', border: `1.5px solid ${tb.fact ? C.accent : C.line}`, background: '#fff', boxShadow: '0 12px 30px -18px rgb(11 31 51 / 0.4)'}}>
              <div style={{height: 52, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10, background: tb.fact ? C.accent : C.frost, color: tb.fact ? C.onAccent : C.ink, fontFamily: F.sans, fontWeight: 650, fontSize: 21}}>
                <svg width={18} height={18} viewBox="0 0 18 18"><rect x={1} y={1} width={16} height={16} rx={3} fill="none" stroke="currentColor" strokeWidth={1.8} /><path d="M1 7h16M7 7v10" stroke="currentColor" strokeWidth={1.8} /></svg>
                {tb.name}
              </div>
              {tb.cols.map((c) => <div key={c} style={{height: 34, display: 'flex', alignItems: 'center', padding: '0 16px', fontFamily: F.mono, fontSize: 16, color: C.ink, borderTop: `1px solid ${C.frost}`}}>{c}</div>)}
            </div>
            {tb.src && (
              <div style={{position: 'absolute', right: -14, top: -16, opacity: src, transform: `scale(${0.7 + 0.3 * src})`, display: 'flex', alignItems: 'center', gap: 8, background: C.deep, color: C.onDeep, fontFamily: F.mono, fontSize: 14, padding: '6px 12px', borderRadius: 999}}>
                <span style={{width: 8, height: 8, borderRadius: '50%', background: C.accentHi}} />{tb.src}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ---------- B: an outdated, cluttered report ----------
const RAINBOW = ['#e74c3c', '#f1c40f', '#3498db', '#9b59b6', '#2ecc71', '#e67e22'];
const Pie: React.FC<{x: number; y: number; r: number; seed: number}> = ({x, y, r, seed}) => {
  let a = 0;
  const parts = [22, 9, 17, 14, 26, 12].map((v, i) => ((v * (seed + i)) % 30) + 8);
  const sum = parts.reduce((m, v) => m + v, 0);
  return (
    <svg width={r * 2 + 4} height={r * 2 + 4} style={{position: 'absolute', left: x, top: y}}>
      {parts.map((v, i) => {
        const a0 = a, a1 = a + (v / sum) * Math.PI * 2; a = a1;
        const p0 = [r + 2 + r * Math.sin(a0), r + 2 - r * Math.cos(a0)], p1 = [r + 2 + r * Math.sin(a1), r + 2 - r * Math.cos(a1)];
        return <path key={i} d={`M ${r + 2} ${r + 2} L ${p0[0]} ${p0[1]} A ${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${p1[0]} ${p1[1]} Z`} fill={RAINBOW[(i + seed) % 6]} stroke="#fff" strokeWidth={1} />;
      })}
    </svg>
  );
};
const OldReport: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, background: '#e9e9e9', borderRadius: 20, overflow: 'hidden', fontFamily: 'Georgia, serif', border: '1px solid #c8c8c8'}}>
    <div style={{height: 54, background: '#7a7a7a', color: '#fff', display: 'flex', alignItems: 'center', padding: '0 20px', fontSize: 24, fontWeight: 700}}>SALGSRAPPORT v3 (KOPI) – MÅ IKKE ÆNDRES</div>
    <Pie x={30} y={80} r={110} seed={1} />
    <Pie x={270} y={110} r={90} seed={3} />
    <Pie x={480} y={70} r={120} seed={5} />
    <div style={{position: 'absolute', left: 760, top: 80, width: 400, background: '#fff', border: '1px solid #aaa', fontSize: 13, fontFamily: 'Arial, sans-serif'}}>
      {Array.from({length: 14}).map((_, r) => (
        <div key={r} style={{display: 'flex', borderBottom: '1px solid #ddd', background: r % 2 ? '#f4f4f4' : '#fff'}}>
          {[0, 1, 2, 3, 4].map((c) => <span key={c} style={{flex: 1, padding: '3px 6px', color: r === 0 ? '#000' : '#444', fontWeight: r === 0 ? 700 : 400}}>{r === 0 ? ['Kunde', 'Q1', 'Q2', 'Q3', 'Total'][c] : c === 0 ? `Kunde ${r}` : ((r * 7919 + c * 104729) % 9000 + 1000).toLocaleString('da-DK')}</span>)}
        </div>
      ))}
    </div>
    <div style={{position: 'absolute', left: 30, top: 360, width: 690, height: 300, background: '#fff', border: '1px solid #aaa'}}>
      <svg width={690} height={300}>
        {Array.from({length: 18}).map((_, i) => <rect key={i} x={20 + i * 37} y={300 - 40 - ((i * 37) % 170) - 30} width={26} height={((i * 37) % 170) + 30} fill={RAINBOW[i % 6]} />)}
      </svg>
    </div>
    <div style={{position: 'absolute', left: 760, top: 480, width: 400, height: 180, background: '#fff', border: '2px dashed #c0392b', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'Arial, sans-serif', color: '#c0392b'}}>
      <div style={{fontSize: 40}}>⚠</div>
      <div style={{fontSize: 18, fontWeight: 700}}>Visual kunne ikke indlæses</div>
      <div style={{fontSize: 14, color: '#777'}}>Datakilden blev ikke fundet</div>
    </div>
    <div style={{position: 'absolute', left: 30, bottom: 24, fontSize: 15, color: '#666', fontFamily: 'Arial, sans-serif'}}>Sidst opdateret: 3. marts · Indlæsning 38 sek.</div>
  </div>
);

const Label: React.FC<{children: React.ReactNode; dark?: boolean; x: number; y: number; o: number}> = ({children, dark, x, y, o}) => (
  <div style={{position: 'absolute', left: x, top: y, opacity: o, fontFamily: F.mono, fontSize: 18, fontWeight: 500, letterSpacing: '0.12em', padding: '8px 16px', borderRadius: 999, background: dark ? C.deep : '#fff', color: dark ? C.accentHi : C.muted, border: `1px solid ${dark ? C.deep : C.line}`, boxShadow: '0 10px 24px -14px rgb(0 0 0 / 0.5)'}}>{children}</div>
);

// ---------- C: optimisation panel ----------
const PERF: [string, number, number][] = [['Omsætning pr. måned', 4.8, 0.4], ['Største kunder', 6.2, 0.6], ['Omsætning pr. region', 3.1, 0.3], ['KPI-kort', 2.4, 0.3]];

export const S3Deliver: React.FC = () => {
  const s = useSec();
  const p = useProg();
  const sp = useSpringAt();
  const active = ACTIVE.findIndex((a, i) => s >= a && s < ACTIVE[i + 1]);

  const aOut = p(SEG_B - 0.15, 0.45, INOUT);
  const bIn = p(SEG_B - 0.15, 0.5, EXPO);
  const wipe = p(WIPE, 0.75, INOUT);
  const cT = p(SEG_C, 2.5, INOUT);                       // camera move across the dashboard
  const tilt = p(SEG_C, 0.9, INOUT);                     // flat 'after' view tilts into perspective
  const perf = p(SEG_C + 0.5, 1.2, INOUT);

  // cursor clicks "Midtjylland" right after the rebuild to show interactivity
  const CLICK = 5.35;
  const selP = p(CLICK, 0.45, EXPO);
  const curMove = p(4.85, 0.5, EXPO);
  const dashScale = ST.w / DW; // 0.744

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <FrostBg />

      {/* left: services */}
      <div style={{position: 'absolute', left: 110, top: 150}}>
        <MaskLine at={0.05} dur={0.5} style={{fontFamily: F.display, fontWeight: 500, fontSize: 62, letterSpacing: '-0.02em', color: C.ink, lineHeight: 1.1}}>Hele vejen</MaskLine>
        <MaskLine at={0.15} dur={0.5} style={{fontFamily: F.display, fontStyle: 'italic', fontWeight: 500, fontSize: 62, letterSpacing: '-0.02em', color: C.accentInk, lineHeight: 1.1}}>rundt.</MaskLine>
        <div style={{display: 'flex', flexDirection: 'column', gap: 18, marginTop: 50}}>
          {SERVICES.map((t, i) => {
            const e = sp(ACTIVE[i] - 0.05, {damping: 16, stiffness: 190});
            const on = active === i;
            const done = active > i;
            return (
              <div key={t} style={{width: 460, minHeight: 82, boxSizing: 'border-box', borderRadius: 16, padding: '0 24px', display: 'flex', alignItems: 'center', gap: 18, opacity: Math.min(1, e * 1.5), transform: `translateX(${(1 - e) * -40}px)`, background: on ? C.deep : '#fff', border: `1.5px solid ${on ? C.deep : C.line}`, boxShadow: on ? '0 20px 40px -20px rgb(11 31 51 / 0.6)' : undefined}}>
                <span style={{fontFamily: F.mono, fontSize: 18, color: on ? C.accentHi : C.muted}}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{fontFamily: F.sans, fontWeight: 600, fontSize: 27, color: on ? C.onDeep : done ? C.muted : C.ink, lineHeight: 1.2, padding: '18px 0'}}>{t}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* stage */}
      <div style={{position: 'absolute', left: ST.x, top: ST.y, width: ST.w, height: ST.h}}>
        {/* A: data model */}
        {aOut < 1 && (
          <div style={{position: 'absolute', inset: 0, opacity: 1 - aOut, transform: `scale(${1 - aOut * 0.04})`}}>
            <DataModel t={s} />
          </div>
        )}

        {/* B: before -> after */}
        {s >= SEG_B - 0.15 && s < SEG_C && (
          <div style={{position: 'absolute', inset: 0, opacity: bIn}}>
            <div style={{position: 'absolute', inset: 0, clipPath: `inset(0 0 0 ${wipe * 100}%)`}}>
              <OldReport />
            </div>
            <div style={{position: 'absolute', inset: 0, clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)`}}>
              <div style={{position: 'absolute', left: 0, top: (ST.h - DH * dashScale) / 2, width: DW, height: DH, transform: `scale(${dashScale})`, transformOrigin: 'top left'}}>
                <Dashboard t={99} sel={1} selP={selP} />
              </div>
            </div>
            {wipe > 0 && wipe < 1 && <div style={{position: 'absolute', top: -10, bottom: -10, left: `${wipe * 100}%`, width: 6, marginLeft: -3, background: C.accent, borderRadius: 3, boxShadow: `0 0 20px ${C.accent}`}} />}
            <Label x={24} y={-22} o={1 - wipe}>FØR</Label>
            <Label x={24} y={-22} o={wipe} dark>EFTER</Label>
          </div>
        )}

        {/* C: tilted dashboard, camera glides across, performance panel */}
        {s >= SEG_C && (
          <div style={{position: 'absolute', inset: -40, perspective: 2200}}>
            <div style={{position: 'absolute', left: 40, top: 40 + (ST.h - DH * dashScale) / 2, width: DW, height: DH, transformOrigin: 'top left', transform: `translate(${tilt * lerp(-20, -150, cT)}px, ${tilt * lerp(10, -40, cT)}px) rotateY(${tilt * lerp(-16, -8, cT)}deg) rotateX(${tilt * lerp(7, 3, cT)}deg) scale(${dashScale * lerp(1, lerp(1.02, 1.12, cT), tilt)})`}}>
              <Dashboard t={99} sel={1} selP={1} />
            </div>
            <div style={{position: 'absolute', right: 30, top: 150, width: 440, boxSizing: 'border-box', background: C.deep, borderRadius: 18, padding: '24px 26px', boxShadow: '0 40px 80px -30px rgb(0 0 0 / 0.6)', opacity: p(SEG_C + 0.3, 0.4), transform: `translateX(${(1 - p(SEG_C + 0.3, 0.6, EXPO)) * 80}px)`}}>
              <div style={{fontFamily: F.mono, fontSize: 15, letterSpacing: '0.12em', color: C.accentHi}}>YDEEVNE · INDLÆSNINGSTID</div>
              {PERF.map(([n, a, b], i) => {
                const k = ramp(perf, i * 0.08, 0.7, INOUT);
                const v = lerp(a, b, k);
                return (
                  <div key={n} style={{marginTop: 18}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: F.sans, fontSize: 18, color: C.onDeep}}>
                      <span>{n}</span><span style={{fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: k >= 1 ? C.accentHi : C.onDeep}}>{da(v)} s</span>
                    </div>
                    <div style={{height: 7, borderRadius: 4, background: C.deepLine, marginTop: 8}}>
                      <div style={{height: '100%', width: `${(v / 6.2) * 100}%`, borderRadius: 4, background: k >= 1 ? C.accentHi : '#ff9b8f'}} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* cursor for the cross-filter click */}
      {s > 4.8 && s < SEG_C + 0.1 && (
        <div style={{position: 'absolute', left: lerp(1500, ST.x + 200, curMove), top: lerp(980, ST.y + (ST.h - DH * dashScale) / 2 + (662 + 52 + 26 + 6) * dashScale, curMove), opacity: p(4.8, 0.2) * (1 - p(SEG_C - 0.2, 0.3)), transform: `scale(${1 - (p(CLICK, 0.06) - p(CLICK + 0.1, 0.12)) * 0.15})`}}>
          <Cursor size={46} />
        </div>
      )}

      {SERVICES.map((_, i) => <Sfx key={i} at={ACTIVE[i]} src="click_003.ogg" volume={0.22} />)}
      <Sfx at={0.9} src="keypress-001.wav" volume={0.12} />
      <Sfx at={WIPE} src="card-slide-1.ogg" volume={0.4} />
      <Sfx at={CLICK} src="click2.ogg" volume={0.45} />
      <Sfx at={SEG_C + 1.6} src="chime_soft.wav" volume={0.18} />
    </AbsoluteFill>
  );
};
