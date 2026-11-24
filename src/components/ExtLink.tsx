import type { ReactNode } from 'react';

// Used from both .astro pages (rendered to static HTML, no JS) and React islands.
export function ExtLink({ href, children }: { href: string; children?: ReactNode }) {
  return <a className="inline-link" href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
}
