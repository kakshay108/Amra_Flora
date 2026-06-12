import type { Metadata } from "next";
import { Prose } from "@/components/site/Prose";

export const metadata: Metadata = { title: "Our story" };

export default function AboutPage() {
  return (
    <Prose
      title="Our story"
      intro="Amra began with a simple frustration: every bouquet looked the same."
    >
      <p>
        We thought flowers should be as personal as the people they are meant for.
        So we built a florist where you are the designer. Choose the blooms, the
        shades, the shape, the wrapping and the words on the card, and see exactly
        what you are sending before you send it.
      </p>
      <h2>Hand-tied, never mass-made</h2>
      <p>
        Every Amra bouquet is arranged by hand on the morning of delivery using
        flowers sourced fresh that day. Your 3D design becomes a real arrangement,
        stem for stem.
      </p>
      <h2>Made in India, for India</h2>
      <p>
        We deliver across the country with same-day service in select cities, and
        we price and pay in rupees with UPI, cards and netbanking at checkout.
      </p>
    </Prose>
  );
}
