import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { TickerSearch } from '@/components/dashboard/search/ticker-search';

export const metadata = { title: `Stocks | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <TickerSearch />;
}
