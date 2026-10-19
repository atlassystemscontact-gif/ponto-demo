import { Hero } from "@/components/home/Hero";
import { Capitulos } from "@/components/home/Capitulos";
import { TelaCheia } from "@/components/home/TelaCheia";
import { FlowingMenu } from "@/components/home/FlowingMenu";
import { Destaques } from "@/components/home/Destaques";
import { EncomendasNatal } from "@/components/home/EncomendasNatal";
import { ComoPedir } from "@/components/home/ComoPedir";
import { Visite } from "@/components/home/Visite";

export default function Home() {
  return (
    <>
      <Hero />
      <Capitulos />
      <TelaCheia />
      <FlowingMenu />
      <Destaques />
      <EncomendasNatal />
      <ComoPedir />
      <Visite />
    </>
  );
}
