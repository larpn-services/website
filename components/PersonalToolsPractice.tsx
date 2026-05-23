"use client";

import Link from "next/link";
import { motion, type PanInfo } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  Archive,
  ArrowLeft,
  ArrowUpRight,
  Bell,
  Bot,
  Calendar,
  Folder,
  FolderSearch,
  GitBranch,
  History,
  Mail,
  MessageSquare,
  MousePointerClick,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  Zap,
  type LucideIcon,
} from "lucide-react";

// Interactive "Tool Studio" — three preset workflow graphs (AI automation,
// daily helper, one-shot utility) that the visitor can switch between and
// drag around. Replaces the Coming-Soon gallery and stands in for the
// Personal Tools practice on /about.

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

type Preset = {
  id: string;
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

const PRESETS: Preset[] = [
  {
    id: "ai-automation",
    label: "AI automation",
    tagline:
      "Trained on your inbox. Routes everything before you wake up.",
    stat: "142 emails triaged today",
    nodes: [
      {
        id: "ai-trigger",
        kind: "trigger",
        title: "New email",
        subtitle: "imap.fastmail.com",
        icon: Mail,
        position: { x: 24, y: 112 },
      },
      {
        id: "ai-classify",
        kind: "ai",
        title: "Classify intent",
        subtitle: "Urgent · Normal · Junk",
        icon: Bot,
        position: { x: 240, y: 112 },
      },
      {
        id: "ai-branch",
        kind: "branch",
        title: "Route",
        subtitle: "Three lanes",
        icon: GitBranch,
        position: { x: 456, y: 112 },
      },
      {
        id: "ai-push",
        kind: "action",
        title: "Push to phone",
        subtitle: "iOS notification",
        icon: Bell,
        position: { x: 672, y: 16 },
      },
      {
        id: "ai-slack",
        kind: "action",
        title: "Slack #signal",
        subtitle: "Tag the team",
        icon: MessageSquare,
        position: { x: 672, y: 128 },
      },
      {
        id: "ai-archive",
        kind: "output",
        title: "Archive",
        subtitle: "Mute the noise",
        icon: Archive,
        position: { x: 672, y: 240 },
      },
    ],
    connections: [
      { from: "ai-trigger", to: "ai-classify" },
      { from: "ai-classify", to: "ai-branch" },
      { from: "ai-branch", to: "ai-push" },
      { from: "ai-branch", to: "ai-slack" },
      { from: "ai-branch", to: "ai-archive" },
    ],
  },
  {
    id: "daily-helper",
    label: "Daily helper",
    tagline:
      "Catches your file chaos every night. Files itself by 9 AM.",
    stat: "3,247 files sorted this month",
    nodes: [
      {
        id: "dh-trigger",
        kind: "trigger",
        title: "Folder watcher",
        subtitle: "~/Downloads",
        icon: FolderSearch,
        position: { x: 24, y: 96 },
      },
      {
        id: "dh-ai",
        kind: "ai",
        title: "Read + tag",
        subtitle: "Vision + text",
        icon: Sparkles,
        position: { x: 240, y: 96 },
      },
      {
        id: "dh-move",
        kind: "action",
        title: "Move + rename",
        subtitle: "Projects · Receipts · Read",
        icon: Folder,
        position: { x: 456, y: 96 },
      },
      {
        id: "dh-digest",
        kind: "output",
        title: "Daily digest",
        subtitle: "9 AM summary",
        icon: Calendar,
        position: { x: 672, y: 96 },
      },
    ],
    connections: [
      { from: "dh-trigger", to: "dh-ai" },
      { from: "dh-ai", to: "dh-move" },
      { from: "dh-move", to: "dh-digest" },
    ],
  },
  {
    id: "one-shot",
    label: "One-shot utility",
    tagline:
      "The button you've always wanted. Right down to the undo.",
    stat: "8 utilities live in your kit",
    nodes: [
      {
        id: "os-trigger",
        kind: "trigger",
        title: "Single button",
        subtitle: "Erase all messages",
        icon: MousePointerClick,
        position: { x: 24, y: 104 },
      },
      {
        id: "os-confirm",
        kind: "ai",
        title: "Soft confirm",
        subtitle: "Are you sure?",
        icon: ShieldCheck,
        position: { x: 240, y: 104 },
      },
      {
        id: "os-delete",
        kind: "action",
        title: "Bulk delete",
        subtitle: "iMessage · Discord · Slack",
        icon: Trash2,
        position: { x: 456, y: 104 },
      },
      {
        id: "os-undo",
        kind: "output",
        title: "Undo window",
        subtitle: "30 seconds to revert",
        icon: History,
        position: { x: 672, y: 104 },
      },
    ],
    connections: [
      { from: "os-trigger", to: "os-confirm" },
      { from: "os-confirm", to: "os-delete" },
      { from: "os-delete", to: "os-undo" },
    ],
  },
];

const ADD_TEMPLATES: Omit<ToolNode, "id" | "position">[] = [
  { kind: "action", title: "Webhook out", subtitle: "POST to endpoint", icon: Zap },
  { kind: "ai", title: "Summarize", subtitle: "GPT-class reasoning", icon: Sparkles },
  { kind: "action", title: "Notify me", subtitle: "iOS push", icon: Bell },
  { kind: "output", title: "Log + archive", subtitle: "For the record", icon: Archive },
];

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

export default function PersonalToolsPractice({
  onBack,
}: {
  onBack: () => void;
}) {
  const [presetIdx, setPresetIdx] = useState(0);
  const [nodes, setNodes] = useState<ToolNode[]>(PRESETS[0].nodes);
  const [connections, setConnections] = useState<Connection[]>(
    PRESETS[0].connections,
  );
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const stepCounter = useRef(0);

  const preset = PRESETS[presetIdx];

  const contentSize = useMemo(() => {
    const maxX = Math.max(
      ...nodes.map((n) => n.position.x + NODE_W),
      900,
    );
    const maxY = Math.max(
      ...nodes.map((n) => n.position.y + NODE_H),
      340,
    );
    return { width: maxX + 40, height: maxY + 40 };
  }, [nodes]);

  const switchPreset = (idx: number) => {
    if (idx === presetIdx) return;
    flushSync(() => {
      setPresetIdx(idx);
      setNodes(PRESETS[idx].nodes);
      setConnections(PRESETS[idx].connections);
    });
    canvasRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  };

  const handleDragStart = (id: string) => {
    setDraggingId(id);
    const node = nodes.find((n) => n.id === id);
    if (node) dragStartPos.current = { ...node.position };
  };

  const handleDrag = (id: string, info: PanInfo) => {
    if (draggingId !== id || !dragStartPos.current) return;
    const newX = Math.max(0, dragStartPos.current.x + info.offset.x);
    const newY = Math.max(0, dragStartPos.current.y + info.offset.y);
    flushSync(() => {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, position: { x: newX, y: newY } } : n,
        ),
      );
    });
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    dragStartPos.current = null;
  };

  const addStep = () => {
    stepCounter.current += 1;
    const template =
      ADD_TEMPLATES[stepCounter.current % ADD_TEMPLATES.length];
    const last = nodes[nodes.length - 1];
    const newPos = last
      ? { x: last.position.x + 216, y: last.position.y }
      : { x: 24, y: 104 };
    const newNode: ToolNode = {
      id: `step-${preset.id}-${stepCounter.current}`,
      ...template,
      position: newPos,
    };
    flushSync(() => {
      setNodes((prev) => [...prev, newNode]);
      if (last) {
        setConnections((prev) => [
          ...prev,
          { from: last.id, to: newNode.id },
        ]);
      }
    });
    const c = canvasRef.current;
    if (c) {
      c.scrollTo({
        left: newPos.x + NODE_W + 80 - c.clientWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
          Tools that do
          <br />
          <span className="text-white/35 italic">exactly that one thing.</span>
        </h1>
        <p className="text-white/45 text-base font-light max-w-2xl leading-relaxed">
          AI automations. Daily helpers. One-shot utilities. The kind of custom
          software you&apos;ve always wanted but couldn&apos;t find. Pick a preset,
          drag the steps, picture yours running here.
        </p>
      </motion.div>

      {/* Preset chips + Add */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.5 }}
        className="mb-5 flex flex-wrap items-center gap-2 sm:gap-3"
      >
        {PRESETS.map((p, i) => {
          const active = i === presetIdx;
          return (
            <button
              key={p.id}
              onClick={() => switchPreset(i)}
              className={`relative px-4 py-2 rounded-full text-[11px] tracking-[0.2em] uppercase font-medium border transition-colors duration-300 ${
                active
                  ? "bg-ember/15 border-ember/45 text-ember"
                  : "bg-white/[0.02] border-white/[0.08] text-white/55 hover:text-white hover:border-white/20"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="preset-glow"
                  aria-hidden
                  className="absolute inset-0 rounded-full"
                  style={{
                    boxShadow: "0 0 24px -8px rgba(255,107,26,0.65)",
                  }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
              <span className="relative">{p.label}</span>
            </button>
          );
        })}
        <span className="hidden sm:block mx-1 h-5 w-px bg-white/[0.08]" />
        <button
          onClick={addStep}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] tracking-[0.2em] uppercase text-white/60 hover:text-white border border-white/[0.08] hover:border-white/20 transition-colors"
          aria-label="Add a step to the workflow"
        >
          <Plus size={13} />
          Add step
        </button>
      </motion.div>

      {/* Tagline for active preset (animates on switch) */}
      <motion.p
        key={preset.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
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
            Drag to rearrange · {nodes.length}{" "}
            {nodes.length === 1 ? "step" : "steps"}
          </p>
        </div>

        {/* Scrollable canvas */}
        <div
          ref={canvasRef}
          className="relative h-[420px] sm:h-[460px] overflow-auto"
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
              {connections.map((c) => (
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
          Email tools. File tools. Bot tools. Calendar tools.
          Tell me what you&apos;d hire me to build.
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
    </motion.div>
  );
}
