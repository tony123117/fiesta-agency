import { Contact } from './Contact';
import { useDocumentMeta } from '@/lib/useDocumentMeta';

export function PlanYourEvent() {
  useDocumentMeta({
    title: 'Plan Your Event | Fiesta Agency Rwanda',
    description: 'Start planning your unforgettable event with Fiesta Agency. Fill out our booking inquiry form.',
    canonicalPath: '/plan-your-event',
  });

  return <Contact />;
}
export default PlanYourEvent;

