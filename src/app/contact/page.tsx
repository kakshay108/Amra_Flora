import type { Metadata } from "next";
import { Prose } from "@/components/site/Prose";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <Prose title="Contact us" intro="We are happy to help with orders, deliveries and custom requests.">
      <h2>Customer care</h2>
      <p>
        Email <strong>care@amraflowers.example</strong> or call{" "}
        <strong>+91 80000 00000</strong>, 9am–9pm every day.
      </p>
      <h2>Large & corporate orders</h2>
      <p>
        Planning a wedding, an event or recurring office flowers? Write to{" "}
        <strong>events@amraflowers.example</strong> and our team will design with
        you.
      </p>
    </Prose>
  );
}
