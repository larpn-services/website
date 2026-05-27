"use client";

import * as React from "react";
import Link from "next/link";
import { motion, type PanInfo } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Camera,
  Heart,
  LogIn,
  MessageCircle,
  MessageSquareOff,
  Music2,
  Scan,
  Trash2,
  UserMinus,
  Video,
  type LucideIcon,
} from "lucide-react";
import { EditTool } from "./EditTool";

// Interactive "Tool Studio" — the studio's flagship social-media hygiene
// automation, rendered as a live tool graph.

type NodeKind = "trigger" | "ai" | "branch" | "action" | "output";

type ToolNode = {
  id: string;
  kind: NodeKind;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  position: { x: number; y: number };
};

type Connection = { from: string; to: string };

type GraphPreset = {
  id: "social-automation";
  label: string;
  tagline: string;
  stat: string;
  nodes: ToolNode[];
  connections: Connection[];
};

const NODE_W = 192;
const NODE_H = 92;

const KIND_STYLE: Record<
  NodeKind,
  { border: string; chip: string; iconBox: string }
> = {
  trigger: {
    border: "border-ember/50",
    chip: "text-ember",
    iconBox: "bg-ember/15 border-ember/45 text-ember",
  },
  ai: {
    border: "border-ember/30",
    chip: "text-ember-soft",
    iconBox: "bg-ember/8 border-ember/30 text-ember-soft",
  },
  branch: {
    border: "border-white/25 [border-style:dashed]",
    chip: "text-white/60",
    iconBox: "bg-white/[0.05] border-white/25 text-white/85",
  },
  action: {
    border: "border-white/15",
    chip: "text-white/55",
    iconBox: "bg-white/[0.035] border-white/15 text-white/75",
  },
  output: {
    border: "border-white/10",
    chip: "text-white/40",
    iconBox: "bg-white/[0.02] border-white/10 text-white/55",
  },
};

const KIND_LABEL: Record<NodeKind, string> = {
  trigger: "Trigger",
  ai: "AI step",
  branch: "Branch",
  action: "Action",
  output: "Output",
};

const SOCIAL_PRESET: GraphPreset = {
  id: "social-automation",
  label: "Social hygiene",
  tagline:
    "Log in across Instagram, Discord and TikTok. One button cleans the trail.",
  stat: "Multi-account · IG · Discord · TikTok",
  nodes: [
    {
      id: "sa-login",
      kind: "trigger",
      title: "Sign in",
      subtitle: "Multiple accounts",
      icon: LogIn,
      position: { x: 24, y: 16 },
    },
    {
      id: "sa-ig",
      kind: "ai",
      title: "Instagram",
      subtitle: "Full-account scan",
      icon: Camera,
      position: { x: 240, y: 16 },
    },
    {
      id: "sa-discord",
      kind: "ai",
      title: "Discord",
      subtitle: "Wipes any DM or server",
      icon: MessageCircle,
      position: { x: 240, y: 128 },
    },
    {
      id: "sa-tiktok",
      kind: "ai",
      title: "TikTok",
      subtitle: "Likes, reposts, follows",
      icon: Music2,
      position: { x: 240, y: 240 },
    },
    {
      id: "sa-scan",
      kind: "branch",
      title: "Account scan",
      subtitle: "Map everything",
      icon: Scan,
      position: { x: 456, y: 128 },
    },
    {
      id: "sa-wipe-dm",
      kind: "action",
      title: "Wipe a conversation",
      subtitle: "Delete every message",
      icon: MessageSquareOff,
      position: { x: 700, y: 0 },
    },
    {
      id: "sa-unrepost",
      kind: "action",
      title: "Un-repost reels",
      subtitle: "Strip them all at once",
      icon: Video,
      position: { x: 700, y: 96 },
    },
    {
      id: "sa-unlike",
      kind: "action",
      title: "Un-like videos",
      subtitle: "Mass-clear the heart",
      icon: Heart,
      position: { x: 700, y: 192 },
    },
    {
      id: "sa-uncomment",
      kind: "action",
      title: "Remove comments",
      subtitle: "Bulk delete your replies",
      icon: Trash2,
      position: { x: 700, y: 288 },
    },
    {
      id: "sa-ghosts",
      kind: "output",
      title: "Ghost tracker",
      subtitle: "One button, full list",
      icon: UserMinus,
      position: { x: 700, y: 384 },
    },
  ],
  connections: [
    { from: "sa-login", to: "sa-ig" },
    { from: "sa-login", to: "sa-discord" },
    { from: "sa-login", to: "sa-tiktok" },
    { from: "sa-ig", to: "sa-scan" },
    { from: "sa-discord", to: "sa-scan" },
    { from: "sa-tiktok", to: "sa-scan" },
    { from: "sa-scan", to: "sa-wipe-dm" },
    { from: "sa-scan", to: "sa-unrepost" },
    { from: "sa-scan", to: "sa-unlike" },
    { from: "sa-scan", to: "sa-uncomment" },
    { from: "sa-scan", to: "sa-ghosts" },
  ],
};

