/**
 * Full-width mega-menu content shown under each top-level navbar link
 * (Cohere-style: a label + big title + one-line subtitle on the left,
 * one or two columns of {title, description} items in the middle, and a
 * plain list of sibling-page links on the right). Kept short — 3 items per
 * column, single-line descriptions — so the panel stays compact and never
 * dominates the page. Copy is drawn from the approved website content brief
 * (Tellclick_Website_Strategy_Content_Brief_Sep_2026.pdf) and kept in sync
 * with what each page actually contains (lib/data/*.ts) rather than
 * introducing new claims.
 */

export interface NavMegaItem {
  title: string;
  description: string;
}

export interface NavMegaColumn {
  heading: string;
  items: NavMegaItem[];
}

export interface NavMegaEntry {
  href: string;
  label: string;
  title: string;
  subtitle: string;
  cta: string;
  columns: NavMegaColumn[];
}

export const NAV_MEGA: Record<string, NavMegaEntry> = {
  "/": {
    href: "/",
    label: "Home",
    title: "Built over time.",
    subtitle: "Enterprise technology experience since 2009.",
    cta: "Explore the full story",
    columns: [
      {
        heading: "Proof points",
        items: [
          { title: "15+ years", description: "Enterprise technology experience." },
          { title: "500+ mailboxes", description: "Migrated in one cloud transformation." },
          { title: "150+ servers", description: "Built during a major modernization." },
        ],
      },
      {
        heading: "The progression",
        items: [
          { title: "Infrastructure", description: "Windows Server environments and fundamentals." },
          { title: "Cloud", description: "Azure, AWS and Microsoft 365 transformation." },
          { title: "AI", description: "Applied through Ketrivo's AI operations." },
        ],
      },
    ],
  },
  "/about": {
    href: "/about",
    label: "About",
    title: "Experience before hype.",
    subtitle: "Tellclick's origin, evolution and philosophy.",
    cta: "Read our principles",
    columns: [
      {
        heading: "Principles",
        items: [
          { title: "Practical over fashionable", description: "Solve real operational problems, not trends." },
          { title: "Enterprise discipline", description: "Security and change control from the beginning." },
          { title: "Automation with accountability", description: "Reduce repetitive work, preserve control." },
        ],
      },
    ],
  },
  "/experience": {
    href: "/experience",
    label: "Experience",
    title: "Evidence, not adjectives.",
    subtitle: "Sectors, environments and case studies since 2009.",
    cta: "View the timeline",
    columns: [
      {
        heading: "Case studies",
        items: [
          { title: "Cloud transformation", description: "500+ mailboxes migrated to Exchange Online." },
          { title: "Large server modernization", description: "150+ Windows Server 2019 systems." },
          { title: "Privileged access & security", description: "CyberArk and audit remediation." },
        ],
      },
      {
        heading: "Sectors",
        items: [
          { title: "Financial Services", description: "Security hardening in regulated banking." },
          { title: "Education & Public Institutions", description: "Domain and platform modernization." },
          { title: "Insurance & Enterprise", description: "Server modernization at scale." },
        ],
      },
    ],
  },
  "/capabilities": {
    href: "/capabilities",
    label: "Capabilities",
    title: "Five disciplines.",
    subtitle: "The technical disciplines behind the history.",
    cta: "See all capabilities",
    columns: [
      {
        heading: "Core disciplines",
        items: [
          { title: "Enterprise Infrastructure", description: "Windows Server, AD and clustering." },
          { title: "Virtualization & Modernization", description: "VMware, Hyper-V and Citrix at scale." },
          { title: "Cloud & Microsoft 365", description: "Azure, AWS and Exchange Online." },
        ],
      },
      {
        heading: "More disciplines",
        items: [
          { title: "Cybersecurity & Access", description: "IAM/PAM and vulnerability remediation." },
          { title: "Automation", description: "Automation Anywhere, Ansible, PowerShell." },
          { title: "Enterprise Operations", description: "Change management and disaster recovery." },
        ],
      },
    ],
  },
  "/ketrivo": {
    href: "/ketrivo",
    label: "Ketrivo / AI",
    title: "Applied to AI.",
    subtitle: "Enterprise experience, powering Saudi AI operations.",
    cta: "Visit Ketrivo",
    columns: [
      {
        heading: "Why it matters",
        items: [
          { title: "Security first", description: "AI still needs access control and reliability." },
          { title: "Enterprise thinking", description: "Operations discipline applied to AI strategy." },
          { title: "Saudi-focused", description: "Backed by an established Canadian foundation." },
        ],
      },
    ],
  },
};
