// The 40-second Power BI video: "from data chaos to clarity". Times in seconds, so it renders
// identically at 25, 30 or 60 fps.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, EXPO, F, Fonts, INOUT} from '../kit';
import {CUES, VO} from './script';
import {S1Problem} from './S1Problem';
import {S2Transform} from './S2Transform';
import {S3Deliver} from './S3Deliver';
import {S4Support} from './S4Support';
import {S5Brand} from './S5Brand';

export const PBI_DURATION_S = 40;
const TR = 0.5;

type Enter = 'cut' | 'wipe' | 'slide' | 'fade';
const SCENES: {name: string; Comp: React.FC; start: number; end: number; enter: Enter}[] = [
  {name: '1 Problemet', Comp: S1Problem, start: 0, end: 6, enter: 'cut'},
  {name: '2 Transformation', Comp: S2Transform, start: 6, end: 14.8, enter: 'cut'},
  {name: '3 Det leverer Northbound Data', Comp: S3Deliver, start: 14.8, end: 23.4, enter: 'wipe'},
  {name: '4 Drift og troværdighed', Comp: S4Support, start: 23.4, end: 33, enter: 'slide'},
  {name: '5 Brand og CTA', Comp: S5Brand, start: 33, end: 40, enter: 'fade'},
];

const Transition: React.FC<{enter: Enter; exit?: Enter; dur: number; children: React.ReactNode}> = ({enter, exit, dur, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = frame / fps;
  const c = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
  const pin = interpolate(s, [0, TR], [0, 1], {...c, easing: enter === 'wipe' ? INOUT : EXPO});
  const pout = interpolate(s, [dur, dur + TR], [0, 1], {...c, easing: exit === 'wipe' ? INOUT : EXPO});
  let x = 0;
  let clip: string | undefined;
  let opacity = 1;
  if (enter === 'slide') x += (1 - pin) * 1920;
  if (exit === 'slide') x -= pout * 1920;
  if (exit === 'wipe') x -= pout * 240;
  if (enter === 'wipe' && pin < 1) clip = `inset(0 0 0 ${(1 - pin) * 100}%)`;
  if (enter === 'fade') opacity = interpolate(s, [0, TR], [0, 1], c);
  return (
    <AbsoluteFill style={{transform: `translateX(${x}px)`, clipPath: clip, opacity}}>
      {children}
      {enter === 'wipe' && pin < 1 && <div style={{position: 'absolute', top: 0, bottom: 0, left: `${(1 - pin) * 100}%`, width: 10, background: C.accentHi}} />}
    </AbsoluteFill>
  );
};

const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = frame / fps;
  const cue = CUES.find((q) => s >= q.start && s < q.end);
  if (!cue) return null;
  const o = Math.min(1, (s - cue.start) / 0.12, (cue.end - s) / 0.12);
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 46, pointerEvents: 'none'}}>
      <div style={{opacity: o, maxWidth: 1500, textAlign: 'center', fontFamily: F.sans, fontWeight: 500, fontSize: 34, lineHeight: 1.35, color: '#fff', background: 'rgb(4 18 29 / 0.8)', padding: '10px 24px', borderRadius: 10, whiteSpace: 'pre-line'}}>
        {cue.text}
      </div>
    </AbsoluteFill>
  );
};

export type PbiProps = {subtitles: boolean; voiceover: boolean};

export const PowerBIVideo: React.FC<PbiProps> = ({subtitles, voiceover}) => {
  const {fps, durationInFrames} = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  const c = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
  // music ducks under the voice-over when there is one
  const musicVol = voiceover ? 0.38 : 0.7;
  return (
    <AbsoluteFill style={{background: C.deep}}>
      <Fonts />
      {SCENES.map((sc, i) => {
        const next = SCENES[i + 1];
        const exit = next && next.enter !== 'cut' && next.enter !== 'fade' ? next.enter : undefined;
        const len = sc.end - sc.start + (next && next.enter !== 'cut' ? TR : 0);
        return (
          <Sequence key={sc.name} name={sc.name} from={f(sc.start)} durationInFrames={f(len)} premountFor={f(1)}>
            <Transition enter={sc.enter} exit={exit} dur={sc.end - sc.start}>
              <sc.Comp />
            </Transition>
          </Sequence>
        );
      })}
      {subtitles && <Subtitles />}
      <Audio
        src={staticFile('music/pbi-bed.mp3')}
        volume={(fr) => musicVol * interpolate(fr, [0, f(0.1), durationInFrames - f(0.6), durationInFrames - 1], [0, 1, 1, 0], c)}
      />
      {voiceover && VO.map((v) => (
        <Sequence key={v.id} from={f(v.at)} layout="none">
          <Audio src={staticFile(`vo/${v.id}.wav`)} volume={1} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
