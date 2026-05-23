import { LogoTimeline, type LogoItem } from "./LogoTimeline";

function Badge({
  initial,
  bg,
  fg = "#fff",
}: {
  initial: string;
  bg: string;
  fg?: string;
}) {
  return (
    <span
      className="inline-flex items-center justify-center w-5 h-5 rounded-[5px] text-[8.5px] font-bold tracking-tight flex-shrink-0"
      style={{ backgroundColor: bg, color: fg }}
    >
      {initial}
    </span>
  );
}

type Tech = {
  label: string;
  initial: string;
  bg: string;
  fg?: string;
  row: number;
};

const TECHS: Tech[] = [
  // Row 1 — Languages
  { label: "TypeScript", initial: "TS", bg: "#3178C6", row: 1 },
  { label: "JavaScript", initial: "JS", bg: "#F7DF1E", fg: "#000", row: 1 },
  { label: "Python", initial: "Py", bg: "#3776AB", row: 1 },
  { label: "Go", initial: "Go", bg: "#00ADD8", row: 1 },
  { label: "Rust", initial: "Rs", bg: "#CE412B", row: 1 },
  { label: "Swift", initial: "Sw", bg: "#FA7343", row: 1 },
  { label: "Kotlin", initial: "Kt", bg: "#7F52FF", row: 1 },
  { label: "Java", initial: "Jv", bg: "#ED8B00", row: 1 },

  // Row 2 — Frontend
  { label: "React", initial: "Re", bg: "#61DAFB", fg: "#000", row: 2 },
  { label: "Next.js", initial: "N", bg: "#FFFFFF", fg: "#000", row: 2 },
  { label: "Vue", initial: "V", bg: "#4FC08D", row: 2 },
  { label: "Svelte", initial: "Sv", bg: "#FF3E00", row: 2 },
  { label: "Angular", initial: "Ng", bg: "#DD0031", row: 2 },
  { label: "Tailwind CSS", initial: "Tw", bg: "#06B6D4", row: 2 },
  { label: "Astro", initial: "As", bg: "#FF5D01", row: 2 },
  { label: "SolidJS", initial: "Sj", bg: "#2C4F7C", row: 2 },

  // Row 3 — Backend & Runtime
  { label: "Node.js", initial: "Nd", bg: "#339933", row: 3 },
  { label: "Deno", initial: "D", bg: "#FFFFFF", fg: "#000", row: 3 },
  { label: "Bun", initial: "B", bg: "#FBF0DF", fg: "#000", row: 3 },
  { label: "NestJS", initial: "Ne", bg: "#E0234E", row: 3 },
  { label: "Django", initial: "Dj", bg: "#0C4B33", row: 3 },
  { label: "FastAPI", initial: "Fa", bg: "#009688", row: 3 },
  { label: "Rails", initial: "Rl", bg: "#CC0000", row: 3 },
  { label: "GraphQL", initial: "Gq", bg: "#E10098", row: 3 },

  // Row 4 — Data & Cloud
  { label: "PostgreSQL", initial: "Pg", bg: "#4169E1", row: 4 },
  { label: "MongoDB", initial: "Mg", bg: "#47A248", row: 4 },
  { label: "Redis", initial: "Rd", bg: "#DC382D", row: 4 },
  { label: "Prisma", initial: "Pr", bg: "#2D3748", row: 4 },
  { label: "Supabase", initial: "Sb", bg: "#3ECF8E", fg: "#000", row: 4 },
  { label: "AWS", initial: "Aw", bg: "#FF9900", fg: "#000", row: 4 },
  { label: "Vercel", initial: "Vc", bg: "#FFFFFF", fg: "#000", row: 4 },
  { label: "Cloudflare", initial: "Cf", bg: "#F38020", row: 4 },

  // Row 5 — Tooling & DevOps
  { label: "Docker", initial: "Dk", bg: "#2496ED", row: 5 },
  { label: "Kubernetes", initial: "K8", bg: "#326CE5", row: 5 },
  { label: "Git", initial: "Gt", bg: "#F05032", row: 5 },
  { label: "GitHub", initial: "Gh", bg: "#FFFFFF", fg: "#000", row: 5 },
  { label: "Figma", initial: "Fg", bg: "#F24E1E", row: 5 },
  { label: "Three.js", initial: "3J", bg: "#FFFFFF", fg: "#000", row: 5 },
  { label: "Framer Motion", initial: "Fm", bg: "#0055FF", row: 5 },
  { label: "Stripe", initial: "St", bg: "#635BFF", row: 5 },
];

function makeItems(maxRows = 5): LogoItem[] {
  const filtered = TECHS.filter((t) => t.row <= maxRows);

  const counts = filtered.reduce<Record<number, number>>((acc, t) => {
    acc[t.row] = (acc[t.row] ?? 0) + 1;
    return acc;
  }, {});

  const indexInRow: Record<number, number> = {};

  return filtered.map((t) => {
    indexInRow[t.row] = (indexInRow[t.row] ?? -1) + 1;
    const i = indexInRow[t.row];
    const total = counts[t.row];
    const rowDuration = 32 + (t.row % 3) * 4;
    const delay = -(rowDuration / total) * i;

    return {
      label: t.label,
      icon: <Badge initial={t.initial} bg={t.bg} fg={t.fg} />,
      animationDelay: delay,
      animationDuration: rowDuration,
      row: t.row,
    };
  });
}

export default function TechStack({
  title = "OUR STACK",
  showHeader = true,
  compact = false,
}: {
  title?: string;
  showHeader?: boolean;
  compact?: boolean;
}) {
  const items = makeItems(compact ? 3 : 5);

  return (
    <section className="bg-ink border-t border-white/5">
      {showHeader && (
        <div className="max-w-7xl mx-auto px-6 sm:px-10 pt-20 pb-6 text-center">
          <p className="text-ember text-[11px] tracking-[0.3em] uppercase mb-4 font-medium">
            ▸ Built with
          </p>
          <h2 className="text-white text-3xl sm:text-4xl font-light tracking-tight">
            The tools we trust.
          </h2>
          <p className="text-white/40 text-sm font-light max-w-md mx-auto mt-4 leading-relaxed">
            A working slice of the languages, frameworks, and platforms we reach
            for — picked by fit, never by fashion.
          </p>
        </div>
      )}

      {!showHeader && (
        <div className="max-w-7xl mx-auto px-6 sm:px-10 pt-10 pb-2 text-center">
          <p className="text-ember text-[10px] tracking-[0.35em] uppercase font-medium mb-2">
            ▸ Familiar with
          </p>
          <p className="text-white/40 text-xs font-light tracking-wide">
            Languages, frameworks, and platforms we work with day&#8209;to&#8209;day.
          </p>
        </div>
      )}

      <LogoTimeline
        items={items}
        title={compact ? undefined : title}
        height={compact ? "h-[260px] sm:h-[380px]" : "h-[420px] sm:h-[640px]"}
      />
    </section>
  );
}
