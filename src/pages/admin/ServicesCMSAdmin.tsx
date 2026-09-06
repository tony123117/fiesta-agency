import { useEffect, useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader, AdminButton, AdminLoading, AdminModal, EmptyState, Toast } from '@/components/admin/AdminUI';
import { ServiceFilters } from '@/components/admin/services/ServiceFilters';
import { ServiceListItem } from '@/components/admin/services/ServiceListItem';
import { ServiceEditor } from '@/components/admin/services/ServiceEditor';
import {
  getServices,
  deleteService,
  duplicateService,
  updateService,
  toggleServiceFeatured,
  reorderServices,
} from '@/lib/servicesService';
import type { Service } from '@/lib/types';

export function ServicesCMSAdmin() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [publishedFilter, setPublishedFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('sort_order_asc');

  // Editor
  const [showEditor, setShowEditor] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sortField, sortDir] = sortBy.split('_');
      const field = sortField === 'sort' ? 'sort_order' : sortField;
      const ascending = sortDir === 'asc';
      const data = await getServices(
        { search, published: publishedFilter, featured: featuredFilter },
        { field: field as 'sort_order' | 'created_at' | 'title', ascending }
      );
      setServices(data);
    } catch {
      setError('Unable to load services.');
    } finally {
      setLoading(false);
    }
  }, [search, publishedFilter, featuredFilter, sortBy]);

  useEffect(() => { loadServices(); }, [loadServices]);

  const handleDelete = async (id: string) => {
    const svc = services.find((s) => s.id === id);
    if (!confirm(`Delete "${svc?.title || 'this service'}"?\n\nThis will remove the service from the CMS.`)) return;
    try {
      await deleteService(id);
      setServices(services.filter((s) => s.id !== id));
      setToast('Service deleted');
      setTimeout(() => setToast(null), 3000);
    } catch {
      setToast('Delete failed');
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const dup = await duplicateService(id);
      setServices([...services, dup]);
      setToast('Service duplicated');
      setTimeout(() => setToast(null), 3000);
    } catch {
      setToast('Duplicate failed');
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleTogglePublished = async (id: string, published: boolean) => {
    try {
      const updated = await updateService(id, { published });
      setServices(services.map((s) => (s.id === id ? updated : s)));
      setToast(published ? 'Service published' : 'Service unpublished');
      setTimeout(() => setToast(null), 3000);
    } catch {
      setToast('Update failed');
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    try {
      const updated = await toggleServiceFeatured(id, featured);
      setServices(services.map((s) => (s.id === id ? updated : s)));
      setToast(featured ? 'Service featured' : 'Service unfeatured');
      setTimeout(() => setToast(null), 3000);
    } catch {
      setToast('Update failed');
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleMoveUp = async (id: string) => {
    const idx = services.findIndex((s) => s.id === id);
    if (idx <= 0) return;
    const newServices = [...services];
    [newServices[idx - 1], newServices[idx]] = [newServices[idx], newServices[idx - 1]];
    setServices(newServices);
    try {
      await reorderServices(newServices.map((s) => s.id));
    } catch {
      setToast('Reorder failed');
      setTimeout(() => setToast(null), 3000);
      loadServices();
    }
  };

  const handleMoveDown = async (id: string) => {
    const idx = services.findIndex((s) => s.id === id);
    if (idx < 0 || idx >= services.length - 1) return;
    const newServices = [...services];
    [newServices[idx], newServices[idx + 1]] = [newServices[idx + 1], newServices[idx]];
    setServices(newServices);
    try {
      await reorderServices(newServices.map((s) => s.id));
    } catch {
      setToast('Reorder failed');
      setTimeout(() => setToast(null), 3000);
      loadServices();
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setShowEditor(true);
  };

  const handleCreate = () => {
    setEditingService(null);
    setShowEditor(true);
  };

  const handleSaved = (saved: Service) => {
    if (editingService) {
      setServices(services.map((s) => (s.id === saved.id ? saved : s)));
    } else {
      setServices([...services, saved]);
    }
    setShowEditor(false);
    setEditingService(null);
    setToast(editingService ? 'Service saved' : 'Service created');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div>
      <PageHeader
        title="SERVICES"
        description="Manage the services displayed across the Fiesta Agency website."
        action={
          <AdminButton onClick={handleCreate}>
            <Plus size={14} /> Add Service
          </AdminButton>
        }
      />

      {loading ? (
        <AdminLoading text="Loading services..." />
      ) : error ? (
        <div className="py-16 text-center">
          <p className="text-[0.85rem] text-red-400/70 mb-3">{error}</p>
          <AdminButton variant="secondary" size="sm" onClick={loadServices}>Try Again</AdminButton>
        </div>
      ) : services.length === 0 && !search && publishedFilter === 'all' && featuredFilter === 'all' ? (
        <EmptyState
          title="No services yet"
          subtitle="Create your first service to get started."
          action={
            <AdminButton size="sm" onClick={handleCreate}>+ Add Service</AdminButton>
          }
        />
      ) : (
        <>
          <ServiceFilters
            search={search}
            onSearchChange={setSearch}
            publishedFilter={publishedFilter}
            onPublishedFilterChange={setPublishedFilter}
            featuredFilter={featuredFilter}
            onFeaturedFilterChange={setFeaturedFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {/* Column headers — desktop */}
          <div className="hidden md:flex items-center gap-4 px-4 pb-2 border-b border-white/[0.06] mb-1">
            <div className="w-8 shrink-0 text-center text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-white/20">#</div>
            <div className="w-12 shrink-0 text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-white/20">Image</div>
            <div className="flex-1 text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-white/20">Service</div>
            <div className="hidden sm:block w-32 shrink-0 text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-white/20">Status</div>
            <div className="hidden md:block w-20 shrink-0 text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-white/20">Visible</div>
            <div className="hidden md:block w-16 shrink-0 text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-white/20">Order</div>
            <div className="w-20 shrink-0 text-right text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-white/20">Actions</div>
          </div>

          {services.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-[0.85rem] text-white/30 mb-1">No services match your search.</p>
              <p className="text-[0.7rem] text-white/20">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div>
              {services.map((service, i) => (
                <ServiceListItem
                  key={service.id}
                  service={service}
                  index={i}
                  totalCount={services.length}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                  onTogglePublished={handleTogglePublished}
                  onToggleFeatured={handleToggleFeatured}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                />
              ))}
            </div>
          )}
        </>
      )}

      <AdminModal
        open={showEditor}
        onClose={() => { setShowEditor(false); setEditingService(null); }}
        title={editingService ? 'Edit Service' : 'New Service'}
        maxWidth="40rem"
      >
        <ServiceEditor
          service={editingService}
          onSaved={handleSaved}
          onClosed={() => { setShowEditor(false); setEditingService(null); }}
        />
      </AdminModal>

      {toast && <Toast message={toast} />}
    </div>
  );
}

export default ServicesCMSAdmin;

