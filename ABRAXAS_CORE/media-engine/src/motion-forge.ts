/**
 * ABRAXAS Motion Forge V7.0
 * Generates motion_manifest.json with camera pans, zooms, physics easing, and dynamic transitions.
 */

export interface MotionLayer {
  layerId: string;
  type: "CAMERA_ZOOM" | "PAN" | "SPEED_RAMP" | "TEXT_POP" | "GLOW_EMPHASIS" | "TRANSITION";
  startFrame: number;
  endFrame: number;
  parameters: {
    startScale?: number;
    endScale?: number;
    easing?: string;
    intensity?: number;
    curve?: string;
  };
}

export interface MotionManifest {
  manifestId: string;
  fps: number;
  totalFrames: number;
  layers: MotionLayer[];
  dynamicTransitionsCount: number;
  motionScore: number;
  createdAt: string;
}

export class MotionForge {
  public generateMotionManifest(fps = 60, durationSec = 15.0): MotionManifest {
    const totalFrames = Math.floor(fps * durationSec);

    const layers: MotionLayer[] = [
      {
        layerId: "motion_zoom_hook",
        type: "CAMERA_ZOOM",
        startFrame: 0,
        endFrame: fps * 3, // 0 to 3s
        parameters: { startScale: 1.0, endScale: 1.15, easing: "cubic-bezier(0.16, 1, 0.3, 1)", curve: "PHYSICS_SPRING" }
      },
      {
        layerId: "motion_speed_ramp",
        type: "SPEED_RAMP",
        startFrame: fps * 3,
        endFrame: fps * 4,
        parameters: { intensity: 1.4, easing: "ease-in-out" }
      },
      {
        layerId: "motion_text_pop",
        type: "TEXT_POP",
        startFrame: fps * 4,
        endFrame: fps * 8,
        parameters: { startScale: 0.8, endScale: 1.0, easing: "spring(1, 100, 10, 0)" }
      },
      {
        layerId: "motion_transition_cta",
        type: "TRANSITION",
        startFrame: fps * 12,
        endFrame: totalFrames,
        parameters: { startScale: 1.05, endScale: 1.0, easing: "ease-out" }
      }
    ];

    return {
      manifestId: `mot_${Date.now()}`,
      fps,
      totalFrames,
      layers,
      dynamicTransitionsCount: layers.length,
      motionScore: 95,
      createdAt: new Date().toISOString()
    };
  }
}
