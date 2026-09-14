// ── Layout Inspector (Right Panel) ──
// Phase 31.3 — Layout Editing
// Phase 31.6 — Responsive per-breakpoint editing
// Phase 31.12 — Layout Overview for null selection
//
// Displays controls for the selected layout element (container, row, or column).
// When selection is null, shows a section-level Layout Overview.
// Writes to the CURRENT viewport only via responsive callbacks.

import type { Section } from '@/lib/types';
import type {
  LayoutContent,
  LayoutContainer,
  LayoutRow,
  LayoutColumn,
} from '@/lib/layoutTypes';
import { isLayoutContent } from '@/lib/layoutTypes';
import type { LayoutSelection } from '@/hooks/useLayoutOperations';
import type { BlockResponsiveBreakpoint } from '@/lib/blockTypes';
import { Plus, Trash2, Monitor, Tablet, Smartphone } from 'lucide-react';

const VIEWPORT_OPTIONS: { value: BlockResponsiveBreakpoint; label: string; icon: typeof Monitor }[] = [
  { value: 'desktop', label: 'Desktop', icon: Monitor },
  { value: 'tablet', label: 'Tablet', icon: Tablet },
  { value: 'mobile', label: 'Mobile', icon: Smartphone },
];

// ── Types ──

interface LayoutInspectorProps {
  section: Section;
  selection: LayoutSelection | null;
  onClearSelection: () => void;
  onUpdateContainer: (containerId: string, patch: Record<string, unknown>) => void;
  onUpdateContainerResponsive: (containerId: string, bp: BlockResponsiveBreakpoint, patch: Record<string, unknown>) => void;
  onDeleteContainer: (containerId: string) => void;
  onUpdateRow: (containerId: string, rowId: string, patch: Record<string, unknown>) => void;
  onUpdateRowResponsive: (containerId: string, rowId: string, bp: BlockResponsiveBreakpoint, patch: Record<string, unknown>) => void;
  onDeleteRow: (containerId: string, rowId: string) => void;
  onAddRow: (containerId: string) => void;
  onUpdateColumn: (containerId: string, rowId: string, columnId: string, patch: Record<string, unknown>) => void;
  onUpdateColumnResponsive: (containerId: string, rowId: string, columnId: string, bp: BlockResponsiveBreakpoint, patch: Record<string, unknown>) => void;
  onDeleteColumn: (containerId: string, rowId: string, columnId: string) => void;
  onAddColumn: (containerId: string, rowId: string) => void;
  canDeleteColumn: (containerId: string, rowId: string, columnId: string) => boolean;
  onAddContainer: (sectionId: string) => void;
  viewport?: BlockResponsiveBreakpoint;
}

