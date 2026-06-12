import type { Metadata } from "next";
import { Prose } from "@/components/site/Prose";

export const metadata: Metadata = { title: "Delivery & areas" };

export default function DeliveryPage() {
  return (
    <Prose
      title="Delivery & areas"
      intro="Fresh flowers, brought to the door in a window you choose."
    >
      <h2>Where we deliver</h2>
      <p>
        We currently deliver across major metros and a growing list of cities.
        Enter a 6-digit PIN code at checkout to confirm we cover the address.
      </p>
      <h2>When</h2>
      <p>
        Choose a delivery date and one of four time slots at checkout. Same-day
        delivery is available in select cities for orders placed before noon.
      </p>
      <h2>Charges</h2>
      <p>
        Delivery is <strong>₹99</strong>, and <strong>free</strong> on orders over
        ₹1,999.
      </p>
    </Prose>
  );
}
