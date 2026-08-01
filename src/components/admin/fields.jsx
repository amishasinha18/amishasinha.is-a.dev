import { Plus, X } from 'lucide-react';

// Small, reusable form inputs for the admin editors, styled with the site's
// aubergine design tokens (primary/surface/border/foreground/muted).

const inputBase =
  'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/25';

const labelText = 'mb-1.5 block text-xs font-semibold text-muted';

export function TextField({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      {label && <span className={labelText}>{label}</span>}
      <input
        type="text"
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputBase}
      />
    </label>
  );
}

export function TextArea({ label, value, onChange, rows = 3, placeholder }) {
  return (
    <label className="block">
      {label && <span className={labelText}>{label}</span>}
      <textarea
        rows={rows}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputBase} resize-y`}
      />
    </label>
  );
}

export function Checkbox({ label, value, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
      <input
        type="checkbox"
        checked={!!value}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
      />
      {label}
    </label>
  );
}

// Editor for an array of plain strings (e.g. tech tags, feature bullets).
export function StringList({ label, value, onChange, placeholder }) {
  const items = Array.isArray(value) ? value : [];
  const set = (i, v) => onChange(items.map((it, idx) => (idx === i ? v : it)));
  const add = () => onChange([...items, '']);
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div>
      {label && <span className={labelText}>{label}</span>}
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={it}
              placeholder={placeholder}
              onChange={(e) => set(i, e.target.value)}
              className={inputBase}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="shrink-0 rounded-md p-1.5 text-muted transition hover:bg-red-500/10 hover:text-red-500"
              title="Remove"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted transition hover:border-primary/50 hover:text-primary"
        >
          <Plus size={14} /> Add
        </button>
      </div>
    </div>
  );
}
