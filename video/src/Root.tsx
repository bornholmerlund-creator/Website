import React from 'react';
import {Composition} from 'remotion';
import {DURATION_S, Video} from './Video';
import {PBI_DURATION_S, PowerBIVideo} from './pbi/PowerBI';

// 1920x1080, exactly 30 seconds. 60 fps is the master; a 30 fps version renders from the same timeline.
export const Root: React.FC = () => (
  <>
    <Composition id="NorthboundData" component={Video} width={1920} height={1080} fps={60} durationInFrames={DURATION_S * 60} />
    <Composition id="NorthboundData30" component={Video} width={1920} height={1080} fps={30} durationInFrames={DURATION_S * 30} />
    {/* Power BI video (40 s, 30 fps master). Variants: burned-in subtitles or clean; voice-over when public/vo/*.wav exist. */}
    <Composition id="PowerBI" component={PowerBIVideo} width={1920} height={1080} fps={30} durationInFrames={PBI_DURATION_S * 30} defaultProps={{subtitles: true, voiceover: false}} />
    <Composition id="PowerBIClean" component={PowerBIVideo} width={1920} height={1080} fps={30} durationInFrames={PBI_DURATION_S * 30} defaultProps={{subtitles: false, voiceover: false}} />
  </>
);
