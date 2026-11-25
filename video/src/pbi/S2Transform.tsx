// 0:06–0:14.8  Transformation: the scattered windows become data sources, flow into one data model,
// and the model unfolds into a clean Power BI-style dashboard.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, CheckIcon, DeepBg, EXPO, F, INOUT, MaskLine, Sfx, lerp, useProg, useSec, useSpringAt} from '../kit';
import {Dashboard, DH, DW} from './Dashboard';
import {SCATTER, WINDOWS, WH, WW} from './Windows';

const NODES = [
  {label: 'Excel', sub: 'Budgetter og ark', win: 0},
  {label: 'ERP', sub: 'Økonomi og ordrer', win: 1},
  {label: 'SQL-database', sub: 'Salgsdata', win: 3},
  {label: 'CRM', sub: 'Kunder og pipeline', win: -1},
  {label: 'Webshop', sub: 'Onlinesalg', win: -1},
];
const NX = 150, NW = 330, NH = 84, NY0 = 236, NGAP = 128;
const HUB = {x: 1060, y: 540, w: 380, h: 220};
const OUT = 3.25;       // dashboard starts to unfold
const BUILD = 3.6;      // dashboard build-up starts
const DS = 0.8;         // dashboard scale on screen
const DX = (1920 - DW * DS) / 2, DY = 186;

const bez = (u: number, P: number[][], k: number) => (1 - u) ** 3 * P[0][k] + 3 * (1 - u) ** 2 * u * P[1][k] + 3 * (1 - u) * u ** 2 * P[2][k] + u ** 3 * P[3][k];

