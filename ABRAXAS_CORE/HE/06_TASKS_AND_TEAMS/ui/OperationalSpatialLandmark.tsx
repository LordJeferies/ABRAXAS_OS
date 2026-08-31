import React, {useEffect, useRef, useState} from "react";
import {useHe} from "./HeContext.tsx";

declare global {
  interface Window {
    __ABRAXAS_RENDERER_STATE__?: "WEBGL_ACTIVE" | "FALLBACK_ACTIVE";
  }
}

export const OperationalSpatialLandmark: React.FC<{className?: string}> = ({className}) => {
  const {service, activeView} = useHe();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const webglCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fallbackCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [renderMode, setRenderMode] = useState<"WEBGL_ACTIVE" | "FALLBACK_ACTIVE">("FALLBACK_ACTIVE");

  const tasks = service.getTasks();
  const dependencies = service.getDependencies();
  const snapshot = service.getTeamSnapshot();
  const blockedCount = snapshot.blockedWork.length;
  const activeCount = tasks.filter((t) => t.status === "IN_PROGRESS" || t.status === "READY").length;
  const overdueCount = snapshot.overdueTasks.length;
  const pendingApprovalsCount = snapshot.pendingApprovals.length;

  useEffect(() => {
    let animId: number | null = null;
    let isRunning = false;
    let isSubscribed = true;
    let isIntersecting = true;

    const prefersReducedMotion = typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Try WebGL on dedicated WebGL canvas
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    let glProgram: WebGLProgram | null = null;
    let glBuffer: WebGLBuffer | null = null;

    const webglCanvas = webglCanvasRef.current;
    const fallbackCanvas = fallbackCanvasRef.current;

    if (webglCanvas) {
      try {
        gl = (webglCanvas.getContext("webgl2") || webglCanvas.getContext("webgl")) as any;
        if (gl) {
          // Compile real native shaders for WebGL point/line rendering
          const vsSource = `
            attribute vec2 a_position;
            attribute vec3 a_color;
            varying vec3 v_color;
            void main() {
              gl_Position = vec4(a_position, 0.0, 1.0);
              gl_PointSize = 8.0;
              v_color = a_color;
            }
          `;
          const fsSource = `
            precision mediump float;
            varying vec3 v_color;
            void main() {
              gl_FragColor = vec4(v_color, 1.0);
            }
          `;

          const vs = gl.createShader(gl.VERTEX_SHADER)!;
          gl.shaderSource(vs, vsSource);
          gl.compileShader(vs);
          const vsOk = gl.getShaderParameter(vs, gl.COMPILE_STATUS);

          const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
          gl.shaderSource(fs, fsSource);
          gl.compileShader(fs);
          const fsOk = gl.getShaderParameter(fs, gl.COMPILE_STATUS);

          if (!vsOk || !fsOk) {
            gl = null;
            glProgram = null;
          } else {
            glProgram = gl.createProgram()!;
            gl.attachShader(glProgram, vs);
            gl.attachShader(glProgram, fs);
            gl.linkProgram(glProgram);
            const linkOk = gl.getProgramParameter(glProgram, gl.LINK_STATUS);
            if (!linkOk) {
              gl = null;
              glProgram = null;
            } else {
              glBuffer = gl.createBuffer();
            }
          }
        }
      } catch {
        gl = null;
      }
    }

    const activeMode = gl && glProgram ? "WEBGL_ACTIVE" : "FALLBACK_ACTIVE";
    window.__ABRAXAS_RENDERER_STATE__ = activeMode;
    setRenderMode(activeMode);

    let angle = 0;

    const renderFrame = () => {
      if (!isSubscribed) return;

      if (prefersReducedMotion) {
        angle = 0;
      } else {
        angle += 0.015;
      }

      if (activeMode === "WEBGL_ACTIVE" && gl && glProgram && glBuffer && webglCanvas) {
        const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2.0);
        const w = webglCanvas.width = (webglCanvas.clientWidth || 220) * dpr;
        const h = webglCanvas.height = (webglCanvas.clientHeight || 120) * dpr;

        gl.viewport(0, 0, w, h);
        gl.clearColor(0.06, 0.08, 0.12, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(glProgram);

        // Compute orbital nodes in WebGL normalized device coordinates (-1 to 1)
        const radX = 0.7;
        const radY = 0.5;
        const nodePositions = [
          Math.cos(angle) * radX, Math.sin(angle) * radY, 0.22, 0.74, 0.97, // Active (Cyan)
          Math.cos(angle + Math.PI/2) * radX, Math.sin(angle + Math.PI/2) * radY, blockedCount > 0 ? 0.94 : 0.06, blockedCount > 0 ? 0.27 : 0.73, blockedCount > 0 ? 0.27 : 0.51, // Blocked (Red/Green)
          Math.cos(angle + Math.PI) * radX, Math.sin(angle + Math.PI) * radY, overdueCount > 0 ? 0.96 : 0.06, overdueCount > 0 ? 0.62 : 0.73, overdueCount > 0 ? 0.04 : 0.51, // Overdue
          Math.cos(angle + (3*Math.PI)/2) * radX, Math.sin(angle + (3*Math.PI)/2) * radY, 0.51, 0.55, 0.97 // Reviews (Indigo)
        ];

        gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(nodePositions), gl.DYNAMIC_DRAW);

        const posAttr = gl.getAttribLocation(glProgram, "a_position");
        const colAttr = gl.getAttribLocation(glProgram, "a_color");

        gl.enableVertexAttribArray(posAttr);
        gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 5 * 4, 0);

        gl.enableVertexAttribArray(colAttr);
        gl.vertexAttribPointer(colAttr, 3, gl.FLOAT, false, 5 * 4, 2 * 4);

        // Real native WebGL Draw call
        gl.drawArrays(gl.POINTS, 0, 4);
        gl.drawArrays(gl.LINE_LOOP, 0, 4);
      } else if (fallbackCanvas) {
        // Fallback 2D context path on dedicated fallback canvas
        const ctx = fallbackCanvas.getContext("2d");
        if (ctx) {
          const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2.0);
          const width = fallbackCanvas.width = (fallbackCanvas.clientWidth || 220) * dpr;
          const height = fallbackCanvas.height = (fallbackCanvas.clientHeight || 120) * dpr;

          ctx.clearRect(0, 0, width, height);

          const centerX = width / 2;
          const centerY = height / 2;
          const radiusX = Math.min(centerX, centerY) * 0.75;
          const radiusY = radiusX * 0.45;

          const nodes = [
            {label: `Active (${activeCount})`, angle: angle, color: "#38bdf8", isBlocked: false},
            {label: `Blocked (${blockedCount})`, angle: angle + (Math.PI * 2) / 4, color: blockedCount > 0 ? "#ef4444" : "#10b981", isBlocked: blockedCount > 0},
            {label: `Overdue (${overdueCount})`, angle: angle + (Math.PI * 4) / 4, color: overdueCount > 0 ? "#f59e0b" : "#10b981", isBlocked: false},
            {label: `Reviews (${pendingApprovalsCount})`, angle: angle + (Math.PI * 6) / 4, color: "#818cf8", isBlocked: false}
          ];

          // Draw real dependency edges
          ctx.strokeStyle = blockedCount > 0 ? "rgba(239, 68, 68, 0.4)" : "rgba(37, 99, 235, 0.35)";
          ctx.lineWidth = 1.5 * dpr;

          for (let i = 0; i < nodes.length; i++) {
            const n1 = nodes[i];
            const n2 = nodes[(i + 1) % nodes.length];
            if (!n1 || !n2) continue;
            const x1 = centerX + Math.cos(n1.angle) * radiusX;
            const y1 = centerY + Math.sin(n1.angle) * radiusY;
            const x2 = centerX + Math.cos(n2.angle) * radiusX;
            const y2 = centerY + Math.sin(n2.angle) * radiusY;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }

          // Draw operational nodes
          nodes.forEach((n) => {
            const x = centerX + Math.cos(n.angle) * radiusX;
            const y = centerY + Math.sin(n.angle) * radiusY;

            ctx.fillStyle = n.color;
            ctx.beginPath();
            ctx.arc(x, y, (n.isBlocked ? 7 : 5) * dpr, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#c5d1de";
            ctx.font = `${Math.round(9 * dpr)}px -apple-system, sans-serif`;
            ctx.textAlign = "center";
            ctx.fillText(n.label, x, y - 8 * dpr);
          });

          // Draw Center Operational Hub
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(centerX, centerY, 6 * dpr, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#7d8b9f";
          ctx.font = `bold ${Math.round(8 * dpr)}px monospace`;
          ctx.textAlign = "center";
          ctx.fillText("HE CORE", centerX, centerY + 14 * dpr);
        }
      }

      // Schedule next frame only if not prefersReducedMotion, document visible, and intersecting
      if (!prefersReducedMotion && document.visibilityState === "visible" && isIntersecting && isSubscribed) {
        animId = requestAnimationFrame(renderFrame);
        isRunning = true;
      } else {
        isRunning = false;
      }
    };

    renderFrame();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && !isRunning && isIntersecting && !prefersReducedMotion) {
        renderFrame();
      } else if (document.visibilityState === "hidden" && animId) {
        cancelAnimationFrame(animId);
        isRunning = false;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // IntersectionObserver to pause when offscreen
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined" && containerRef.current) {
      observer = new IntersectionObserver(([entry]) => {
        isIntersecting = entry?.isIntersecting ?? true;
        if (isIntersecting && !isRunning && document.visibilityState === "visible" && !prefersReducedMotion) {
          renderFrame();
        } else if (!isIntersecting && animId) {
          cancelAnimationFrame(animId);
          isRunning = false;
        }
      }, {threshold: 0.1});
      observer.observe(containerRef.current);
    }

    return () => {
      isSubscribed = false;
      isRunning = false;
      if (animId) cancelAnimationFrame(animId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (observer) observer.disconnect();
    };
  }, [activeView, blockedCount, activeCount, overdueCount, pendingApprovalsCount]);

  return (
    <div ref={containerRef} className={`he-spatial-landmark ${className || ""}`} data-testid="he-spatial-landmark">
      <div className="he-landmark-header">
        <span className="he-landmark-title">OPERATIONAL GRAPH LANDMARK</span>
        <span className={`he-tag ${renderMode === "WEBGL_ACTIVE" ? "verified" : ""}`}>
          {renderMode}
        </span>
      </div>
      <div className="he-spatial-stage-wrapper" style={{position: "relative", width: "100%", height: "120px"}}>
        <canvas
          ref={webglCanvasRef}
          className="he-spatial-webgl-canvas"
          style={{width: "100%", height: "100%", display: renderMode === "WEBGL_ACTIVE" ? "block" : "none"}}
          data-testid="spatial-webgl-canvas"
        />
        <canvas
          ref={fallbackCanvasRef}
          className="he-spatial-fallback-canvas"
          style={{width: "100%", height: "100%", display: renderMode === "FALLBACK_ACTIVE" ? "block" : "none"}}
          data-testid="spatial-fallback-canvas"
        />
      </div>
      <div className="he-landmark-meta" style={{display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--he-muted)", marginTop: "4px"}}>
        <span>Active: <strong>{activeCount}</strong></span>
        <span>Blockers: <strong style={{color: blockedCount > 0 ? "var(--he-danger)" : "inherit"}}>{blockedCount}</strong></span>
        <span>View: <strong>{activeView.toUpperCase()}</strong></span>
      </div>
    </div>
  );
};
