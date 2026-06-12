import type { Metadata } from "next";
import { Prose } from "@/components/site/Prose";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <Prose title="Terms of service" intro="The basics of ordering with Amra Flowers.">
      <h2>Orders</h2>
      <p>
        Because every bouquet is made to order, designs are confirmed at checkout.
        Substitutions of equal value may occasionally be made for seasonal
        availability, always matching your colours and style.
      </p>
      <h2>Cancellations</h2>
      <p>
        Orders can be changed or cancelled up to 24 hours before the delivery date.
      </p>
      <p className="text-sm text-ink-faint">
        This is placeholder copy for the demo and not a binding contract.
      </p>
    </Prose>
  );
}
