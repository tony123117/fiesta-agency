import { AdminInput, AdminTextarea } from '@/components/admin/AdminUI';
import { FieldGroup, ImageField, ListManager, uid } from './EditorHelpers';
import type { ServicesCardsContent } from '@/lib/types';

type CardItem = { id: string; title: string; description: string; image: string };

export function ServicesCardsEditor({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const data = content as unknown as ServicesCardsContent;
  const cards = data.cards || [];

  return (
    <div className="space-y-6">
      <FieldGroup title={`Service Cards (${cards.length})`}>
        <ListManager
          items={cards}
          onChange={(updated) => onChange({ ...data, cards: updated })}
          onAdd={() => onChange({ ...data, cards: [...cards, { id: uid(), title: '', description: '', image: '' }] })}
          label="Card"
          renderItem={(item: CardItem, i, update) => (
            <div className="space-y-3">
              <AdminInput label="Title" value={item.title} onChange={(e) => update({ title: e.target.value })} />
              <AdminTextarea label="Description" value={item.description} onChange={(e) => update({ description: e.target.value })} rows={2} />
              <ImageField label="Image" value={item.image} onChange={(v) => update({ image: v })} />
            </div>
          )}
        />
      </FieldGroup>
    </div>
  );
}
