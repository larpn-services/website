"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SHIMMER_STYLE_ID = "an-edit-tool-shimmer-styles";
const SHIMMER_STYLES = `
@keyframes an-edit-shimmer {
  from { background-position: 100% center; }
  to { background-position: 0% center; }
}
.an-edit-shimmer {
  display: inline-flex;
  align-items: center;
  height: 1rem;
  background-size: 250% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-image: linear-gradient(90deg, #a3a3a3 0%, #a3a3a3 40%, #525252 50%, #a3a3a3 60%, #a3a3a3 100%);
  background-repeat: no-repeat;
  animation: an-edit-shimmer 1.2s linear infinite;
}
@keyframes an-edit-dot {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
}
.an-edit-dot { animation: an-edit-dot 1.4s ease-in-out infinite; }
.an-edit-dot:nth-child(2) { animation-delay: 0.2s; }
.an-edit-dot:nth-child(3) { animation-delay: 0.4s; }
`;

let shimmerStylesInjected = false;
function ensureShimmerStyles() {
  if (typeof document === "undefined") return;
  if (shimmerStylesInjected) return;
  if (document.getElementById(SHIMMER_STYLE_ID)) {
    shimmerStylesInjected = true;
    return;
  }
  const el = document.createElement("style");
  el.id = SHIMMER_STYLE_ID;
  el.textContent = SHIMMER_STYLES;
  document.head.appendChild(el);
  shimmerStylesInjected = true;
}

type DiffOp = { type: "context" | "remove" | "add"; text: string };

function lineDiff(oldText: string, newText: string): DiffOp[] {
  const a = oldText.split("\n");
  const b = newText.split("\n");
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array<number>(n + 1).fill(0),
  );
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (a[i] === b[j]) dp[i][j] = dp[i + 1][j + 1] + 1;
      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const ops: DiffOp[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (a[i] === b[j]) {
      ops.push({ type: "context", text: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ type: "remove", text: a[i] });
      i++;
    } else {
      ops.push({ type: "add", text: b[j] });
      j++;
    }
  }
  while (i < m) {
    ops.push({ type: "remove", text: a[i] });
    i++;
  }
  while (j < n) {
    ops.push({ type: "add", text: b[j] });
    j++;
  }
  return ops;
}

function countDiffStats(ops: DiffOp[]): { added: number; removed: number } {
  let added = 0;
  let removed = 0;
  for (const op of ops) {
    if (op.type === "add") added++;
    else if (op.type === "remove") removed++;
  }
  return { added, removed };
}

type ApprovalDecision = "approved" | "rejected" | null;

function ApprovalFooter({
  isPending,
  approveLabel = "Approve",
  rejectLabel = "Reject",
  onApprove,
  onReject,
}: {
  isPending: boolean;
  approveLabel?: string;
  rejectLabel?: string;
  onApprove?: () => void;
  onReject?: () => void;
}) {
  const [decision, setDecision] = React.useState<ApprovalDecision>(null);
  const handleApprove = () => {
    setDecision("approved");
    onApprove?.();
  };
  const handleReject = () => {
    setDecision("rejected");
    onReject?.();
  };

  let status: string | null = null;
  if (decision === "approved") status = isPending ? "Starting" : "Approved";
  else if (decision === "rejected") status = "Canceled";
  else if (isPending) status = "Waiting";

  return (
    <div className="flex items-center justify-between gap-2 px-2.5 py-2 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/40">
      {status && decision !== null ? (
        <span className="text-xs text-neutral-500 dark:text-neutral-400 inline-flex items-center gap-1.5">
          {status}
          {decision === "approved" && isPending && (
            <span className="inline-flex gap-0.5">
              <span className="an-edit-dot">.</span>
              <span className="an-edit-dot">.</span>
              <span className="an-edit-dot">.</span>
            </span>
          )}
        </span>
      ) : (
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {status ?? ""}
        </span>
      )}
      {decision === null && (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleReject}
            className="px-2 h-7 rounded-[6px] text-xs font-medium border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60"
          >
            {rejectLabel}
          </button>
          <button
            type="button"
            onClick={handleApprove}
            className="px-2 h-7 rounded-[6px] text-xs font-medium bg-blue-500 dark:bg-blue-400 text-white dark:text-neutral-950 hover:bg-blue-600 dark:hover:bg-blue-300"
          >
            {approveLabel}
          </button>
        </div>
      )}
    </div>
  );
}

