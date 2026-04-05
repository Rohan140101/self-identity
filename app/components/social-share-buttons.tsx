"use client";

import { usePathname } from "next/navigation";
import { Facebook, Linkedin, Twitter } from "lucide-react";

type SharePlatform = {
  label: string;
  icon: typeof Twitter;
  buildUrl: (pageUrl: string) => string;
};

const defaultSiteUrl = "https://self-identity.me";

// Only X supports reliably prefilled text through a simple public share URL.
// To add default text back for X, set this to something like:
// const optionalXShareText = "Check out The Science of Self-Identity.";
// Facebook and LinkedIn should stay URL-only here.
const optionalXShareText = "";

const sharePlatforms: SharePlatform[] = [
  {
    label: "X",
    icon: Twitter,
    buildUrl: (pageUrl) => {
      const params = new URLSearchParams({ url: pageUrl });

      if (optionalXShareText) {
        params.set("text", optionalXShareText);
      }

      return `https://twitter.com/intent/tweet?${params.toString()}`;
    },
  },
  {
    label: "Facebook",
    icon: Facebook,
    buildUrl: (pageUrl) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
  },
  {
    label: "LinkedIn",
    icon: Linkedin,
    buildUrl: (pageUrl) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`,
  },
];

const SocialShareButtons = function SocialShareButtons() {
  const pathname = usePathname();
  const pageUrl = new URL(pathname || "/", defaultSiteUrl).toString();

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 md:justify-end">
      {sharePlatforms.map(({ label, icon: Icon, buildUrl }) => (
        <a
          key={label}
          href={buildUrl(pageUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full border border-slate-500 px-4 py-2 text-sm font-medium text-(--brand-light) transition-colors hover:border-white hover:text-white"
          aria-label={`Share this page on ${label}`}
        >
          <Icon size={18} />
          <span>{label}</span>
        </a>
      ))}
    </div>
  );
};

export default SocialShareButtons;