export const S2Transform: React.FC = () => {
  const s = useSec();
  const p = useProg();
  const sp = useSpringAt();

  const toNode = p(0, 1.1, EXPO);
  const paths = p(0.9, 1.0, INOUT);
  const hubIn = sp(1.35, {damping: 14, stiffness: 160});
  const flow = s > 1.6;
  const out = p(OUT, 0.7, INOUT);          // graph leaves, dashboard grows
  const dashGrow = p(OUT, 0.85, EXPO);
  const ty = (i: number) => NY0 + i * NGAP;

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DeepBg drift={6} />

      {/* the source graph */}
      <AbsoluteFill style={{opacity: 1 - out, transform: `translateX(${-out * 260}px) scale(${1 - out * 0.08})`}}>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          {NODES.map((_, i) => {
            const P = [[NX + NW, ty(i) + NH / 2], [NX + NW + 260, ty(i) + NH / 2], [HUB.x - HUB.w / 2 - 220, HUB.y], [HUB.x - HUB.w / 2, HUB.y]];
            const d = `M ${P[0][0]} ${P[0][1]} C ${P[1][0]} ${P[1][1]}, ${P[2][0]} ${P[2][1]}, ${P[3][0]} ${P[3][1]}`;
            const pi = Math.min(1, Math.max(0, paths * 1.4 - i * 0.1));
            return (
              <g key={i}>
                <path d={d} stroke={C.deepLine} strokeWidth={3} fill="none" />
                <path d={d} stroke={C.accentHi} strokeWidth={3} fill="none" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - pi} opacity={0.9} />
                {flow && [0, 0.33, 0.66].map((o) => {
                  const u = (s * 0.9 + o + i * 0.13) % 1;
                  return <circle key={o} cx={bez(u, P, 0)} cy={bez(u, P, 1)} r={6} fill={C.accentHi} opacity={Math.sin(u * Math.PI)} />;
                })}
              </g>
            );
          })}
          {/* output beam towards the dashboard */}
          <path d={`M ${HUB.x + HUB.w / 2} ${HUB.y} L 1860 ${HUB.y}`} stroke={C.accentHi} strokeWidth={3} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p(2.5, 0.6, INOUT)} />
        </svg>

        {/* nodes */}
        {NODES.map((n, i) => {
          const g = n.win >= 0 ? SCATTER[n.win] : null;
          const e = g ? toNode : sp(0.35 + (i - 3) * 0.15, {damping: 14, stiffness: 180});
          const lit = p(1.0 + i * 0.12, 0.3);
          return (
            <div key={n.label} style={{position: 'absolute', left: NX, top: ty(i), width: NW, height: NH, opacity: g ? Math.min(1, toNode * 1.6) : e, transform: g ? undefined : `scale(${0.6 + 0.4 * e})`}}>
              <div style={{width: '100%', height: '100%', boxSizing: 'border-box', borderRadius: 14, background: C.deep2, border: `1.5px solid ${lit > 0.5 ? C.accentHi : C.deepLine}`, display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px'}}>
                <div style={{width: 12, height: 12, borderRadius: 3, background: lit > 0.5 ? C.accentHi : C.onDeepMuted}} />
                <div>
                  <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 26, color: C.onDeep}}>{n.label}</div>
                  <div style={{fontFamily: F.mono, fontSize: 15, color: C.onDeepMuted, marginTop: 2}}>{n.sub}</div>
                </div>
                <div style={{flex: 1}} />
                {lit > 0 && <div style={{opacity: lit}}><CheckIcon size={26} color={C.accentHi} stroke={3} /></div>}
              </div>
            </div>
          );
        })}

        {/* windows from scene 1 shrinking into their nodes */}
        {WINDOWS.map((Win, i) => {
          const g = SCATTER[i];
          const ni = NODES.findIndex((n) => n.win === i);
          const tx = ni >= 0 ? NX : 760, tyy = ni >= 0 ? ty(ni) : 540;
          const sc = lerp(g.s, ni >= 0 ? NW / WW : 0.2, toNode);
          const o = 1 - p(0.15, 0.6);
          if (o <= 0) return null;
          return (
            <div key={i} style={{position: 'absolute', left: lerp(g.x, tx, toNode), top: lerp(g.y, tyy, toNode), width: WW, height: WH, transform: `rotate(${g.r * (1 - toNode)}deg) scale(${sc})`, transformOrigin: 'top left', opacity: o}}>
              <Win tag={1 - toNode} />
            </div>
          );
        })}

        {/* hub: the shared data model */}
        <div style={{position: 'absolute', left: HUB.x - HUB.w / 2, top: HUB.y - HUB.h / 2, width: HUB.w, height: HUB.h, boxSizing: 'border-box', borderRadius: 20, background: C.deep2, border: `2px solid ${C.accentHi}`, opacity: Math.min(1, hubIn * 1.4), transform: `scale(${0.7 + 0.3 * hubIn})`, padding: '26px 30px', boxShadow: `0 0 ${40 + Math.sin(s * 3) * 10}px rgb(47 203 189 / 0.25)`}}>
          <div style={{fontFamily: F.mono, fontSize: 16, letterSpacing: '0.14em', color: C.accentHi}}>DATAMODEL</div>
          <div style={{fontFamily: F.display, fontWeight: 500, fontSize: 40, color: C.onDeep, marginTop: 8, lineHeight: 1.1}}>Ét fælles datagrundlag</div>
          <svg width={300} height={56} style={{marginTop: 14}}>
            {[0, 1, 2, 3].map((k) => <line key={k} x1={150} y1={28} x2={30 + k * 80} y2={k % 2 ? 6 : 50} stroke={C.onDeepMuted} strokeWidth={2} opacity={0.6} />)}
            {[0, 1, 2, 3].map((k) => <rect key={`r${k}`} x={14 + k * 80} y={k % 2 ? -4 : 40} width={32} height={20} rx={4} fill={C.deepLine} stroke={C.onDeepMuted} strokeWidth={1.5} />)}
            <rect x={128} y={16} width={44} height={24} rx={5} fill={C.accentHi} />
          </svg>
        </div>
      </AbsoluteFill>

      {/* dashboard unfolding from the hub */}
      {s >= OUT && (
        <div style={{position: 'absolute', left: lerp(HUB.x - (DW * DS * 0.24) / 2, DX, dashGrow), top: lerp(HUB.y - (DH * DS * 0.24) / 2, DY, dashGrow), width: DW, height: DH, transform: `scale(${lerp(0.24 * DS, DS, dashGrow)})`, transformOrigin: 'top left', opacity: Math.min(1, dashGrow * 3)}}>
          <Dashboard t={s - BUILD} />
        </div>
      )}

      {/* headline */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 62, display: 'flex', justifyContent: 'center'}}>
        <MaskLine at={0.55} dur={0.6} style={{fontFamily: F.display, fontWeight: 500, fontSize: 82, letterSpacing: '-0.02em', color: C.onDeep}}>
          Fra data til <span style={{fontStyle: 'italic', color: C.accentHi}}>indsigt</span>.
        </MaskLine>
      </div>

      <Sfx at={0.0} src="impactSoft_medium_001.ogg" volume={0.3} />
      {NODES.map((_, i) => <Sfx key={i} at={1.0 + i * 0.12} src="keypress-001.wav" volume={0.12} />)}
      <Sfx at={1.35} src="drop_002.ogg" volume={0.3} />
      <Sfx at={OUT} src="card-slide-1.ogg" volume={0.4} />
      <Sfx at={BUILD + 0.2} src="chime_soft.wav" volume={0.2} />
    </AbsoluteFill>
  );
};
