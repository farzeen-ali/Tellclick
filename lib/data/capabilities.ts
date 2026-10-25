export interface Capability {
  index: string;
  name: string;
  description: string;
}

export const CAPABILITIES: Capability[] = [
  {
    index: "01",
    name: "Infrastructure",
    description:
      "Windows Server, Active Directory and enterprise application infrastructure supporting mission-critical operations.",
  },
  {
    index: "02",
    name: "Cloud",
    description:
      "Azure and AWS migration, Microsoft 365 transformation and hybrid infrastructure standardization.",
  },
  {
    index: "03",
    name: "Cybersecurity",
    description:
      "Privileged access management, vulnerability remediation and audit-ready security operations.",
  },
  {
    index: "04",
    name: "Automation",
    description:
      "Automation Anywhere, Ansible and PowerShell reducing repetitive operational work while preserving control.",
  },
  {
    index: "05",
    name: "Enterprise Operations",
    description:
      "Change management, disaster recovery and production support for regulated environments.",
  },
];