export function LayoutInspector({
  section,
  selection,
  onClearSelection,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _onUpdateContainer,
  onUpdateContainerResponsive,
  onDeleteContainer,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _onUpdateRow,
  onUpdateRowResponsive,
  onDeleteRow,
  onAddRow,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _onUpdateColumn,
  onUpdateColumnResponsive,
  onDeleteColumn,
  onAddColumn,
  canDeleteColumn,
  onAddContainer,
  viewport = 'desktop',
}: LayoutInspectorProps) {
  const content = section.content as Record<string, unknown> | null;
  if (!content || !isLayoutContent(content)) return null;

  const layout = content as unknown as LayoutContent;

  // If no specific element is selected, show Layout Overview
  if (!selection) {
    return (
      <LayoutOverview
        section={section}
        layout={layout}
        viewport={viewport}
        onAddContainer={() => onAddContainer(section.id)}
      />
    );
  }

  const container = layout.layout.containers.find((c) => c.id === selection.containerId);
  if (!container) return null;

  const row = selection.rowId ? container.rows.find((r) => r.id === selection.rowId) : null;
  const column = selection.columnId && row ? row.columns.find((col) => col.id === selection.columnId) : null;

  // Create per-viewport update wrappers that write to only the current viewport
  const updateContainerBp = (patch: Record<string, unknown>) => onUpdateContainerResponsive(container.id, viewport, patch);
  const updateRowBp = row ? (patch: Record<string, unknown>) => onUpdateRowResponsive(container.id, row.id, viewport, patch) : undefined;
  const updateColumnBp = column && row ? (patch: Record<string, unknown>) => onUpdateColumnResponsive(container.id, row.id, column.id, viewport, patch) : undefined;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-[0.5rem] font-semibold uppercase tracking-[0.18em] text-white/25 mb-0.5">
            {selection.level === 'column' ? 'COLUMN' : selection.level === 'row' ? 'ROW' : 'CONTAINER'}
          </p>
          <h2 className="font-serif font-medium text-sm tracking-tight text-ivory truncate">
            {selection.level === 'column'
              ? `Column ${column?.settings[viewport]?.width || 6}/12`
              : selection.level === 'row'
              ? 'Row'
              : 'Container'}
          </h2>
        </div>
        <button
          onClick={onClearSelection}
          className="text-[0.55rem] text-white/30 hover:text-white/50 transition-colors"
        >
          Back
        </button>
      </div>

      {/* Viewport Tabs */}
      <div className="px-3 py-2 border-b border-white/[0.06] flex gap-1">
        {VIEWPORT_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.value}
              className={`flex items-center gap-1 px-2 py-1 text-[0.6rem] font-medium rounded transition-all ${
                viewport === opt.value
                  ? 'bg-gold/15 text-gold border border-gold/30'
                  : 'text-white/30 border border-white/[0.06] hover:border-white/[0.12] hover:text-white/50'
              }`}
              title={opt.label}
            >
              <Icon size={10} strokeWidth={1.5} />
              <span className="hidden sm:inline">{opt.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
        {column && row ? (
          <ColumnInspector
            column={column}
            container={container}
            row={row}
            viewport={viewport}
            onUpdate={updateColumnBp}
            onDelete={() => onDeleteColumn(container.id, row.id, column.id)}
            canDelete={canDeleteColumn(container.id, row.id, column.id)}
            onAddColumn={() => onAddColumn(container.id, row.id)}
          />
        ) : row ? (
          <RowInspector
            row={row}
            container={container}
            viewport={viewport}
            onUpdate={updateRowBp!}
            onDelete={() => onDeleteRow(container.id, row.id)}
            onAddRow={() => onAddRow(container.id)}
          />
        ) : (
          <ContainerInspector
            container={container}
            viewport={viewport}
            onUpdate={updateContainerBp}
            onDelete={() => onDeleteContainer(container.id)}
            onAddRow={() => onAddRow(container.id)}
          />
        )}
      </div>
    </div>
  );
}

// ── Layout Overview (null selection) ──

