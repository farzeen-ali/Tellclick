export interface CapabilityDetail {
  index: string;
  name: string;
  description: string;
}

export const CAPABILITIES_DETAIL: CapabilityDetail[] = [
  {
    index: "01",
    name: "Enterprise Infrastructure",
    description:
      "Windows Server, Active Directory, DNS/DHCP, clustering, high availability, enterprise application infrastructure, storage and production operations.",
  },
  {
    index: "02",
    name: "Virtualization & Modernization",
    description:
      "VMware, Hyper-V, Citrix, server migrations, platform upgrades, P2V/V2V and environment modernization.",
  },
  {
    index: "03",
    name: "Cloud & Microsoft 365",
    description:
      "Azure, AWS exposure, Microsoft 365, Exchange Online migrations, cloud VM standardization, monitoring and hybrid transformation.",
  },
  {
    index: "04",
    name: "Cybersecurity & Access",
    description:
      "CyberArk, IAM/PAM, vulnerability remediation, hardening, GPO controls, patch compliance, audit findings and security operations.",
  },
  {
    index: "05",
    name: "Automation",
    description:
      "Automation Anywhere, Ansible and PowerShell used to reduce repetitive operational work and improve consistency.",
  },
  {
    index: "06",
    name: "Enterprise Operations",
    description:
      "ServiceNow, change management, incident management, disaster recovery, documentation, production handover and cross-team delivery.",
  },
];

export const TECHNOLOGY_NAMES = [
  "Microsoft Azure",
  "AWS",
  "Microsoft 365",
  "Windows Server",
  "Active Directory",
  "VMware",
  "Hyper-V",
  "Citrix",
  "Red Hat Linux",
  "CyberArk",
  "Qualys",
  "Tenable",
  "Tripwire",
  "Automation Anywhere",
  "Ansible",
  "PowerShell",
  "ServiceNow",
];
