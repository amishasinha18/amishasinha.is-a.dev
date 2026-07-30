// `eyebrow` is optional — when supplied it renders a small wide-tracked
// kicker above the title, matching the About page's header hierarchy.
export default function SectionHeading({ title, subtitle, eyebrow }) {
  return (
    <div className="mb-12 text-center">
      {eyebrow && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted sm:text-xs">
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-4xl font-extrabold tracking-tight text-primary sm:text-5xl ${
          eyebrow ? 'mt-3.5' : ''
        }`}
      >
        {title}
      </h2>
      <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-accent" />
      {subtitle && (
        <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-muted sm:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}