function LayoutOverview({
  section,
  layout,
  viewport,
  onAddContainer,
}: {
  section: Section;
  layout: LayoutContent;
  viewport: BlockResponsiveBreakpoint;
  onAddContainer: () => void;
}) {
  const containerCount = layout.layout.containers.length;
  const rowCount = layout.layout.containers.reduce(
    (sum, c) => sum + c.rows.length,
    0
  );
  const colCount = layout.layout.containers.reduce(
    (sum, c) =>
      sum +
      c.rows.reduce(
        (rowSum, row) => rowSum + row.columns.length,
        0
      ),
    0
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/[0.06]">
        <p className="text-[0.5rem] font-semibold uppercase tracking-[0.18em] text-white/25 mb-0.5">
          LAYOUT
        </p>
        <h2 className="font-serif font-medium text-sm tracking-tight text-ivory">
          Section Layout
        </h2>
      </div>

      {/* Viewport Tabs */}
      <div className="px-3 py-2 border-b border-white/[0.06] flex gap-1">
        {VIEWPORT_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.value}
              className={`flex items-center gap-1 px-2 py-1 text-[0.6rem] font-medium rounded transition-all ${
                viewport === opt.value
                  ? 'bg-gold/15 text-gold border border-gold/30'
                  : 'text-white/30 border border-white/[0.06] hover:border-white/[0.12] hover:text-white/50'
              }`}
              title={opt.label}
            >
              <Icon size={10} strokeWidth={1.5} />
              <span className="hidden sm:inline">{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Summary */}
        <div className="text-[0.65rem] text-white/40">
          {containerCount} container{containerCount !== 1 ? 's' : ''},{' '}
          {rowCount} row{rowCount !== 1 ? 's' : ''},{' '}
          {colCount} column{colCount !== 1 ? 's' : ''}
        </div>

        {/* Container list */}
        {layout.layout.containers.map((container, i) => (
          <div
            key={container.id}
            className="p-3 rounded border border-white/[0.06] bg-white/[0.02]"
          >
            <div className="text-[0.6rem] font-medium text-white/50">
              Container {i + 1}
            </div>
            <div className="text-[0.55rem] text-white/30 mt-1">
              {container.rows.length} row{container.rows.length !== 1 ? 's' : ''}
            </div>
          </div>
        ))}

        <ActionBtn onClick={onAddContainer}>
          <Plus size={10} strokeWidth={1.5} /> Add Container
        </ActionBtn>

        <p className="text-[0.55rem] text-white/20 pt-4">
          Click a container in the canvas to edit its settings.
        </p>
      </div>
    </div>
  );
}

// ── Container Inspector ──

function ContainerInspector({
  container,
  viewport,
  onUpdate,
  onDelete,
  onAddRow,
}: {
  container: LayoutContainer;
  viewport: BlockResponsiveBreakpoint;
  onUpdate: (patch: Record<string, unknown>) => void;
  onDelete: () => void;
  onAddRow: () => void;
}) {
  const settings = container.settings[viewport];

  return (
    <div className="p-4 space-y-5">
      <SectionLabel text="CONTAINER" />

      <FieldGroup label="Max Width">
        <ToggleGroup
          value={settings.maxWidth || 'lg'}
          options={[
            { value: 'none', label: 'None' },
            { value: 'sm', label: 'SM' },
            { value: 'md', label: 'MD' },
            { value: 'lg', label: 'LG' },
            { value: 'xl', label: 'XL' },
            { value: 'full', label: 'Full' },
          ]}
          onChange={(v) => onUpdate({ maxWidth: v })}
        />
      </FieldGroup>

      <FieldGroup label="Padding">
        <ToggleGroup
          value={settings.padding || 'md'}
          options={[
            { value: 'none', label: 'None' },
            { value: 'xs', label: 'XS' },
            { value: 'sm', label: 'SM' },
            { value: 'md', label: 'MD' },
            { value: 'lg', label: 'LG' },
            { value: 'xl', label: 'XL' },
          ]}
          onChange={(v) => onUpdate({ padding: v })}
        />
      </FieldGroup>

      <FieldGroup label="Gap">
        <ToggleGroup
          value={settings.gap || 'md'}
          options={[
            { value: 'none', label: 'None' },
            { value: 'xs', label: 'XS' },
            { value: 'sm', label: 'SM' },
            { value: 'md', label: 'MD' },
            { value: 'lg', label: 'LG' },
            { value: 'xl', label: 'XL' },
          ]}
          onChange={(v) => onUpdate({ gap: v })}
        />
      </FieldGroup>

      <FieldGroup label="Visibility">
        <ToggleGroup
          value={settings.visible !== false ? 'visible' : 'hidden'}
          options={[
            { value: 'visible', label: 'Visible' },
            { value: 'hidden', label: 'Hidden' },
          ]}
          onChange={(v) => onUpdate({ visible: v === 'visible' })}
        />
      </FieldGroup>

      <div className="pt-3 border-t border-white/[0.06] flex gap-2">
        <ActionBtn onClick={onAddRow}>
          <Plus size={10} strokeWidth={1.5} /> Add Row
        </ActionBtn>
        <ActionBtn onClick={onDelete} danger>
          <Trash2 size={10} strokeWidth={1.5} /> Delete
        </ActionBtn>
      </div>
    </div>
  );
}

