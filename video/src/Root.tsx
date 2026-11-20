import React from 'react';
import {Composition} from 'remotion';
import {DURATION_S, Video} from './Video';

// 1920x1080, exactly 30 seconds. 60 fps is the master; a 30 fps version renders from the same timeline.
export const Root: React.FC = () => (
  <>
    <Composition id="NorthboundData" component={Video} width={1920} height={1080} fps={60} durationInFrames={DURATION_S * 60} />
    <Composition id="NorthboundData30" component={Video} width={1920} height={1080} fps={30} durationInFrames={DURATION_S * 30} />
  </>
);
