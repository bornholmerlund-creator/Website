// Shared brand tokens, fonts and motion helpers for the Northbound Data video.
// Motion helpers are adapted from the superbrag Remotion template
// (github.com/aakashmehra/superbrag, skills/superbrag/template/src/ui.tsx).
import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill, Audio, Easing, Sequence, continueRender, delayRender, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';

// ---------- brand (from assets/site.css on northbound-data.dk) ----------
export const C = {
  deep: '#0b1f33',
  deep2: '#122b47',
  deepLine: '#1e3650',
  onDeep: '#ffffff',
  onDeepMuted: '#b6c7d9',
  ground: '#ffffff',
  frost: '#f2f5f8',
  line: '#dce5ee',
  ink: '#0b1f33',
  muted: '#48627f',
  accent: '#0fb5a6',
  accentHi: '#2fcbbd',
  accentInk: '#0b7169',
  accentSoft: '#e3f6f3',
  onAccent: '#04121d',
  danger: '#b42318',
  dangerOnDeep: '#ff9b8f',
};
export const F = {
  display: '"Fraunces", Georgia, serif',
  sans: '"Inter", system-ui, sans-serif',
  mono: '"IBM Plex Mono", ui-monospace, monospace',
};
export const SHADOW = '0 2px 4px rgb(11 31 51 / 0.05), 0 24px 60px -24px rgb(11 31 51 / 0.32)';

// ---------- fonts: the site's own self-hosted woff2 files ----------
const FACES = `
@font-face{font-family:"Fraunces";font-style:normal;font-weight:100 900;src:url(${staticFile('fonts/fraunces-latin-opsz-normal.woff2')}) format("woff2");}
@font-face{font-family:"Fraunces";font-style:italic;font-weight:100 900;src:url(${staticFile('fonts/fraunces-latin-opsz-italic.woff2')}) format("woff2");}
@font-face{font-family:"Inter";font-style:normal;font-weight:100 900;src:url(${staticFile('fonts/inter-latin-wght-normal.woff2')}) format("woff2");}
@font-face{font-family:"IBM Plex Mono";font-style:normal;font-weight:400;src:url(${staticFile('fonts/ibm-plex-mono-latin-400-normal.woff2')}) format("woff2");}
@font-face{font-family:"IBM Plex Mono";font-style:normal;font-weight:500;src:url(${staticFile('fonts/ibm-plex-mono-latin-500-normal.woff2')}) format("woff2");}
`;
export const Fonts: React.FC = () => {
  const [handle] = useState(() => delayRender('Loading brand fonts'));
  useEffect(() => {
    const probes = ['500 40px Fraunces', 'italic 500 40px Fraunces', '400 40px Inter', '600 40px Inter', '400 40px "IBM Plex Mono"', '500 40px "IBM Plex Mono"'];
    Promise.all(probes.map((p) => document.fonts.load(p, 'Data æøå').catch(() => null))).then(() => continueRender(handle));
  }, [handle]);
  return <style>{FACES}</style>;
};

// ---------- timing ----------
/** Seconds -> frames for the current fps, so the same timeline renders at 30 or 60 fps. */
export const useT = () => {
  const {fps} = useVideoConfig();
  return (s: number) => Math.round(s * fps);
};
export const EXPO = Easing.bezier(0.16, 1, 0.3, 1);       // fast out, crisp settle
export const INOUT = Easing.bezier(0.65, 0, 0.35, 1);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** 0..1 progress between two times (seconds, scene-relative). */
export const useProg = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (from: number, dur: number, easing: (t: number) => number = EXPO) =>
    interpolate(frame / fps, [from, from + dur], [0, 1], {...clamp, easing});
};

export const useSpringAt = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (at: number, config: {damping?: number; stiffness?: number; mass?: number} = {damping: 18, stiffness: 170}) =>
    spring({frame: frame - at * fps, fps, config});
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const mix = (a: number, b: number, t: number) => lerp(a, b, Math.max(0, Math.min(1, t)));

/** Seconds since scene start (float). */
export const useSec = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame / fps;
};

