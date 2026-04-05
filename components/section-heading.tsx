interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left"
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <header className={`max-w-3xl ${alignClass}`}>
      {eyebrow ? (
        <p className="mb-3 inline-flex rounded-full border border-goldBrand/40 bg-goldBrand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emeraldBrand">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-tight text-charcoalBrand md:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-relaxed text-charcoalBrand/80">{description}</p> : null}
    </header>
  );
}
