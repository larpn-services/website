import type { ReactElement } from "react";

type IconProps = { size?: number };

function FacebookIcon({ size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.92 3.78-3.92 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33V22c4.78-.79 8.44-4.93 8.44-9.94Z" />
    </svg>
  );
}

function NextdoorIcon({ size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.86 8.32c-.86 0-1.6.34-2.13.86-.34-2.04-1.97-3.6-4.04-3.6-1.04 0-2 .4-2.71 1.06V3.4H5.2v6.62c-.83 0-1.5.67-1.5 1.5v8.16c0 .73.59 1.32 1.32 1.32H19c.73 0 1.32-.59 1.32-1.32v-6.85c0-2.27-1.18-4.51-2.46-4.51Zm-.36 9.95H6.5v-7.62c0-2.04 1.45-3.55 3.39-3.55 1.95 0 3.4 1.51 3.4 3.55v.84h2.05v-.42c0-.85.58-1.45 1.32-1.45.79 0 1.34.65 1.34 1.62v6.16c0 .54-.04.87-.5.87Z" />
    </svg>
  );
}

function LinkedinIcon({ size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

function GithubIcon({ size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.3 3.6 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.3-3.2-.1-.3-.6-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
    </svg>
  );
}

function GoogleIcon({ size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21.35 11.1h-9.17v2.74h6.5c-.33 3.81-3.5 5.44-6.5 5.44A6.27 6.27 0 0 1 5.9 13a6.27 6.27 0 0 1 6.28-6.28c1.73 0 3.3.61 4.53 1.61L18.7 6.34A9.18 9.18 0 0 0 12.18 4a9 9 0 1 0 0 18c4.5 0 9-3 9-9.05 0-.65-.07-1.18-.16-1.85Z" />
    </svg>
  );
}

export type Social = {
  label: string;
  href: string;
  Icon: (props: IconProps) => ReactElement;
  comingSoon?: boolean;
};

export const socials: Social[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61590496850800",
    Icon: FacebookIcon,
  },
  {
    label: "Nextdoor",
    href: "https://nextdoor.com/page-admin/ads-management/?profile_id=183342606",
    Icon: NextdoorIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/omar-hamdan-74674933b/",
    Icon: LinkedinIcon,
  },
  {
    label: "GitHub",
    href: "https://github.com/omarayman23",
    Icon: GithubIcon,
  },
  {
    label: "Google (coming soon)",
    href: "#",
    Icon: GoogleIcon,
    comingSoon: true,
  },
];

export default function SocialsStrip({ size = 14 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      {socials.map(({ label, href, Icon, comingSoon }) =>
        comingSoon ? (
          <span
            key={label}
            aria-label={label}
            title="Coming soon"
            className="relative group w-9 h-9 rounded-full border border-dashed border-white/10 flex items-center justify-center text-white/25 cursor-not-allowed"
          >
            <Icon size={size} />
            <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] tracking-[0.2em] uppercase text-white/30 opacity-0 group-hover:opacity-100 transition-opacity">
              coming soon
            </span>
          </span>
        ) : (
          <a
            key={label}
            href={href}
            aria-label={label}
            target="_blank"
            rel="noopener noreferrer"
            className="group w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-ember hover:border-ember hover:bg-white/[0.03] transition-colors"
          >
            <Icon size={size} />
          </a>
        )
      )}
    </div>
  );
}