// ---------- reveal primitives ----------
/** Fade + rise, fast expo ease. `at` in seconds. */
export const Rise: React.FC<{at?: number; y?: number; dur?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({at = 0, y = 34, dur = 0.55, style, children}) => {
  const p = useProg()(at, dur);
  return <div style={{...style, opacity: p, transform: `translateY(${(1 - p) * y}px)`}}>{children}</div>;
};

/** Text line revealed from behind a mask (slides up from below its own baseline). */
export const MaskLine: React.FC<{at?: number; dur?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({at = 0, dur = 0.6, style, children}) => {
  const p = useProg()(at, dur);
  return (
    <div style={{overflow: 'hidden', paddingBottom: '0.12em', marginBottom: '-0.12em', ...style}}>
      <div style={{transform: `translateY(${(1 - p) * 110}%)`}}>{children}</div>
    </div>
  );
};

/** Springy pop. */
export const Pop: React.FC<{at?: number; from?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({at = 0, from = 0.6, style, children}) => {
  const sp = useSpringAt();
  const s = sp(at, {damping: 12, stiffness: 190});
  const o = useProg()(at, 0.2);
  const {transform = '', ...rest} = style ?? {};
  return <div style={{...rest, opacity: o, transform: `${transform} scale(${from + (1 - from) * s})`}}>{children}</div>;
};

// ---------- sound ----------
export const Sfx: React.FC<{at: number; src: string; volume?: number}> = ({at, src, volume = 0.4}) => {
  const t = useT();
  return (
    <Sequence from={Math.max(0, t(at))} durationInFrames={t(1.6)} layout="none">
      <Audio src={staticFile(`sfx/${src}`)} volume={volume} />
    </Sequence>
  );
};

// ---------- backgrounds ----------
/** Deep navy with the site's topographic contour texture, drifting slowly. */
export const DeepBg: React.FC<{drift?: number}> = ({drift = 0}) => {
  const s = useSec() + drift;
  const dx = Math.sin(s * 0.35) * 30, dy = s * 6;
  return (
    <AbsoluteFill style={{background: C.deep, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          backgroundImage:
            'repeating-radial-gradient(ellipse 130% 95% at 95% -5%, transparent 0 46px, rgb(255 255 255 / 0.055) 46px 48px),' +
            'repeating-radial-gradient(ellipse 90% 70% at 75% 115%, transparent 0 64px, rgb(255 255 255 / 0.04) 64px 66px)',
          transform: `translate(${dx}px, ${dy - 40}px) scale(1.08)`,
          WebkitMaskImage: 'linear-gradient(to left, #000 20%, transparent 90%)',
          maskImage: 'linear-gradient(to left, #000 20%, transparent 90%)',
        }}
      />
    </AbsoluteFill>
  );
};

export const FrostBg: React.FC = () => {
  const s = useSec();
  return (
    <AbsoluteFill style={{background: C.frost, overflow: 'hidden'}}>
      {/* faint data grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(circle, ${C.line} 1.6px, transparent 1.8px)`,
          backgroundSize: '40px 40px',
          backgroundPosition: `${-s * 8}px 0px`,
          opacity: 0.8,
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 60%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, #000 60%)',
        }}
      />
    </AbsoluteFill>
  );
};

// ---------- atoms ----------
export const Kicker: React.FC<{children: React.ReactNode; color?: string; size?: number}> = ({children, color = C.accentHi, size = 22}) => (
  <div style={{fontFamily: F.mono, fontWeight: 500, fontSize: size, letterSpacing: '0.16em', textTransform: 'uppercase', color}}>{children}</div>
);

/** The Northbound Data keystone mark (brand/northbound-data-logo-square.svg). `draw` 0..1 strokes the outline, `fill` 0..1 pops the core. */
export const Keystone: React.FC<{size: number; draw?: number; fill?: number; color?: string}> = ({size, draw = 1, fill = 1, color = C.accentHi}) => {
  const L = 80; // approx outline length in viewBox units
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{display: 'block', overflow: 'visible'}}>
      <path d="M16 3L27 11V21C27 26 22 29 16 29C10 29 5 26 5 21V11L16 3Z" stroke={color} strokeWidth={2.2} strokeLinejoin="round" strokeDasharray={L} strokeDashoffset={L * (1 - draw)} />
      <path d="M16 9L21 13V19L16 23L11 19V13L16 9Z" fill={color} style={{transformOrigin: '16px 16px', transform: `scale(${fill})`}} />
    </svg>
  );
};

export const Wordmark: React.FC<{size: number; color?: string}> = ({size, color = C.onDeep}) => (
  <span style={{fontFamily: F.display, fontWeight: 600, fontSize: size, letterSpacing: '-0.02em', color, whiteSpace: 'nowrap'}}>Northbound Data</span>
);

export const CheckIcon: React.FC<{size?: number; color?: string; stroke?: number}> = ({size = 24, color = C.accent, stroke = 2.6}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5 10 17.5 19 7" />
  </svg>
);

export const Arrow: React.FC<{size?: number; color?: string}> = ({size = 28, color = 'currentColor'}) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 10h12M11 5l5 5-5 5" />
  </svg>
);

export const Cursor: React.FC<{size?: number}> = ({size = 46}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M4 2.5v17.2l4.6-4.4 2.9 6.6 2.6-1.1-2.8-6.5H18z" fill="#0b1f33" stroke="#fff" strokeWidth={1.4} strokeLinejoin="round" />
  </svg>
);

/** Danish number formatting with one decimal where needed: 6.5 -> "6,5". */
export const da = (n: number, dec = 1) => {
  const r = Math.round(n * 10 ** dec) / 10 ** dec;
  return r.toLocaleString('da-DK', {minimumFractionDigits: Number.isInteger(r) ? 0 : dec, maximumFractionDigits: dec});
};