// ── Row Inspector ──

function RowInspector({
  row,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _container,
  viewport,
  onUpdate,
  onDelete,
  onAddRow,
}: {
  row: LayoutRow;
  _container: LayoutContainer;
  viewport: BlockResponsiveBreakpoint;
  onUpdate: (patch: Record<string, unknown>) => void;
  onDelete: () => void;
  onAddRow: () => void;
}) {
  const settings = row.settings[viewport];
  const totalWidth = row.columns.reduce((sum, col) => sum + (col.settings[viewport]?.width || 6), 0);

  return (
    <div className="p-4 space-y-5">
      <SectionLabel text="ROW" />

      <FieldGroup label="Layout Mode">
        <ToggleGroup
          value={settings.columns || 'grid'}
          options={[
            { value: 'grid', label: 'Grid' },
            { value: 'stack', label: 'Stack' },
          ]}
          onChange={(v) => onUpdate({ columns: v })}
        />
      </FieldGroup>

      <FieldGroup label="Columns">
        <div className="text-[0.65rem] text-white/40">
          {row.columns.length} column{row.columns.length !== 1 ? 's' : ''} — {totalWidth}/12 width
        </div>
      </FieldGroup>

      <FieldGroup label="Gap">
        <ToggleGroup
          value={settings.gap || 'md'}
          options={[
            { value: 'none', label: 'None' },
            { value: 'xs', label: 'XS' },
            { value: 'sm', label: 'SM' },
            { value: 'md', label: 'MD' },
            { value: 'lg', label: 'LG' },
            { value: 'xl', label: 'XL' },
          ]}
          onChange={(v) => onUpdate({ gap: v })}
        />
      </FieldGroup>

      <FieldGroup label="Alignment">
        <ToggleGroup
          value={settings.alignment || 'start'}
          options={[
            { value: 'start', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'end', label: 'Right' },
          ]}
          onChange={(v) => onUpdate({ alignment: v })}
        />
      </FieldGroup>

      <FieldGroup label="Vertical">
        <ToggleGroup
          value={settings.verticalAlignment || 'start'}
          options={[
            { value: 'start', label: 'Top' },
            { value: 'center', label: 'Center' },
            { value: 'end', label: 'Bottom' },
            { value: 'stretch', label: 'Stretch' },
          ]}
          onChange={(v) => onUpdate({ verticalAlignment: v })}
        />
      </FieldGroup>

      <FieldGroup label="Visibility">
        <ToggleGroup
          value={settings.visible !== false ? 'visible' : 'hidden'}
          options={[
            { value: 'visible', label: 'Visible' },
            { value: 'hidden', label: 'Hidden' },
          ]}
          onChange={(v) => onUpdate({ visible: v === 'visible' })}
        />
      </FieldGroup>

      <div className="pt-3 border-t border-white/[0.06] flex gap-2">
        <ActionBtn onClick={onAddRow}>
          <Plus size={10} strokeWidth={1.5} /> Add Row
        </ActionBtn>
        <ActionBtn onClick={onDelete} danger>
          <Trash2 size={10} strokeWidth={1.5} /> Delete
        </ActionBtn>
      </div>
    </div>
  );
}

// ── Column Inspector ──

