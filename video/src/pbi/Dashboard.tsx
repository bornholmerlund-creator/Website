// A realistic, Power BI-style report page drawn in the Northbound Data palette.
// Deliberately generic: no Microsoft logos or product chrome, just the familiar report layout
// (slicers, KPI cards, line/bar/donut visuals, a matrix and page tabs). All figures are sample data.
import React from 'react';
import {C, EXPO, F, INOUT, da} from '../kit';

export const DW = 1600, DH = 900;

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
const ACT = [3.4, 3.6, 3.9, 3.7, 4.1, 4.3, 3.8, 4.0, 4.4, 4.6, 4.5, 4.9];
const BUD = [3.5, 3.5, 3.7, 3.8, 3.9, 4.0, 3.8, 3.9, 4.1, 4.2, 4.3, 4.6];
export const REGIONS: [string, number][] = [['Hovedstaden', 16.8], ['Midtjylland', 12.1], ['Syddanmark', 9.7], ['Sjælland', 6.3], ['Nordjylland', 4.3]];
const DONUT: [string, number, string][] = [['Service', 38, C.accent], ['Software', 27, C.deep], ['Hardware', 21, '#7fa6cc'], ['Licenser', 14, '#bfe9e3']];
const CUSTOMERS: [string, number, number][] = [['Hansen A/S', 4.2, 14], ['Nordtrafik ApS', 3.1, 9], ['Fjord Foods A/S', 2.7, -3], ['Bech & Co', 2.2, 21]];

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
/** progress of an element that starts at `at` (s) and takes `dur` (s), given local time t */
export const ramp = (t: number, at: number, dur: number, ease: (x: number) => number = EXPO) => ease(clamp01((t - at) / dur));

const Card: React.FC<{x: number; y: number; w: number; h: number; t: number; at: number; title?: string; children?: React.ReactNode; dim?: number}> = ({x, y, w, h, t, at, title, children, dim = 0}) => {
  const p = ramp(t, at, 0.55);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, boxSizing: 'border-box', background: '#fff', borderRadius: 12, border: `1px solid ${C.line}`, padding: '18px 22px', opacity: p * (1 - dim * 0.55), transform: `translateY(${(1 - p) * 26}px)`}}>
      {title && <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 19, color: C.ink}}>{title}</div>}
      {children}
    </div>
  );
};

const Kpi: React.FC<{x: number; t: number; at: number; label: string; value: number; fmt: (v: number) => string; delta: string; spark: number[]}> = ({x, t, at, label, value, fmt, delta, spark}) => {
  const c = ramp(t, at + 0.15, 1.1, INOUT);
  const sp = ramp(t, at + 0.25, 0.9, INOUT);
  const max = Math.max(...spark), min = Math.min(...spark);
  const pts = spark.map((v, i) => `${(i / (spark.length - 1)) * 120},${36 - ((v - min) / (max - min)) * 32}`);
  return (
    <Card x={x} y={88} w={366} h={150} t={t} at={at}>
      <div style={{fontFamily: F.sans, fontWeight: 500, fontSize: 17, color: C.muted}}>{label}</div>
      <div style={{fontFamily: F.sans, fontWeight: 650, fontSize: 46, letterSpacing: '-0.02em', color: C.ink, marginTop: 6, fontVariantNumeric: 'tabular-nums'}}>{fmt(value * c)}</div>
      <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 16, color: delta.startsWith('−') ? C.danger : C.accentInk, marginTop: 4, opacity: c}}>{delta} <span style={{color: C.muted, fontWeight: 500}}>ift. sidste år</span></div>
      <svg width={124} height={40} style={{position: 'absolute', right: 20, bottom: 22}}>
        <polyline points={pts.join(' ')} fill="none" stroke={C.accent} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - sp} />
      </svg>
    </Card>
  );
};

export type DashProps = {
  /** seconds since the build-up started (large value = fully built) */
  t: number;
  /** cross-filter: selected region index and how far the highlight has animated in (0..1) */
  sel?: number;
  selP?: number;
  title?: string;
};

