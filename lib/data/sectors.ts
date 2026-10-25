export interface Sector {
  index: string;
  name: string;
  description: string;
}

export const SECTORS: Sector[] = [
  {
    index: "01",
    name: "Financial Services",
    description:
      "Security hardening, identity and access controls, and audit remediation inside regulated banking operations.",
  },
  {
    index: "02",
    name: "Education & Public Institutions",
    description:
      "Domain and directory modernization, platform migration and infrastructure decommissioning for public organizations.",
  },
  {
    index: "03",
    name: "Insurance & Enterprise",
    description:
      "Server modernization, clustering and change-controlled operations across large enterprise environments.",
  },
  {
    index: "04",
    name: "Technology & Digital Services",
    description:
      "Cloud migration, automation and vulnerability management supporting digital-first operating environments.",
  },
];