export type EditToolApproval = {
  approveLabel?: string;
  rejectLabel?: string;
  onApprove?: () => void;
  onReject?: () => void;
};

export type EditToolProps = {
  state?: "completed" | "pending" | "waiting";
  variant?: "edit" | "write";
  filePath?: string;
  oldContent?: string;
  newContent?: string;
  approval?: EditToolApproval;
  className?: string;
};

export const EditTool = React.memo(function EditTool({
  state = "completed",
  variant = "edit",
  filePath,
  oldContent,
  newContent,
  approval,
  className,
}: EditToolProps) {
  React.useEffect(() => {
    ensureShimmerStyles();
  }, []);

  const isPending = state === "pending";
  const isWaiting = state === "waiting";
  const isWrite = variant === "write";
  const fileName = filePath?.split("/").pop() ?? undefined;

  const diffOps = React.useMemo<DiffOp[] | null>(() => {
    if (isWaiting) return null;
    if (isWrite && newContent) {
      return newContent.split("\n").map((text) => ({ type: "add", text }));
    }
    if (oldContent !== undefined && newContent !== undefined) {
      return lineDiff(oldContent, newContent);
    }
    return null;
  }, [isWaiting, isWrite, oldContent, newContent]);

  const stats = React.useMemo(
    () => (diffOps ? countDiffStats(diffOps) : null),
    [diffOps],
  );

  const headerLabel = isWaiting
    ? "Generating..."
    : isPending
      ? `${isWrite ? "Creating" : "Editing"}${fileName ? ` ${fileName}` : ""}`
      : `${isWrite ? "Created" : "Edited"}${fileName ? ` ${fileName}` : ""}`;

  return (
    <div
      className={cn(
        "rounded-[10px] border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-black overflow-hidden w-full",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between px-2.5 h-7 bg-neutral-100 dark:bg-neutral-900",
          (diffOps && diffOps.length > 0) || approval
            ? "border-b border-neutral-200 dark:border-neutral-800"
            : "",
        )}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {isPending || isWaiting ? (
            <span className="an-edit-shimmer text-xs">{headerLabel}</span>
          ) : (
            <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
              {headerLabel}
            </span>
          )}
        </div>
        {stats && !isPending && !isWaiting && (stats.added > 0 || stats.removed > 0) && (
          <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 inline-flex gap-2 shrink-0">
            {stats.added > 0 && (
              <span className="text-green-600 dark:text-green-400">
                +{stats.added}
              </span>
            )}
            {stats.removed > 0 && (
              <span className="text-red-600 dark:text-red-400">
                -{stats.removed}
              </span>
            )}
          </span>
        )}
      </div>
      {diffOps && diffOps.length > 0 && (
        <div className="text-[12px] font-mono leading-[1.5] bg-white dark:bg-black overflow-x-auto">
          {diffOps.map((op, i) => (
            <div
              key={i}
              className={cn(
                "flex items-start min-w-0",
                op.type === "add" &&
                  "bg-green-50 dark:bg-green-950/30 text-green-900 dark:text-green-200",
                op.type === "remove" &&
                  "bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-200",
                op.type === "context" &&
                  "text-neutral-700 dark:text-neutral-300",
              )}
            >
              <span
                className={cn(
                  "select-none w-4 text-center shrink-0",
                  op.type === "add" && "text-green-600 dark:text-green-400",
                  op.type === "remove" && "text-red-600 dark:text-red-400",
                  op.type === "context" && "text-neutral-400 dark:text-neutral-600",
                )}
              >
                {op.type === "add" ? "+" : op.type === "remove" ? "-" : " "}
              </span>
              <span className="whitespace-pre pr-2 flex-1 min-w-0">
                {op.text || " "}
              </span>
            </div>
          ))}
        </div>
      )}
      {approval && (
        <ApprovalFooter
          isPending={isPending}
          approveLabel={approval.approveLabel}
          rejectLabel={approval.rejectLabel}
          onApprove={approval.onApprove}
          onReject={approval.onReject}
        />
      )}
    </div>
  );
});
