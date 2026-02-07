export const dynamic = 'force-dynamic';

import { requireAuth } from '@/app/lib/auth';
import ContabilidadClient from './ContabilidadClient';

export default async function ContabilidadPage() {
  await requireAuth('/admin/contabilidad');
  return <ContabilidadClient />;
}
