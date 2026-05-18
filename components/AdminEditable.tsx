import { updateOntologyItem } from "@/app/admin/actions";

export function AdminEditable({
  model,
  id,
  field,
  value,
  multiline = false
}: {
  model: string;
  id: string;
  field: string;
  value: string | number | boolean | null;
  multiline?: boolean;
}) {
  return (
    <form action={updateOntologyItem} className="flex gap-2">
      <input type="hidden" name="model" value={model} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="field" value={field} />
      {multiline ? (
        <textarea name="value" defaultValue={String(value ?? "")} className="focus-ring min-h-20 w-full rounded-md border border-line px-2 py-1 text-sm" />
      ) : (
        <input name="value" defaultValue={String(value ?? "")} className="focus-ring w-full rounded-md border border-line px-2 py-1 text-sm" />
      )}
      <button className="focus-ring rounded-md border border-line bg-paper px-3 py-1 text-xs font-medium text-ink">Save</button>
    </form>
  );
}
