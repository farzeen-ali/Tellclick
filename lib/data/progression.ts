export interface ProgressionStage {
  label: string;
  description: string;
}

export const PROGRESSION_STAGES: ProgressionStage[] = [
  {
    label: "Infrastructure",
    description:
      "Physical infrastructure and Windows Server environments — the operational fundamentals enterprise technology is built on.",
  },
  {
    label: "Virtualization",
    description:
      "VMware, Hyper-V and Citrix environments, server migrations and platform modernization at scale.",
  },
  {
    label: "Security",
    description:
      "Privileged access, identity controls and vulnerability remediation inside regulated banking operations.",
  },
  {
    label: "Cloud",
    description:
      "Azure and AWS migration, Microsoft 365 transformation and hybrid infrastructure standardization.",
  },
  {
    label: "Automation",
    description:
      "Automation Anywhere, Ansible and PowerShell reducing repetitive operational work while preserving control and visibility.",
  },
  {
    label: "AI",
    description:
      "Applying that enterprise foundation to practical AI operations for business workflows through Ketrivo.",
  },
];