export const Dashboard: React.FC<DashProps> = ({t, sel = -1, selP = 0, title = 'Salgsoverblik 2026'}) => {
  const head = ramp(t, 0, 0.5);
  // ---------- line chart geometry ----------
  const LX = 24, LY = 258, LW = 960, LH = 384;
  const gx0 = 56, gx1 = LW - 40, gy0 = 92, gy1 = LH - 52;
  // cross-filter: a selected region scales every series and the y-axis follows
  const share = sel >= 0 ? REGIONS[sel][1] / 49.2 : 1;
  const k = 1 - selP * (1 - share);
  const vmin = 3.0 * k, vmax = 5.2 * k;
  const px = (i: number) => gx0 + (i / 11) * (gx1 - gx0);
  const py = (v: number) => gy1 - ((v - vmin) / (vmax - vmin)) * (gy1 - gy0);
  const line = ramp(t, 0.7, 1.4, INOUT);
  const act = ACT.map((v) => v * k), bud = BUD.map((v) => v * k);
  const actPath = act.map((v, i) => `${i ? 'L' : 'M'} ${px(i)} ${py(v)}`).join(' ');
  const budPath = bud.map((v, i) => `${i ? 'L' : 'M'} ${px(i)} ${py(v)}`).join(' ');
  const area = `${actPath} L ${px(11)} ${gy1} L ${px(0)} ${gy1} Z`;
  const ticks = [0, 1, 2, 3, 4].map((j) => (3 + 0.5 * j) * k);
  const lineCol = selP > 0.5 ? C.accentInk : C.accent;

  // ---------- donut ----------
  const donut = ramp(t, 0.9, 1.3, INOUT);
  let acc = 0;
  const R = 104, CXd = 150, CYd = 214;
  const arcs = DONUT.map(([name, v, col]) => {
    const a0 = (acc / 100) * Math.PI * 2 * donut, a1 = ((acc + v) / 100) * Math.PI * 2 * donut;
    acc += v;
    const p = (a: number) => [CXd + R * Math.sin(a), CYd - R * Math.cos(a)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return {name, v, col, d: `M ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1}`};
  });

  // ---------- bars ----------
  const bars = ramp(t, 1.1, 1.1, INOUT);

  return (
    <div style={{position: 'relative', width: DW, height: DH, background: C.frost, borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 6px rgb(11 31 51 / 0.08), 0 50px 120px -40px rgb(0 0 0 / 0.55)', fontFamily: F.sans}}>
      {/* report header with slicers */}
      <div style={{position: 'absolute', left: 0, top: 0, right: 0, height: 66, background: '#fff', borderBottom: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', padding: '0 26px', gap: 18, opacity: head}}>
        <div style={{width: 12, height: 30, borderRadius: 3, background: C.accent}} />
        <div style={{fontWeight: 650, fontSize: 25, color: C.ink, letterSpacing: '-0.01em'}}>{title}</div>
        <div style={{flex: 1}} />
        {[['År', '2026'], ['Region', sel >= 0 && selP > 0.5 ? REGIONS[sel][0] : 'Alle'], ['Valuta', 'DKK']].map(([k2, v]) => (
          <div key={k2} style={{display: 'flex', alignItems: 'center', gap: 10, border: `1px solid ${C.line}`, borderRadius: 8, padding: '7px 14px', fontSize: 16, color: C.muted}}>
            {k2}: <span style={{color: C.ink, fontWeight: 600}}>{v}</span>
            <svg width={12} height={12} viewBox="0 0 12 12"><path d="M2 4l4 4 4-4" stroke={C.muted} strokeWidth={1.8} fill="none" /></svg>
          </div>
        ))}
        <div style={{fontFamily: F.mono, fontSize: 14, color: C.muted, marginLeft: 8, display: 'flex', alignItems: 'center', gap: 8}}>
          <span style={{width: 9, height: 9, borderRadius: '50%', background: C.accent, display: 'inline-block'}} /> Opdateret i dag 06:00
        </div>
      </div>

      {/* KPI row */}
      <Kpi x={24} t={t} at={0.15} label="Omsætning" value={49.2 * k} fmt={(v) => `${da(v)} mio. kr.`} delta="+12,4 %" spark={[3, 3.2, 3.1, 3.5, 3.6, 3.9, 4.2, 4.1, 4.5]} />
      <Kpi x={410} t={t} at={0.25} label="Dækningsbidrag" value={31.2} fmt={(v) => `${da(v)} %`} delta="+1,8 pp" spark={[28, 28.5, 29.4, 29, 30, 30.4, 30.1, 31, 31.2]} />
      <Kpi x={796} t={t} at={0.35} label="Ordrer" value={12480 * k} fmt={(v) => Math.round(v).toLocaleString('da-DK')} delta="+6,1 %" spark={[9, 9.5, 9.8, 10.4, 10.2, 11, 11.6, 11.9, 12.5]} />
      <Kpi x={1182} t={t} at={0.45} label="Budgetopfyldelse" value={103} fmt={(v) => `${Math.round(v)} %`} delta="+4 pp" spark={[94, 96, 95, 98, 99, 101, 100, 102, 103]} />

      {/* line chart: actual vs budget per month */}
      <Card x={LX} y={LY} w={LW} h={LH} t={t} at={0.55} title="Omsætning pr. måned (mio. kr.)">
        <div style={{position: 'absolute', right: 24, top: 20, display: 'flex', gap: 22, fontSize: 15, color: C.muted}}>
          <span style={{display: 'flex', alignItems: 'center', gap: 8}}><span style={{width: 18, height: 4, background: C.accent, borderRadius: 2}} />Realiseret</span>
          <span style={{display: 'flex', alignItems: 'center', gap: 8}}><span style={{width: 18, height: 0, borderTop: `3px dashed ${C.deep}`}} />Budget</span>
        </div>
        <svg width={LW} height={LH} style={{position: 'absolute', left: 0, top: 0}}>
          <defs>
            <linearGradient id="pbiArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.accent} stopOpacity={0.22} />
              <stop offset="100%" stopColor={C.accent} stopOpacity={0} />
            </linearGradient>
            <clipPath id="pbiReveal"><rect x={0} y={0} width={gx0 + (gx1 - gx0) * line + 4} height={LH} /></clipPath>
          </defs>
          {ticks.map((v, j) => (
            <g key={j}>
              <line x1={gx0} x2={gx1} y1={py(v)} y2={py(v)} stroke={C.line} strokeWidth={1} />
              <text x={gx0 - 12} y={py(v) + 5} textAnchor="end" fontFamily="Inter" fontSize={14} fill={C.muted}>{da(v)}</text>
            </g>
          ))}
          {MONTHS.map((m, i) => <text key={m} x={px(i)} y={gy1 + 28} textAnchor="middle" fontFamily="Inter" fontSize={14} fill={C.muted}>{m}</text>)}
          <g clipPath="url(#pbiReveal)">
            <path d={area} fill="url(#pbiArea)" />
            <path d={budPath} fill="none" stroke={C.deep} strokeWidth={2.2} strokeDasharray="7 7" opacity={0.75} />
            <path d={actPath} fill="none" stroke={lineCol} strokeWidth={3.5} strokeLinejoin="round" />
            {act.map((v, i) => <circle key={i} cx={px(i)} cy={py(v)} r={4.5} fill="#fff" stroke={lineCol} strokeWidth={2.5} />)}
          </g>
        </svg>
      </Card>

      {/* donut: share by product group */}
      <Card x={1008} y={LY} w={568} h={LH} t={t} at={0.65} title="Fordeling pr. produktgruppe">
        <svg width={568} height={LH} style={{position: 'absolute', left: 0, top: 0}}>
          <circle cx={CXd} cy={CYd} r={R} fill="none" stroke={C.frost} strokeWidth={40} />
          {arcs.map((a) => <path key={a.name} d={a.d} fill="none" stroke={a.col} strokeWidth={40} />)}
          <text x={CXd} y={CYd - 4} textAnchor="middle" fontFamily="Inter" fontWeight={650} fontSize={30} fill={C.ink}>{da(49.2 * k * donut)}</text>
          <text x={CXd} y={CYd + 22} textAnchor="middle" fontFamily="Inter" fontSize={14} fill={C.muted}>mio. kr.</text>
        </svg>
        <div style={{position: 'absolute', left: 300, top: 120, display: 'flex', flexDirection: 'column', gap: 20}}>
          {DONUT.map(([n, v, col], i) => (
            <div key={n} style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 18, color: C.ink, opacity: ramp(t, 1.2 + i * 0.1, 0.4)}}>
              <span style={{width: 14, height: 14, borderRadius: 4, background: col}} />
              <span style={{width: 120}}>{n}</span>
              <span style={{fontWeight: 650, fontVariantNumeric: 'tabular-nums'}}>{v} %</span>
            </div>
          ))}
        </div>
      </Card>

      {/* bar chart: revenue by region (cross-filter source) */}
      <Card x={24} y={662} w={760} h={190} t={t} at={0.75} title="Omsætning pr. region">
        {REGIONS.map(([n, v], i) => {
          const isSel = sel === i;
          const dimmed = sel >= 0 && !isSel ? selP : 0;
          return (
            <div key={n} style={{position: 'absolute', left: 22, top: 52 + i * 26, display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: C.ink}}>
              <span style={{width: 116, color: C.muted}}>{n}</span>
              <div style={{width: (v / 16.8) * 470 * bars, height: 17, borderRadius: 4, background: isSel && selP > 0 ? C.accentInk : C.accent, opacity: 1 - dimmed * 0.65}} />
              <span style={{fontWeight: 600, fontVariantNumeric: 'tabular-nums', opacity: bars}}>{da(v)}</span>
            </div>
          );
        })}
      </Card>

      {/* matrix: top customers */}
      <Card x={808} y={662} w={768} h={190} t={t} at={0.85} title="Største kunder">
        <div style={{position: 'absolute', left: 22, right: 22, top: 52, fontSize: 15}}>
          <div style={{display: 'flex', color: C.muted, fontWeight: 600, borderBottom: `1px solid ${C.line}`, paddingBottom: 6}}>
            <span style={{flex: 1}}>Kunde</span><span style={{width: 160, textAlign: 'right'}}>Omsætning</span><span style={{width: 150, textAlign: 'right'}}>Udvikling</span>
          </div>
          {CUSTOMERS.map(([n, v, d], i) => (
            <div key={n} style={{display: 'flex', padding: '5px 0', color: C.ink, opacity: ramp(t, 1.1 + i * 0.08, 0.4), borderBottom: i < 3 ? `1px solid ${C.frost}` : undefined}}>
              <span style={{flex: 1}}>{n}</span>
              <span style={{width: 160, textAlign: 'right', fontVariantNumeric: 'tabular-nums'}}>{da(v)} mio. kr.</span>
              <span style={{width: 150, textAlign: 'right', fontWeight: 600, color: d < 0 ? C.danger : C.accentInk}}>{d < 0 ? `−${Math.abs(d)}` : `+${d}`} %</span>
            </div>
          ))}
        </div>
      </Card>

      {/* page tabs */}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 34, background: '#fff', borderTop: `1px solid ${C.line}`, display: 'flex', alignItems: 'stretch', padding: '0 18px', fontSize: 14, color: C.muted, opacity: head}}>
        {['Overblik', 'Salg', 'Økonomi', 'Kunder', 'Lager'].map((p, i) => (
          <div key={p} style={{padding: '0 20px', display: 'flex', alignItems: 'center', borderTop: i === 0 ? `3px solid ${C.accent}` : '3px solid transparent', color: i === 0 ? C.ink : C.muted, fontWeight: i === 0 ? 600 : 500}}>{p}</div>
        ))}
        <div style={{flex: 1}} />
        <div style={{display: 'flex', alignItems: 'center', fontFamily: F.mono, fontSize: 13}}>Eksempeldata</div>
      </div>
    </div>
  );
};
