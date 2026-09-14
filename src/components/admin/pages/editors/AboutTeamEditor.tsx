import { AdminInput } from '@/components/admin/AdminUI';
import { FieldGroup, ImageField, ListManager, uid } from './EditorHelpers';
import type { AboutTeamContent } from '@/lib/types';

type MemberItem = { id: string; name: string; role: string; image: string };

export function AboutTeamEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as AboutTeamContent;
  const members = data.members || [];

  return (
    <div className="space-y-6">
      <AdminInput label="Eyebrow" value={data.eyebrow || ''} onChange={(e) => onChange({ ...data, eyebrow: e.target.value })} />
      <AdminInput label="Heading" value={data.heading || ''} onChange={(e) => onChange({ ...data, heading: e.target.value })} />

      <FieldGroup title={`Team Members (${members.length})`}>
        <ListManager
          items={members}
          onChange={(updated) => onChange({ ...data, members: updated })}
          onAdd={() => onChange({ ...data, members: [...members, { id: uid(), name: '', role: '', image: '' }] })}
          label="Member"
          renderItem={(item: MemberItem, i, update) => (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <AdminInput label="Name" value={item.name} onChange={(e) => update({ name: e.target.value })} />
                <AdminInput label="Role" value={item.role} onChange={(e) => update({ role: e.target.value })} />
              </div>
              <ImageField label="Photo" value={item.image} onChange={(v) => update({ image: v })} />
            </div>
          )}
        />
      </FieldGroup>
    </div>
  );
}