const SCRAPER_CODE = `// scraper/social-media.ts
import puppeteer from "puppeteer";

export async function scrapePosts(
  platform: string,
  username: string,
) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(\`https://\${platform}.com/\${username}\`);
  await page.waitForSelector("[data-post]");

  const posts = await page.evaluate(() =>
    [...document.querySelectorAll("[data-post]")].map((el) => ({
      content: el.querySelector(".caption")?.textContent ?? "",
      likes: parseInt(
        el.querySelector(".likes")?.textContent ?? "0",
      ),
      timestamp: el.querySelector("time")?.dateTime ?? "",
    })),
  );

  await browser.close();
  return posts;
}`;


// ─── Graph canvas (social automation) ──────────────────────────────────────

function ConnectionPath({
  from,
  to,
  nodes,
}: {
  from: string;
  to: string;
  nodes: ToolNode[];
}) {
  const fromNode = nodes.find((n) => n.id === from);
  const toNode = nodes.find((n) => n.id === to);
  if (!fromNode || !toNode) return null;

  const sx = fromNode.position.x + NODE_W;
  const sy = fromNode.position.y + NODE_H / 2;
  const ex = toNode.position.x;
  const ey = toNode.position.y + NODE_H / 2;

  const c1x = sx + (ex - sx) * 0.55;
  const c2x = ex - (ex - sx) * 0.55;

  return (
    <path
      d={`M${sx},${sy} C${c1x},${sy} ${c2x},${ey} ${ex},${ey}`}
      fill="none"
      stroke="rgba(255,107,26,0.4)"
      strokeWidth={1.5}
      strokeDasharray="6,5"
      strokeLinecap="round"
    />
  );
}