function ColumnInspector({
  column,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _container,
  row,
  viewport,
  onUpdate,
  onDelete,
  canDelete,
  onAddColumn,
}: {
  column: LayoutColumn;
  _container: LayoutContainer;
  row: LayoutRow;
  viewport: BlockResponsiveBreakpoint;
  onUpdate: (patch: Record<string, unknown>) => void;
  onDelete: () => void;
  canDelete: boolean;
  onAddColumn: () => void;
}) {
  const settings = column.settings[viewport];
  const width = settings.width || 6;
  const pct = Math.round((width / 12) * 100);

  const totalWidth = row.columns.reduce((sum, col) => sum + (col.settings[viewport]?.width || 6), 0);
  const canAdd = totalWidth + 1 <= 12;

  return (
    <div className="p-4 space-y-5">
      <SectionLabel text="COLUMN" />

      <FieldGroup label="Width">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[0.75rem] font-mono text-gold font-medium">{width}/12</span>
          <span className="text-[0.6rem] text-white/30">= {pct}%</span>
        </div>
        <ToggleGroup
          value={String(width)}
          options={[
            { value: '1', label: '1' },
            { value: '2', label: '2' },
            { value: '3', label: '3' },
            { value: '4', label: '4' },
            { value: '5', label: '5' },
            { value: '6', label: '6' },
            { value: '7', label: '7' },
            { value: '8', label: '8' },
            { value: '9', label: '9' },
            { value: '10', label: '10' },
            { value: '11', label: '11' },
            { value: '12', label: '12' },
          ]}
          onChange={(v) => onUpdate({ width: Number(v) })}
        />
      </FieldGroup>

      <FieldGroup label="Visibility">
        <ToggleGroup
          value={settings.visible !== false ? 'visible' : 'hidden'}
          options={[
            { value: 'visible', label: 'Visible' },
            { value: 'hidden', label: 'Hidden' },
          ]}
          onChange={(v) => onUpdate({ visible: v === 'visible' })}
        />
      </FieldGroup>

      <FieldGroup label="Alignment">
        <ToggleGroup
          value={settings.verticalAlignment || 'start'}
          options={[
            { value: 'start', label: 'Top' },
            { value: 'center', label: 'Center' },
            { value: 'end', label: 'Bottom' },
            { value: 'stretch', label: 'Stretch' },
          ]}
          onChange={(v) => onUpdate({ verticalAlignment: v })}
        />
      </FieldGroup>

      <FieldGroup label="Padding">
        <ToggleGroup
          value={settings.padding || 'none'}
          options={[
            { value: 'none', label: 'None' },
            { value: 'xs', label: 'XS' },
            { value: 'sm', label: 'SM' },
            { value: 'md', label: 'MD' },
            { value: 'lg', label: 'LG' },
          ]}
          onChange={(v) => onUpdate({ padding: v })}
        />
      </FieldGroup>

      <div className="pt-3 border-t border-white/[0.06] flex gap-2">
        {canAdd && (
          <ActionBtn onClick={onAddColumn}>
            <Plus size={10} strokeWidth={1.5} /> Add Column
          </ActionBtn>
        )}
        <ActionBtn onClick={onDelete} danger disabled={!canDelete} title={!canDelete ? 'Move blocks out first' : undefined}>
          <Trash2 size={10} strokeWidth={1.5} /> Delete
        </ActionBtn>
      </div>
    </div>
  );
}

// ── Shared UI Primitives ──

function SectionLabel({ text }: { text: string }) {
  return (
    <p className="text-[0.5rem] font-semibold uppercase tracking-[0.18em] text-white/25">
      {text}
    </p>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[0.55rem] font-medium text-white/40 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function ToggleGroup({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-2 py-1 text-[0.6rem] font-medium rounded transition-all ${
            value === opt.value
              ? 'bg-gold/15 text-gold border border-gold/30'
              : 'text-white/30 border border-white/[0.08] hover:border-white/[0.15] hover:text-white/50'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ActionBtn({
  children,
  onClick,
  danger,
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex items-center gap-1 px-2 py-1.5 text-[0.6rem] font-medium rounded transition-colors ${
        danger
          ? disabled
            ? 'text-white/15 border border-white/[0.06] cursor-not-allowed'
            : 'text-red-400/70 border border-red-400/20 hover:bg-red-500/10'
          : disabled
          ? 'text-white/15 border border-white/[0.06] cursor-not-allowed'
          : 'text-white/50 border border-white/[0.08] hover:border-white/[0.15] hover:text-white/80'
      }`}
    >
      {children}
    </button>
  );
}
