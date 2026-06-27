'use client';

import { STATUS_LABELS, STATUS_COLORS } from '@/lib/constants';
import type { TripStatus } from '@/types';

export function StatusBadge({ status }: { status: TripStatus }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-800'}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}
