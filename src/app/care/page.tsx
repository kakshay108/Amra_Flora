import type { Metadata } from "next";
import { Prose } from "@/components/site/Prose";

export const metadata: Metadata = { title: "Flower care" };

export default function CarePage() {
  return (
    <Prose title="Caring for your flowers" intro="A few minutes of care doubles their life.">
      <h2>On arrival</h2>
      <p>
        Trim 2–3 cm off each stem at an angle and place them in clean, room-
        temperature water as soon as you can.
      </p>
      <h2>Every day</h2>
      <p>
        Change the water every two days, re-trim the stems, and keep the bouquet
        away from direct sun, heat and ripening fruit.
      </p>
      <h2>Make them last</h2>
      <p>
        Use the sachet of flower food included with your order, and remove any
        leaves that would sit below the water line.
      </p>
    </Prose>
  );
}
