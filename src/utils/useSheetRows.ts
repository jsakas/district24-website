import { useEffect, useState } from 'react';
import { parseCsv, type CsvRow } from './csv';

// Fetches a published Google Sheet (CSV export) in the browser and maps it to
// rows. The fetch happens client-side on purpose so sheet edits show up on the
// site immediately, without a rebuild or redeploy.
export function useSheetRows<T>(url: string, transform: (rows: CsvRow[]) => T[]): T[] {
  const [rows, setRows] = useState<T[]>([]);
  useEffect(() => {
    let cancelled = false;
    fetch(url)
      .then(res => res.text())
      .then(text => { if (!cancelled) setRows(transform(parseCsv(text))); })
      .catch(() => { if (!cancelled) setRows([]); });
    return () => { cancelled = true; };
    // transform is defined inline by callers; only re-fetch when the URL changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  return rows;
}
