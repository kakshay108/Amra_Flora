import Link from "next/link";
import { Logo } from "./Logo";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/studio", label: "Design your own" },
      { href: "/shop", label: "Signature bouquets" },
      { href: "/occasions", label: "Occasions" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/delivery", label: "Delivery & areas" },
      { href: "/track", label: "Track an order" },
      { href: "/care", label: "Flower care" },
    ],
  },
  {
    title: "Amra",
    links: [
      { href: "/about", label: "Our story" },
      { href: "/contact", label: "Contact" },
      { href: "/account", label: "Account" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface-raised">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Hand-tied bouquets, designed by you and delivered fresh across India.
            Every stem, shade and ribbon, exactly as you imagined.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold text-ink">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-ink-soft transition-colors hover:text-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-5 py-5 text-sm text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>&copy; {new Date().getFullYear()} Amra Flowers. Made in India.</p>
          <p className="flex gap-5">
            <Link href="/privacy" className="hover:text-ink-soft">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-ink-soft">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
