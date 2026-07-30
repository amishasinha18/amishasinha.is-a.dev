// Reusable button/link. Renders an <a> when `href` is given, otherwise a <button>.
// Minimalist: clean sans-serif with a subtle accent border/hover.
const variants = {
  primary: 'border-accent bg-accent text-accent-fg hover:opacity-90',
  purple: 'border-primary bg-primary text-primary-fg hover:opacity-90',
  outline:
    'border-border bg-transparent text-foreground hover:border-primary hover:text-primary',
};

export default function Button({
  children,
  variant = 'primary',
  href,
  className = '',
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-md border px-5 py-2.5 text-sm font-medium transition ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
