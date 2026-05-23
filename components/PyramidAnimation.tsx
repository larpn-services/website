"use client";

import { useEffect, useRef, useState } from "react";

// ASCII-rendered rotating pyramid. Adapted from a setInterval-driven
// component — the original recreated its interval every 30ms (theta was in
// the effect deps) and emitted ~3,200 React spans per frame, which choked
// reconciliation. This version uses requestAnimationFrame and writes one
// HTML string via dangerouslySetInnerHTML.
//
// All inputs to the HTML string come from controlled local constants, so
// dangerouslySetInnerHTML is safe here.

const W = 80;
const H = 40;

const faceSymbol = ["@", "#", "$", "*"] as const;

// Brand palette — ember + whites so the pyramid sits in the LARPN scene
// instead of fighting it with primary RGB.
const faceColor = ["#ff6b1a", "#ffffff", "#ff8a3d", "#d1d5db"] as const;

const SCALE = 2;
const DESIRED_DIST = 4.5;

const V: [number, number, number][] = [
  [0.0, SCALE, 0.0],
  [-SCALE, -SCALE, -SCALE],
  [SCALE, -SCALE, -SCALE],
  [SCALE, -SCALE, SCALE],
  [-SCALE, -SCALE, SCALE],
];

const F: [number, number, number][] = [
  [0, 1, 2],
  [0, 2, 3],
  [0, 3, 4],
  [0, 4, 1],
];

const DU = 0.012;
const DV = 0.012;

const EDGE_LIST: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4],
  [1, 2], [2, 3], [3, 4], [4, 1],
];

const sub3 = (a: number[], b: number[]) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross3 = (a: number[], b: number[]) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const norm3 = (v: number[]) => {
  const r = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  return [v[0] / r, v[1] / r, v[2] / r];
};

// Pre-computed face normals — vertices never change, so this can live at
// module scope instead of being recomputed every frame.
const FACE_NORMALS = F.map((face) => {
  const e1 = sub3(V[face[1]], V[face[0]]);
  const e2 = sub3(V[face[2]], V[face[0]]);
  return norm3(cross3(e1, e2));
});

const LIGHT = norm3([0.0, 1.0, -1.0]);

type Axis = "x" | "y" | "z";

export interface PyramidAnimationProps {
  wireframe?: boolean;
  color?: boolean;
  speed?: number;
  axis?: Axis;
  edges?: boolean;
  className?: string;
}

