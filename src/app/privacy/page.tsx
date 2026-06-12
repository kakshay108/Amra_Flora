import type { Metadata } from "next";
import { Prose } from "@/components/site/Prose";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <Prose title="Privacy policy" intro="A short, plain-language summary of how we handle your data.">
      <p>
        We collect only what we need to fulfil your order: your name, contact
        details and delivery address. We never sell your data.
      </p>
      <h2>Payments</h2>
      <p>
        Payments are processed securely by Razorpay. We do not store your card or
        UPI details on our servers.
      </p>
      <h2>Your choices</h2>
      <p>
        You can request a copy or deletion of your data at any time by writing to
        care@amraflowers.example.
      </p>
      <p className="text-sm text-ink-faint">
        This is placeholder copy for the demo and not legal advice.
      </p>
    </Prose>
  );
}
