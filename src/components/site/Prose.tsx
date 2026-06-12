export function Prose({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-[720px] px-5 py-14 sm:px-8">
      <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">
        {title}
      </h1>
      {intro && <p className="mt-3 text-lg text-ink-soft">{intro}</p>}
      <div className="mt-8 space-y-5 leading-relaxed text-ink-soft [&_h2]:mt-9 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-medium [&_h2]:text-ink [&_strong]:text-ink">
        {children}
      </div>
    </article>
  );
}
