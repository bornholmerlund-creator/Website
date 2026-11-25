// 0:23.4–0:33  Ongoing support: performance, reliable refresh, structured releases and secure access,
// then the credibility statement (700+ users).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, CheckIcon, DeepBg, EXPO, F, INOUT, Kicker, MaskLine, Sfx, da, lerp, useProg, useSec, useSpringAt} from '../kit';

const CRED = 5.0;  // cards leave, credibility statement comes in
const CW = 405, CH = 400, CX0 = 110, CGAP = 25, CY = 360;

const CardShell: React.FC<{i: number; title: string; kicker: string; children: React.ReactNode}> = ({i, title, kicker, children}) => {
  const sp = useSpringAt();
  const e = sp(0.45 + i * 0.18, {damping: 16, stiffness: 170});
  return (
    <div style={{position: 'absolute', left: CX0 + i * (CW + CGAP), top: CY, width: CW, height: CH, boxSizing: 'border-box', borderRadius: 20, background: C.deep2, border: `1.5px solid ${C.deepLine}`, padding: '28px 30px', opacity: Math.min(1, e * 1.4), transform: `translateY(${(1 - e) * 60}px)`}}>
      <Kicker size={15} color={C.accentHi}>{kicker}</Kicker>
      <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 30, color: C.onDeep, marginTop: 10}}>{title}</div>
      <div style={{position: 'relative', marginTop: 26}}>{children}</div>
    </div>
  );
};

