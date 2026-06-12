import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PresetDetail } from "@/components/shop/PresetDetail";
import { PRESETS, presetBySlug } from "@/lib/presets";

export function generateStaticParams() {
  return PRESETS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const preset = presetBySlug(slug);
  if (!preset) return { title: "Bouquet not found" };
  return { title: preset.name, description: preset.tagline };
}

export default async function PresetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const preset = presetBySlug(slug);
  if (!preset) notFound();
  return <PresetDetail preset={preset} />;
}
