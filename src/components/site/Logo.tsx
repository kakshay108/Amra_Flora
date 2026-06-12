import Link from "next/link";

/** Amra wordmark with a simple petal monogram. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 ${className ?? ""}`}
      aria-label="Amra Flowers home"
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="text-accent"
      >
        <path
          d="M16 3c2.6 3.2 2.6 7 0 10.2C13.4 10 13.4 6.2 16 3Z"
          fill="currentColor"
        />
        <path
          d="M16 13.2c3.7-1.6 7.2-.4 9.6 2.8-3.7 1.6-7.2.4-9.6-2.8Z"
          fill="currentColor"
          opacity="0.8"
        />
        <path
          d="M16 13.2c-3.7-1.6-7.2-.4-9.6 2.8 3.7 1.6 7.2.4 9.6-2.8Z"
          fill="currentColor"
          opacity="0.8"
        />
        <path
          d="M16 14c1.7 3.5.8 7.2-2.4 9.8C11.9 20.3 12.8 16.6 16 14Z"
          fill="currentColor"
          opacity="0.65"
        />
        <path
          d="M16 14c-1.7 3.5-.8 7.2 2.4 9.8C20.1 20.3 19.2 16.6 16 14Z"
          fill="currentColor"
          opacity="0.65"
        />
        <circle cx="16" cy="14.4" r="2.1" fill="#caa24e" />
      </svg>
      <span className="font-display text-[1.35rem] font-semibold leading-none tracking-tight text-ink">
        Amra
      </span>
    </Link>
  );
}