function GraphCanvas({ preset }: { preset: GraphPreset }) {
  const [nodes, setNodes] = useState<ToolNode[]>(preset.nodes);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);

  // Reset nodes whenever the active preset changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync external preset prop into local positions; needed so drags don't bleed across presets
    setNodes(preset.nodes);
    canvasRef.current?.scrollTo({ left: 0, top: 0, behavior: "smooth" });
  }, [preset.id, preset.nodes]);

  const contentSize = useMemo(() => {
    const maxX = Math.max(...nodes.map((n) => n.position.x + NODE_W), 900);
    const maxY = Math.max(...nodes.map((n) => n.position.y + NODE_H), 460);
    return { width: maxX + 40, height: maxY + 40 };
  }, [nodes]);

  const handleDragStart = (id: string) => {
    setDraggingId(id);
    const node = nodes.find((n) => n.id === id);
    if (node) dragStartPos.current = { ...node.position };
  };

  const handleDrag = (id: string, info: PanInfo) => {
    if (draggingId !== id || !dragStartPos.current) return;
    const newX = Math.max(0, dragStartPos.current.x + info.offset.x);
    const newY = Math.max(0, dragStartPos.current.y + info.offset.y);
    setNodes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, position: { x: newX, y: newY } } : n,
      ),
    );
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    dragStartPos.current = null;
  };

  return (
    <div
      ref={canvasRef}
      className="relative h-[420px] sm:h-[520px] overflow-auto"
      role="region"
      aria-label="Tool workflow canvas"
      tabIndex={0}
    >
      <div
        className="relative"
        style={{
          minWidth: contentSize.width,
          minHeight: contentSize.height,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          backgroundPosition: "10px 10px",
        }}
      >
        <svg
          className="absolute top-0 left-0 pointer-events-none"
          width={contentSize.width}
          height={contentSize.height}
          style={{ overflow: "visible" }}
          aria-hidden="true"
        >
          {preset.connections.map((c) => (
            <ConnectionPath
              key={`${c.from}-${c.to}`}
              from={c.from}
              to={c.to}
              nodes={nodes}
            />
          ))}
        </svg>

        {nodes.map((node) => {
          const Icon = node.icon;
          const style = KIND_STYLE[node.kind];
          const isDragging = draggingId === node.id;
          return (
            <motion.div
              key={node.id}
              drag
              dragMomentum={false}
              onDragStart={() => handleDragStart(node.id)}
              onDrag={(_, info) => handleDrag(node.id, info)}
              onDragEnd={handleDragEnd}
              style={{
                x: node.position.x,
                y: node.position.y,
                width: NODE_W,
                transformOrigin: "0 0",
              }}
              className="absolute cursor-grab active:cursor-grabbing"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
              whileHover={{ scale: 1.02 }}
              whileDrag={{ scale: 1.04, zIndex: 50 }}
              aria-grabbed={isDragging}
              aria-label={`${KIND_LABEL[node.kind]}: ${node.title}`}
            >
              <div
                className={`relative rounded-xl border ${style.border} bg-ink-elev/85 backdrop-blur-sm p-3 transition-shadow ${
                  isDragging ? "shadow-xl shadow-ember/10" : ""
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${style.iconBox}`}
                    aria-hidden
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-[9px] tracking-[0.25em] uppercase mb-0.5 font-medium ${style.chip}`}
                    >
                      {KIND_LABEL[node.kind]}
                    </p>
                    <h3 className="text-white text-[13px] font-medium leading-tight truncate">
                      {node.title}
                    </h3>
                  </div>
                </div>
                <p className="mt-2 text-[10px] leading-relaxed text-white/40">
                  {node.subtitle}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────

export default function PersonalToolsPractice({
  onBack,
}: {
  onBack: () => void;
}) {
  const preset = SOCIAL_PRESET;

  const [typed, setTyped] = React.useState("");
  const [toolState, setToolState] = React.useState<
    "waiting" | "pending" | "completed"
  >("waiting");

  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    const startDelay = setTimeout(() => {
      setToolState("pending");
      let i = 0;
      interval = setInterval(() => {
        i++;
        setTyped(SCRAPER_CODE.slice(0, i));
        if (i >= SCRAPER_CODE.length) {
          clearInterval(interval!);
          setToolState("completed");
        }
      }, 18);
    }, 600);
    return () => {
      clearTimeout(startDelay);
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Back button */}
      <motion.button
        onClick={onBack}
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05, duration: 0.4 }}
        className="flex items-center gap-2.5 text-white/30 hover:text-white transition-colors text-[11px] tracking-[0.25em] uppercase mb-14 group"
      >
        <ArrowLeft
          size={13}
          className="group-hover:-translate-x-1 transition-transform duration-300"
        />
        The Studio
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10"
      >
        <p className="text-ember text-[10px] tracking-[0.35em] uppercase mb-5 font-medium">
          04 — Practice
        </p>
        <h1 className="text-white text-4xl sm:text-6xl font-light tracking-tight mb-6 leading-[1.05]">
          One button.
          <br />
          <span className="text-white/35 italic">Clean account.</span>
        </h1>
        <p className="text-white/45 text-base font-light max-w-2xl leading-relaxed">
          Across Instagram, Discord, and TikTok — wipe every DM, un-like a
          year of videos, un-repost reels you regret, and see exactly who
          stopped following back. Without scrolling for hours.
        </p>
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="text-white/45 text-sm font-light mb-4 max-w-2xl leading-relaxed"
      >
        {preset.tagline}
      </motion.p>

      {/* Canvas */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.018] to-transparent backdrop-blur-sm overflow-hidden"
      >
        {/* Status header */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-ember/80" />
              <motion.span
                aria-hidden
                animate={{
                  scale: [1, 2.4, 2.4],
                  opacity: [0.6, 0, 0],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="absolute inset-0 rounded-full bg-ember"
              />
            </span>
            <span className="text-ember text-[10px] tracking-[0.3em] uppercase">
              Live
            </span>
          </div>
          <p className="text-white/30 text-[10px] tracking-[0.25em] uppercase">
            Drag to rearrange
          </p>
        </div>

        <GraphCanvas preset={preset} />

        {/* Footer status */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-t border-white/[0.06]">
          <p className="text-white/40 text-[11px] font-light">
            <span className="text-ember mr-1">▸</span>
            {preset.stat}
          </p>
          <p className="text-white/25 text-[10px] tracking-[0.25em] uppercase">
            Custom built · Ships in days
          </p>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-12 flex flex-col items-center gap-5"
      >
        <p className="text-white/40 text-sm font-light text-center max-w-md leading-relaxed">
          Whatever &quot;just one button&quot; thing you&apos;ve wanted —
          tell me. I build the rest.
        </p>
        <Link
          href="/contact"
          className="group inline-flex items-center gap-2 px-7 py-3.5 bg-white text-black rounded-full text-sm font-medium hover:bg-ember hover:text-white transition-all"
        >
          Pitch me your tool
          <ArrowUpRight
            size={15}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </Link>
      </motion.div>

      {/* ── Web Scraper Tool ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mt-24"
      >
        {/* Section header */}
        <p className="text-ember text-[10px] tracking-[0.35em] uppercase mb-5 font-medium">
          02 — Tool
        </p>
        <h2 className="text-white text-4xl sm:text-5xl font-light tracking-tight mb-4 leading-[1.05]">
          Scrape any feed.
          <br />
          <span className="text-white/35 italic">Any platform, any data.</span>
        </h2>
        <p className="text-white/45 text-base font-light max-w-2xl leading-relaxed mb-10">
          Point it at an Instagram profile, TikTok page, or Twitter feed — it returns
          a clean structured dataset ready to pipe into a dashboard, spreadsheet, or
          downstream automation.
        </p>

        {/* EditTool */}
        <EditTool
          state={toolState}
          variant="write"
          filePath="scraper/social-media.ts"
          newContent={typed}
        />
      </motion.div>
    </motion.div>
  );
}
