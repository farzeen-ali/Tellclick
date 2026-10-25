export interface CaseStudy {
  name: string;
  headline: string;
  description: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    name: "Cloud transformation",
    headline: "500+ mailboxes migrated to Exchange Online.",
    description:
      "Supported data-centre decommissioning and migration to Azure/AWS; migrated 500+ primary and archive mailboxes from Exchange 2016 to Exchange Online; standardized Azure VMs and implemented monitoring and security controls.",
  },
  {
    name: "Large server modernization",
    headline: "150+ Windows Server 2019 systems.",
    description:
      "Worked on Windows Server 2012-to-2019 modernization in a VMware environment; created approximately 150+ Windows Server 2019 systems to support side-by-side migrations and enterprise upgrade requirements.",
  },
  {
    name: "Privileged access & security",
    headline: "CyberArk, privileged access, vulnerability and audit remediation.",
    description:
      "Implemented and supported CyberArk-related privileged access processes, policy management, reconciliation and secure credential operations; performed vulnerability and audit-remediation work across regulated environments.",
  },
  {
    name: "Automation",
    headline: "Automation Anywhere, Ansible and PowerShell.",
    description:
      "Implemented Automation Anywhere bots in production environments; used Ansible and PowerShell to automate repetitive infrastructure and deployment tasks.",
  },
  {
    name: "Enterprise continuity",
    headline: "Disaster recovery, high availability, clustering, incident support and change management.",
    description:
      "Participated in disaster-recovery testing, high-availability and clustering work, production incident support, change management and post-change validation.",
  },
];
