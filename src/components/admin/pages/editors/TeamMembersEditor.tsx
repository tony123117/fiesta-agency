import { AdminInput, AdminTextarea } from '@/components/admin/AdminUI';
import { FieldGroup, ImageField, ListManager, uid } from './EditorHelpers';
import type { TeamMembersContent, TeamMember } from '@/lib/types';

export function TeamMembersEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as TeamMembersContent;
  const members = data.members || [];

  return (
    <div className="space-y-6">
      <AdminInput label="Heading" value={data.heading || ''} onChange={(e) => onChange({ ...data, heading: e.target.value })} />

      <FieldGroup title={`Members (${members.length})`}>
        <ListManager
          items={members}
          onChange={(updated) => onChange({ ...data, members: updated })}
          onAdd={() => onChange({ ...data, members: [...members, { id: uid(), name: '', role: '', image: '', bio: '' }] })}
          label="Member"
          renderItem={(member: TeamMember, i, update) => (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <AdminInput label="Name" value={member.name} onChange={(e) => update({ name: e.target.value })} />
                <AdminInput label="Role" value={member.role} onChange={(e) => update({ role: e.target.value })} />
              </div>
              <ImageField label="Photo" value={member.image || ''} onChange={(v) => update({ image: v })} />
              <AdminTextarea label="Bio" value={member.bio || ''} onChange={(e) => update({ bio: e.target.value })} rows={2} />
            </div>
          )}
        />
      </FieldGroup>
    </div>
  );
}
