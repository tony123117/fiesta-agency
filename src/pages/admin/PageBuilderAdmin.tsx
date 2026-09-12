import { PageBuilder } from '@/components/admin/pages';
import { AdminErrorBoundary } from '@/components/admin/AdminUI';

export function PageBuilderAdmin() {
  return (
    <AdminErrorBoundary
      fallbackTitle="Page Builder Error"
      fallbackMessage="The page builder encountered an error. This may be due to a data issue or a component crash."
    >
      <PageBuilder />
    </AdminErrorBoundary>
  );
}

export default PageBuilderAdmin;