export default function PyramidAnimation({
  wireframe = false,
  color = true,
  speed = 0.03,
  axis = "y",
  edges = true,
  className,
}: PyramidAnimationProps) {
  const [html, setHtml] = useState("");
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let theta = 0;
    let lastTime = performance.now();
    const FRAME_MS = 33; // ~30fps cap — heavy enough work that 60fps wastes cpu

    // Respect users who've opted out of motion: render a single static frame
    // and exit early without scheduling any animation work.
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderFrame = (currentTheta: number) => {
      const faceBuf: number[] = new Array(W * H).fill(-1);
      const lumBuf: number[] = new Array(W * H).fill(0);
      const zBuf: number[] = new Array(W * H).fill(0);

      const c = Math.cos(currentTheta);
      const s = Math.sin(currentTheta);

      // Centroid is the average of the 5 vertices.
      const centroidModel = [0, 0, 0];
      for (let i = 0; i < 5; i++) {
        centroidModel[0] += V[i][0];
        centroidModel[1] += V[i][1];
        centroidModel[2] += V[i][2];
      }
      centroidModel[0] *= 0.2;
      centroidModel[1] *= 0.2;
      centroidModel[2] *= 0.2;

      const cz = -centroidModel[0] * s + centroidModel[2] * c;
      const offset = DESIRED_DIST - cz;

      const X_SCALE = 36.0;
      const Y_SCALE = 18.0;
      const Y_OFFSET = -4;

      // Faces
      if (!wireframe) {
        for (let f = 0; f < 4; f++) {
          for (let u = 0; u <= 1.0; u += DU) {
            for (let v = 0; u + v <= 1.0; v += DV) {
              const w = 1.0 - u - v;
              const x = w * V[F[f][0]][0] + u * V[F[f][1]][0] + v * V[F[f][2]][0];
              const y = w * V[F[f][0]][1] + u * V[F[f][1]][1] + v * V[F[f][2]][1];
              const z = w * V[F[f][0]][2] + u * V[F[f][1]][2] + v * V[F[f][2]][2];

              let x2 = x, y2 = y, z2 = z;
              if (axis === "y") { x2 = x * c + z * s; z2 = -x * s + z * c; }
              else if (axis === "x") { y2 = y * c - z * s; z2 = y * s + z * c; }
              else { x2 = x * c - y * s; y2 = x * s + y * c; }

              const z2Translated = z2 + offset;
              if (z2Translated <= 0) continue;
              const invz = 1.0 / z2Translated;

              const px = Math.floor(W / 2 + X_SCALE * x2 * invz);
              const py = Math.floor(H / 2 - Y_SCALE * y2 * invz + Y_OFFSET);
              if (px < 0 || px >= W || py < 0 || py >= H) continue;
              const idx = px + py * W;
              if (invz <= zBuf[idx]) continue;
              zBuf[idx] = invz;

              const fn = FACE_NORMALS[f];
              let nx = fn[0], ny = fn[1], nz = fn[2];
              if (axis === "y") { nx = fn[0] * c + fn[2] * s; nz = -fn[0] * s + fn[2] * c; }
              else if (axis === "x") { ny = fn[1] * c - fn[2] * s; nz = fn[1] * s + fn[2] * c; }
              else { nx = fn[0] * c - fn[1] * s; ny = fn[0] * s + fn[1] * c; }

              let L = nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2];
              if (L < 0) L = 0;
              lumBuf[idx] = L;
              faceBuf[idx] = f;
            }
          }
        }
      }

      // Edges (drawn last so they outline the silhouette cleanly)
      if (edges) {
        for (const [a, b] of EDGE_LIST) {
          const [x0, y0, z0] = V[a];
          const [x1, y1, z1] = V[b];
          for (let t = 0; t <= 1.0; t += 0.0025) {
            const x = x0 + (x1 - x0) * t;
            const y = y0 + (y1 - y0) * t;
            const z = z0 + (z1 - z0) * t;
            let x2 = x, y2 = y, z2 = z;
            if (axis === "y") { x2 = x * c + z * s; z2 = -x * s + z * c; }
            else if (axis === "x") { y2 = y * c - z * s; z2 = y * s + z * c; }
            else { x2 = x * c - y * s; y2 = x * s + y * c; }
            const z2Translated = z2 + offset;
            if (z2Translated <= 0) continue;
            const invz = 1.0 / z2Translated;
            const px = Math.floor(W / 2 + X_SCALE * x2 * invz);
            const py = Math.floor(H / 2 - Y_SCALE * y2 * invz - 4);
            if (px < 0 || px >= W || py < 0 || py >= H) continue;
            const idx = px + py * W;
            if (invz > zBuf[idx]) {
              zBuf[idx] = invz + 1e-6;
              faceBuf[idx] = -2;
            }
          }
        }
      }

      // Build HTML string. innerHTML replacement is dramatically faster than
      // reconciling thousands of React spans every frame.
      let out = "";
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const i = x + y * W;
          const f = faceBuf[i];
          if (f === -2) {
            out += '<span style="color:#fff;font-weight:600">+</span>';
          } else if (f < 0) {
            out += " ";
          } else {
            const L = lumBuf[i];
            const hex = color ? faceColor[f] : "#ffffff";
            const weight = L > 0.6 ? ";font-weight:600" : "";
            out += `<span style="color:${hex}${weight}">${faceSymbol[f]}</span>`;
          }
        }
        out += "\n";
      }
      setHtml(out);
    };

    renderFrame(theta);

    if (prefersReducedMotion) return;

    const tick = (now: number) => {
      if (now - lastTime >= FRAME_MS) {
        theta += speed;
        lastTime = now;
        renderFrame(theta);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [wireframe, color, speed, axis, edges]);

  return (
    <pre
      aria-hidden
      className={`font-mono text-[8px] sm:text-[10px] md:text-xs whitespace-pre leading-none text-center select-none ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
