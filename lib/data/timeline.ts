export interface TimelineEra {
  period: string;
  theme: string;
  description: string;
}

export const TIMELINE: TimelineEra[] = [
  {
    period: "2009",
    theme: "Tellclick Inc. established in Canada",
    description: "The corporate foundation for everything that followed.",
  },
  {
    period: "2010–2014",
    theme: "Enterprise infrastructure",
    description:
      "Windows Server, Active Directory, clustering, VMware, SCCM, data-centre systems, server migration and disaster recovery.",
  },
  {
    period: "2014–2019",
    theme: "Security and regulated banking operations",
    description:
      "CyberArk, IAM, vulnerability remediation, hardening, DR, Citrix, virtualization, PowerShell and Ansible across major banking environments.",
  },
  {
    period: "2019–2024",
    theme: "Cloud, modernization and automation",
    description:
      "Azure/AWS migration, Microsoft 365, Automation Anywhere, Windows modernization, cybersecurity remediation and enterprise application support.",
  },
  {
    period: "2024–present",
    theme: "Resilience, audit and compliance",
    description:
      "Infrastructure operations, access cleanup, patch compliance, audit remediation and enterprise controls.",
  },
  {
    period: "2026+",
    theme: "Applied artificial intelligence",
    description:
      "Ketrivo: applying Tellclick's enterprise experience to AI operations for Saudi businesses.",
  },
];