export const S4Support: React.FC = () => {
  const s = useSec();
  const p = useProg();
  const out = p(CRED, 0.5, INOUT);

  // 1 performance
  const perf = p(1.1, 1.3, INOUT);
  // 2 refresh history
  const DAYS = ['Man', 'Tir', 'Ons', 'Tor', 'Fre'];
  // 3 release pipeline
  const STAGES = ['Udvikling', 'Test', 'Produktion'];
  const rel = p(1.4, 1.8, INOUT);
  // 4 security
  const ROLES: [string, string][] = [['Ledelse', 'Alle data'], ['Salg', 'Egen region'], ['Økonomi', 'Alle selskaber']];

  // credibility
  const count = p(CRED + 0.45, 1.5, EXPO);
  const curve = p(CRED + 0.4, 1.8, INOUT);
  const users = Math.round(700 * count);

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <DeepBg drift={20} />

      {/* part 1: the work continues */}
      <AbsoluteFill style={{opacity: 1 - out, transform: `translateY(${-out * 70}px)`}}>
        <div style={{position: 'absolute', left: CX0, top: 120}}>
          <MaskLine at={0.1} dur={0.5}><Kicker color={C.onDeepMuted}>Efter leveringen</Kicker></MaskLine>
          <div style={{height: 18}} />
          <MaskLine at={0.2} dur={0.55} style={{fontFamily: F.display, fontWeight: 500, fontSize: 80, letterSpacing: '-0.02em', color: C.onDeep}}>
            Løsningen bliver ved med at <span style={{fontStyle: 'italic', color: C.accentHi}}>virke</span>.
          </MaskLine>
        </div>

        <CardShell i={0} kicker="Ydeevne" title="Hurtigere rapporter">
          <div style={{fontFamily: F.mono, fontSize: 15, color: C.onDeepMuted}}>INDLÆSNINGSTID</div>
          <div style={{fontFamily: F.display, fontWeight: 500, fontSize: 84, color: perf >= 1 ? C.accentHi : C.onDeep, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1, marginTop: 6}}>{da(lerp(12.4, 1.6, perf))} s</div>
          <div style={{height: 10, borderRadius: 5, background: C.deepLine, marginTop: 18}}>
            <div style={{height: '100%', width: `${lerp(100, 13, perf)}%`, borderRadius: 5, background: perf >= 1 ? C.accentHi : '#ff9b8f'}} />
          </div>
          <div style={{fontFamily: F.sans, fontSize: 18, color: C.onDeepMuted, marginTop: 14}}>Optimeret datamodel og DAX</div>
        </CardShell>

        <CardShell i={1} kicker="Dataopdatering" title="Pålidelige tal">
          {DAYS.map((d, i) => {
            const ok = p(1.0 + i * 0.22, 0.25);
            return (
              <div key={d} style={{display: 'flex', alignItems: 'center', gap: 14, height: 38, fontFamily: F.mono, fontSize: 18, color: C.onDeep, borderBottom: `1px solid ${C.deepLine}`}}>
                <span style={{width: 50, color: C.onDeepMuted}}>{d}</span>
                <span style={{flex: 1}}>06:00</span>
                <span style={{opacity: ok, transform: `scale(${0.5 + 0.5 * ok})`, display: 'flex', alignItems: 'center', gap: 8, color: C.accentHi}}><CheckIcon size={20} color={C.accentHi} stroke={3} />OK</span>
              </div>
            );
          })}
        </CardShell>

        <CardShell i={2} kicker="Udvikling & releases" title="Struktureret drift">
          <div style={{position: 'relative', height: 150}}>
            <div style={{position: 'absolute', left: 20, right: 20, top: 24, height: 3, background: C.deepLine}} />
            <div style={{position: 'absolute', left: 20, top: 24, height: 3, width: `${rel * 305}px`, background: C.accentHi}} />
            {STAGES.map((st, i) => {
              const reached = rel >= i / 2 - 0.001 && s > 1.4;
              return (
                <div key={st} style={{position: 'absolute', left: 20 + i * 152.5 - 18, top: 7, display: 'flex', flexDirection: 'column', alignItems: 'center', width: 36}}>
                  <div style={{width: 36, height: 36, borderRadius: '50%', boxSizing: 'border-box', background: reached ? C.accentHi : C.deep2, border: `2.5px solid ${reached ? C.accentHi : C.deepLine}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    {reached && <CheckIcon size={20} color={C.onAccent} stroke={3.2} />}
                  </div>
                  <div style={{fontFamily: F.sans, fontSize: 17, color: C.onDeep, marginTop: 12, whiteSpace: 'nowrap'}}>{st}</div>
                </div>
              );
            })}
            <div style={{position: 'absolute', left: 0, top: 110, fontFamily: F.mono, fontSize: 17, color: rel >= 1 ? C.accentHi : C.onDeepMuted, opacity: p(1.5, 0.3)}}>{rel >= 1 ? '✓ Version 2.4 udgivet' : 'Version 2.4 · tester…'}</div>
          </div>
        </CardShell>

        <CardShell i={3} kicker="Sikker adgang" title="Rette data, rette folk">
          {ROLES.map(([r, v], i) => {
            const o = p(1.2 + i * 0.25, 0.3);
            return (
              <div key={r} style={{display: 'flex', alignItems: 'center', gap: 12, height: 48, opacity: o, transform: `translateX(${(1 - o) * 20}px)`, borderBottom: `1px solid ${C.deepLine}`}}>
                <svg width={20} height={22} viewBox="0 0 20 22" fill="none"><rect x={2} y={9} width={16} height={12} rx={3} fill={C.accentHi} /><path d="M6 9V6a4 4 0 0 1 8 0v3" stroke={C.accentHi} strokeWidth={2.4} /></svg>
                <span style={{fontFamily: F.sans, fontWeight: 600, fontSize: 19, color: C.onDeep, width: 100}}>{r}</span>
                <span style={{fontFamily: F.sans, fontSize: 18, color: C.onDeepMuted}}>{v}</span>
              </div>
            );
          })}
        </CardShell>
      </AbsoluteFill>

      {/* part 2: credibility */}
      {s > CRED && (
        <AbsoluteFill style={{alignItems: 'center'}}>
          <div style={{marginTop: 150, opacity: p(CRED + 0.3, 0.4)}}><Kicker color={C.onDeepMuted}>Erfaring i stor skala</Kicker></div>
          <div style={{fontFamily: F.display, fontWeight: 500, fontSize: 260, lineHeight: 1, letterSpacing: '-0.04em', color: C.accentHi, marginTop: 20, fontVariantNumeric: 'tabular-nums', opacity: p(CRED + 0.35, 0.3), transform: `scale(${lerp(0.92, 1, p(CRED + 0.35, 1.2, EXPO))})`}}>
            {users}<span style={{opacity: count > 0.97 ? 1 : 0}}>+</span>
          </div>
          <MaskLine at={CRED + 1.2} dur={0.6} style={{fontFamily: F.display, fontWeight: 500, fontSize: 60, letterSpacing: '-0.02em', color: C.onDeep, marginTop: 16, textAlign: 'center'}}>
            Erfaring fra Power BI-løsninger med 700+ brugere
          </MaskLine>
          {/* adoption curve: from zero to 700+ */}
          <svg width={1100} height={150} style={{marginTop: 34, opacity: p(CRED + 0.4, 0.4)}}>
            <line x1={0} y1={128} x2={1100} y2={128} stroke={C.deepLine} strokeWidth={2} />
            <path d="M 0 128 C 220 126, 360 118, 520 92 S 820 22, 1100 12" fill="none" stroke={C.accentHi} strokeWidth={3.5} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - curve} />
            <text x={0} y={148} fontFamily="IBM Plex Mono" fontSize={16} fill={C.onDeepMuted}>0 brugere</text>
            <text x={1100} y={148} textAnchor="end" fontFamily="IBM Plex Mono" fontSize={16} fill={C.onDeepMuted} opacity={curve}>700+ brugere</text>
            {curve > 0.98 && <circle cx={1100} cy={12} r={7} fill={C.accentHi} />}
          </svg>
        </AbsoluteFill>
      )}

      {[0, 1, 2, 3].map((i) => <Sfx key={i} at={0.45 + i * 0.18} src="click_003.ogg" volume={0.16} />)}
      {[0, 1, 2, 3, 4].map((i) => <Sfx key={`d${i}`} at={1.0 + i * 0.22} src="keypress-001.wav" volume={0.1} />)}
      <Sfx at={3.2} src="chime_soft.wav" volume={0.18} />
      <Sfx at={CRED + 0.3} src="impactSoft_medium_001.ogg" volume={0.3} />
      <Sfx at={CRED + 1.9} src="bong_001.ogg" volume={0.2} />
    </AbsoluteFill>
  );
};
