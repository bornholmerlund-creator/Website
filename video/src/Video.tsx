// The 30-second timeline. All times are in seconds, so it renders identically at 30 and 60 fps.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, Fonts, INOUT, EXPO} from './kit';
import {Hook} from './scenes/Hook';
import {Intro} from './scenes/Intro';
import {Services} from './scenes/Services';
import {Proof} from './scenes/Proof';
import {Cta} from './scenes/Cta';

export const DURATION_S = 30;
const TR = 0.45; // transition length, seconds

type Enter = 'cut' | 'wipe' | 'slide';
const SCENES: {name: string; Comp: React.FC; start: number; end: number; enter: Enter}[] = [
  {name: '1 Hook (problem)', Comp: Hook, start: 0, end: 5, enter: 'cut'},
  {name: '2 Introduktion', Comp: Intro, start: 5, end: 12, enter: 'cut'},
  {name: '3 Løsninger', Comp: Services, start: 12, end: 19.3, enter: 'wipe'},
  {name: '4 Værdi (før/efter)', Comp: Proof, start: 19.3, end: 23, enter: 'slide'},
  {name: '5 Call to action', Comp: Cta, start: 23, end: 30, enter: 'wipe'},
];

/** Enter/exit motion for a scene: wipe = clip reveal with a teal edge; slide = horizontal push. */
const Transition: React.FC<{enter: Enter; exit?: Enter; dur: number; children: React.ReactNode}> = ({enter, exit, dur, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = frame / fps;
  const c = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
  const pin = interpolate(s, [0, TR], [0, 1], {...c, easing: enter === 'wipe' ? INOUT : EXPO});
  const pout = interpolate(s, [dur, dur + TR], [0, 1], {...c, easing: exit === 'wipe' ? INOUT : EXPO});
  let x = 0;
  let clip: string | undefined;
  if (enter === 'slide') x += (1 - pin) * 1920;
  if (exit === 'slide') x -= pout * 1920;
  if (exit === 'wipe') x -= pout * 240; // outgoing scene drifts left under the wipe
  if (enter === 'wipe' && pin < 1) clip = `inset(0 0 0 ${(1 - pin) * 100}%)`;
  return (
    <AbsoluteFill style={{transform: `translateX(${x}px)`, clipPath: clip}}>
      {children}
      {enter === 'wipe' && pin < 1 && <div style={{position: 'absolute', top: 0, bottom: 0, left: `${(1 - pin) * 100}%`, width: 10, background: C.accentHi}} />}
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => {
  const {fps, durationInFrames} = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  return (
    <AbsoluteFill style={{background: C.deep}}>
      <Fonts />
      {SCENES.map((sc, i) => {
        const next = SCENES[i + 1];
        const exit = next && next.enter !== 'cut' ? next.enter : undefined;
        const len = sc.end - sc.start + (exit ? TR : 0);
        return (
          <Sequence key={sc.name} name={sc.name} from={f(sc.start)} durationInFrames={f(len)} premountFor={f(1)}>
            <Transition enter={sc.enter} exit={exit} dur={sc.end - sc.start}>
              <sc.Comp />
            </Transition>
          </Sequence>
        );
      })}
      <Audio
        src={staticFile('music/bed.mp3')}
        volume={(fr) => 0.5 * interpolate(fr, [0, f(0.25), durationInFrames - f(1.6), durationInFrames - 1], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
      />
    </AbsoluteFill>
  );
};
