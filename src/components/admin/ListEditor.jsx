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
export default function ListEditor({ items, schema, onChange, newItem, titleKey }) {
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

  return (
    <div className="space-y-4">
      {list.map((item, i) => (
        <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">
              {(titleKey && getPath(item, titleKey)) || `Item ${i + 1}`}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="rounded p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 disabled:opacity-30"
                title="Move up"
              >
                <ChevronUp size={16} />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === list.length - 1}
                className="rounded p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 disabled:opacity-30"
                title="Move down"
              >
                <ChevronDown size={16} />
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                className="rounded p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
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
        className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        <Plus size={16} /> Add new
      </button>
    </div>
  );
}
