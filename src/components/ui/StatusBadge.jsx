// Availability badge with a live pulsing green dot. Shared by the hero and the
// contact section so a visitor sees availability wherever they land, from one
// source of truth for the styling.
export default function StatusBadge({ label, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-400 ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
      </span>
      {label}
    </span>
  );
}
