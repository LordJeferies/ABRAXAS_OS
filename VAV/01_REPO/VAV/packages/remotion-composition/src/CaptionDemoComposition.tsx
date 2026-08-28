import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig
} from "remotion";

export const CaptionDemoComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entrance = spring({frame, fps, config: {damping: 14, stiffness: 120}});
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 35%, rgba(94,72,255,.28), #09090d 58%)",
        color: "white",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, system-ui, sans-serif"
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${(1 - entrance) * 80}px) scale(${0.92 + entrance * 0.08})`,
          textAlign: "center",
          width: "82%"
        }}
      >
        <div style={{fontSize: 54, fontWeight: 500, opacity: 0.72}}>
          VAV CAPTIONS
        </div>
        <div
          style={{
            fontSize: 122,
            lineHeight: 0.95,
            fontWeight: 900,
            marginTop: 22,
            letterSpacing: -4
          }}
        >
          READY TO
          <br />
          <span style={{color: "#ffd84d"}}>BUILD</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
