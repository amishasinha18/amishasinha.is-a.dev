import { Plus, X } from 'lucide-react';

// Small, reusable form inputs for the admin editors. Deliberately plain and
// utilitarian — this is a control panel, not part of the public site.

const inputBase =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500';

export function TextField({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      {label && <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>}
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
      {label && <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>}
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
    <label className="flex items-center gap-2 text-sm text-slate-700">
      <input
        type="checkbox"
        checked={!!value}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
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
      {label && <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>}
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
              className="shrink-0 rounded-md p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
              title="Remove"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:border-indigo-400 hover:text-indigo-600"
        >
          <Plus size={14} /> Add
        </button>
      </div>
    </div>
  );
}
