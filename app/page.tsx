import { Hero } from "@/components/Hero";
import { Progression } from "@/components/Progression";
import { SectorSection } from "@/components/SectorSection";
import { EnterpriseEnvironments } from "@/components/EnterpriseEnvironments";
import { ProofStrip } from "@/components/ProofStrip";
import { Capabilities } from "@/components/Capabilities";
import { KetrivoSection } from "@/components/KetrivoSection";

export default function Home() {
  return (
    <>
      <Hero />
      <Progression />
      <SectorSection />
      <EnterpriseEnvironments />
      <ProofStrip />
      <Capabilities />
      <KetrivoSection />
    </>
  );
}
