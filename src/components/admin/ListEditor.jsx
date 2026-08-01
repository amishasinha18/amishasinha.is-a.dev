import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { Checkbox, StringList, TextArea, TextField } from './fields.jsx';
import { getPath, setPath } from './paths.js';

// Renders one field of an item based on its schema `type`.
function Field({ field, value, onChange }) {
  const common = { label: field.label, value, onChange, placeholder: field.placeholder };
  switch (field.type) {
    case 'textarea':
      return <TextArea {...common} rows={field.rows ?? 3} />;
    case 'stringlist':
      return <StringList {...common} />;
    case 'bool':
      return <Checkbox label={field.label} value={value} onChange={onChange} />;
    default:
      return <TextField {...common} />;
  }
}

// Generic editor for an array of objects. `schema` is a list of
// { key, label, type } describing each editable field. `newItem` seeds "Add".
export default function ListEditor({ items, schema, onChange, newItem, titleKey, addLabel }) {
  const list = Array.isArray(items) ? items : [];

  const updateItem = (i, next) => onChange(list.map((it, idx) => (idx === i ? next : it)));
  const updateField = (i, key, val) => updateItem(i, setPath(list[i], key, val));
  const remove = (i) => onChange(list.filter((_, idx) => idx !== i));
  const add = () => onChange([...list, typeof newItem === 'function' ? newItem() : { ...newItem }]);
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const copy = [...list];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onChange(copy);
  };

  const ctrlBtn =
    'rounded-md p-1 text-muted transition hover:bg-primary/10 hover:text-primary disabled:opacity-30 disabled:hover:bg-transparent';

  return (
    <div className="space-y-4">
      {list.length === 0 && (
        <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted">
          Nothing here yet — add your first entry below.
        </p>
      )}

      {list.map((item, i) => (
        <div
          key={i}
          className="rounded-xl border border-border bg-surface p-4 shadow-sm ring-1 ring-black/[0.02] dark:ring-white/[0.03]"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-foreground">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[11px] font-bold text-primary">
                {i + 1}
              </span>
              <span className="truncate">
                {(titleKey && getPath(item, titleKey)) || `Item ${i + 1}`}
              </span>
            </span>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className={ctrlBtn}
                title="Move up"
              >
                <ChevronUp size={16} />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === list.length - 1}
                className={ctrlBtn}
                title="Move down"
              >
                <ChevronDown size={16} />
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                className="rounded-md p-1 text-muted transition hover:bg-red-500/10 hover:text-red-500"
                title="Remove"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {schema.map((field) => (
              <div key={field.key} className={field.full ? 'sm:col-span-2' : ''}>
                <Field
                  field={field}
                  value={getPath(item, field.key)}
                  onChange={(val) => updateField(i, field.key, val)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-fg shadow-sm transition hover:opacity-90"
      >
        <Plus size={16} /> {addLabel || 'Add new'}
      </button>
    </div>
  );
}
