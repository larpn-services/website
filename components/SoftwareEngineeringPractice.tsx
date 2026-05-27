"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

type Agent = {
  name: string;
  description: string;
  tags: string[];
};

type AgentCategory = {
  label: string;
  agents: Agent[];
};

const AGENT_CATEGORIES: AgentCategory[] = [
  {
    label: "Workflow",
    agents: [
      {
        name: "Lead-to-Deal Pipeline",
        description:
          "Searches Apollo for ICP-matched leads, deduplicates against HubSpot, creates CRM objects, notifies via Slack, and sends a Calendly booking link.",
        tags: ["Apollo", "HubSpot", "Slack", "Calendly"],
      },
      {
        name: "Proposal Builder",
        description:
          "Auto-fills client proposals from HubSpot/Notion templates, pulls portfolio items, saves drafts to Google Drive, and tracks which templates convert best.",
        tags: ["HubSpot", "Notion", "Google Drive"],
      },
      {
        name: "Form Autocomplete",
        description:
          "AI-powered form filling with tabbed UI and a chat interface — submit accurate forms in seconds.",
        tags: ["Automation", "Forms"],
      },
    ],
  },
  {
    label: "Customer Support",
    agents: [
      {
        name: "WhatsApp Business Responder",
        description:
          "Matches inbound messages against your knowledge base, replies accurately, and escalates what it can't handle — with full conversation logging.",
        tags: ["WhatsApp", "Automation"],
      },
      {
        name: "Refund & Cancellation Agent",
        description:
          "Verifies the customer in Stripe, explains your refund policy, processes approved refunds or cancellations, and logs the outcome in Intercom.",
        tags: ["Stripe", "Intercom"],
      },
    ],
  },
  {
    label: "DevOps",
    agents: [
      {
        name: "Security Auditor",
        description:
          "Comprehensive security audits and compliance assessments against SOC 2, ISO 27001, HIPAA, PCI DSS, GDPR, and NIST — with prioritised findings and remediation roadmaps.",
        tags: ["Security", "Compliance"],
      },
      {
        name: "PR Reviewer",
        description:
          "Structured code review on every pull request — correctness, security, and convention issues posted as inline comments automatically.",
        tags: ["GitHub", "DevOps"],
      },
    ],
  },
];

function AgentCard({ agent, delay }: { agent: Agent; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl border border-white/[0.07] bg-gradient-to-b from-white/[0.025] to-transparent p-5 sm:p-6 hover:border-ember/25 transition-colors group"
    >
      <h4 className="text-white text-base font-normal tracking-tight mb-2 group-hover:text-ember/90 transition-colors">
        {agent.name}
      </h4>
      <p className="text-white/45 text-sm font-light leading-relaxed mb-4">
        {agent.description}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {agent.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/40 text-[10px] tracking-[0.15em] uppercase font-light"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function SoftwareEngineeringPractice({
  onBack,
}: {
  onBack: () => void;
}) {
  let cardDelay = 0.3;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
        className="mb-16"
      >
        <p className="text-ember text-[10px] tracking-[0.35em] uppercase mb-5 font-medium">
          02 — Practice
        </p>
        <h1 className="text-white text-4xl sm:text-6xl font-light tracking-tight mb-6 leading-[1.05]">
          Software engineering.
          <br />
          <span className="text-white/35 italic">Agents that work for you.</span>
        </h1>
        <p className="text-white/40 text-base font-light max-w-2xl leading-relaxed">
          Bespoke AI agents engineered with rigor — from focused workflow automation
          to enterprise-grade autonomous systems that handle real business processes.
        </p>
      </motion.div>

      {/* Agent categories */}
      <div className="space-y-16">
        {AGENT_CATEGORIES.map((cat, catIdx) => {
          const sectionDelay = cardDelay;
          return (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.2 + catIdx * 0.08,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-ember text-[10px] tracking-[0.35em] uppercase font-medium">
                  {cat.label}
                </span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.agents.map((agent, agentIdx) => {
                  const d = sectionDelay + agentIdx * 0.06;
                  cardDelay = d + 0.06;
                  return (
                    <AgentCard key={agent.name} agent={agent} delay={d} />
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* More agents note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="mt-12 text-white/25 text-sm font-light italic"
      >
        …and many more agents available on request.
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="mt-10 flex items-center"
      >
        <Link
          href="/contact"
          className="group inline-flex items-center gap-2 px-7 py-3.5 bg-white text-black rounded-full text-sm font-medium hover:bg-ember hover:text-white transition-all"
        >
          Commission an agent
          <ArrowUpRight
            size={15}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </Link>
      </motion.div>
    </motion.div>
  );
}
