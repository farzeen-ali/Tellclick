import type { LucideIcon } from "lucide-react";
import {
  Server,
  Layers,
  Cloud,
  ShieldCheck,
  Workflow,
  Settings2,
  Building2,
  History,
  Sparkles,
} from "lucide-react";

/**
 * Navbar-only content model for the mega menu / dropdown system. Deliberately
 * separate from lib/nav-links.ts (which Footer.tsx also depends on as a flat
 * {label, href} list) so restructuring the navbar's information architecture
 * never touches anything outside the navbar itself.
 */

export interface MegaMenuItem {
  label: string;
  href: string;
  description: string;
  icon: LucideIcon;
}

export interface MegaMenuLinkGroup {
  heading: string;
  items: { label: string; href: string }[];
}

export interface MegaMenuFeatured {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
}

export interface MegaMenuEntry {
  type: "mega";
  label: string;
  href: string;
  columns: MegaMenuItem[][];
  linkGroup: MegaMenuLinkGroup;
  featured: MegaMenuFeatured;
}

export interface SimpleMenuEntry {
  type: "simple";
  label: string;
  items: { label: string; href: string; description: string; icon: LucideIcon }[];
}

export type NavEntry = MegaMenuEntry | SimpleMenuEntry;

export const NAV_MENU: NavEntry[] = [
  {
    type: "mega",
    label: "Capabilities",
    href: "/capabilities",
    columns: [
      [
        {
          label: "Enterprise Infrastructure",
          href: "/capabilities",
          description: "Windows Server, Active Directory, clustering and production operations.",
          icon: Server,
        },
        {
          label: "Virtualization & Modernization",
          href: "/capabilities",
          description: "VMware, Hyper-V, Citrix and platform modernization at scale.",
          icon: Layers,
        },
        {
          label: "Cloud & Microsoft 365",
          href: "/capabilities",
          description: "Azure, AWS, Exchange Online migrations and hybrid transformation.",
          icon: Cloud,
        },
      ],
      [
        {
          label: "Cybersecurity & Access",
          href: "/capabilities",
          description: "IAM/PAM, vulnerability remediation and security operations.",
          icon: ShieldCheck,
        },
        {
          label: "Automation",
          href: "/capabilities",
          description: "Automation Anywhere, Ansible and PowerShell in production.",
          icon: Workflow,
        },
        {
          label: "Enterprise Operations",
          href: "/capabilities",
          description: "Change management, disaster recovery and production handover.",
          icon: Settings2,
        },
      ],
    ],
    linkGroup: {
      heading: "Explore",
      items: [
        { label: "Capabilities Overview", href: "/capabilities" },
        { label: "Technology Stack", href: "/capabilities" },
        { label: "Timeline & Case Studies", href: "/experience" },
      ],
    },
    featured: {
      eyebrow: "Featured",
      title: "Ketrivo — enterprise experience, applied to AI.",
      description: "See how this foundation extends into applied artificial intelligence.",
      href: "/ketrivo",
      cta: "Visit Ketrivo",
    },
  },
  {
    type: "simple",
    label: "Company",
    items: [
      {
        label: "About",
        href: "/about",
        description: "Our story and principles.",
        icon: Building2,
      },
      {
        label: "Experience",
        href: "/experience",
        description: "Timeline and case studies.",
        icon: History,
      },
      {
        label: "Ketrivo / AI",
        href: "/ketrivo",
        description: "Applied AI, powered by Tellclick.",
        icon: Sparkles,
      },
    ],
  },
];
