import type { Metadata } from "next";
import { StudioClient } from "@/components/studio/StudioClient";
import { presetBySlug } from "@/lib/presets";

export const metadata: Metadata = {
  title: "Design your bouquet",
  description:
    "Choose your flowers, shades, shape, wrapping and message, and preview your custom bouquet in interactive 3D.",
};

export default async function StudioPage({
  searchParams,
}: {
  searchParams: Promise<{ preset?: string }>;
}) {
  const { preset } = await searchParams;
  const initial = preset ? presetBySlug(preset)?.config : undefined;
  return <StudioClient initialConfig={initial} />;
}
