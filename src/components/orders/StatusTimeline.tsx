import { Check } from "@phosphor-icons/react/dist/ssr";
import {
  STATUS_FLOW,
  STATUS_LABEL,
  type OrderStatus,
} from "@/lib/order-types";

export function StatusTimeline({ status }: { status: OrderStatus }) {
  if (status === "payment_failed") {
    return (
      <div className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
        Payment did not go through. Please try placing the order again.
      </div>
    );
  }

  const currentIndex = STATUS_FLOW.indexOf(status === "pending" ? "placed" : status);

  return (
    <ol className="relative ml-3 border-l border-line">
      {STATUS_FLOW.map((s, i) => {
        const done = i <= currentIndex;
        const active = i === currentIndex;
        return (
          <li key={s} className="mb-6 ml-6 last:mb-0">
            <span
              className={`absolute -left-[13px] flex h-6 w-6 items-center justify-center rounded-full ${
                done ? "bg-brand text-white" : "bg-surface-sunken text-ink-faint"
              }`}
            >
              {done ? (
                <Check size={13} weight="bold" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
              )}
            </span>
            <p
              className={`font-medium ${
                active ? "text-brand" : done ? "text-ink" : "text-ink-faint"
              }`}
            >
              {STATUS_LABEL[s]}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
