import { useEffect, useRef, useState } from 'react';
import { NAV_PAGES, NAV_GROUPS } from '../data';
import type { NavItem } from '../types';

// Treat "/calendar" and "/calendar/" as the same page.
const normalize = (path: string): string => (path.endsWith('/') ? path : path + '/');

interface DropdownProps {
  label: string;
  items: NavItem[];
  currentPath: string;
}

function Dropdown({ label, items, currentPath }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = items.some(i => i.href === currentPath);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="dropdown" ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}>
      <button className={`dropdown__btn${isActive ? ' active' : ''}`} onClick={() => setOpen(!open)}>
        {label} <span className="dropdown__caret">▾</span>
      </button>
      {open && (
        <div className="dropdown__menu">
          {items.map(item => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}
              className={`dropdown__item${currentPath === item.href ? ' active' : ''}`}>
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export function Navbar({ currentPath: rawPath }: { currentPath: string }) {
  const [open, setOpen] = useState(false);
  const currentPath = normalize(rawPath);
  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <a href="/" className="navbar__brand">
          <span className="navbar__brand-name">AA District 24</span>
          <span className="navbar__brand-sub">Ozaukee County · Area 75</span>
        </a>
        <div className="navbar__links">
          <a href="/" className={`nav-link${currentPath === '/' ? ' active' : ''}`}>Home</a>
          <Dropdown label="Pages"  items={NAV_PAGES.slice(1)} currentPath={currentPath} />
          <Dropdown label="Groups" items={NAV_GROUPS}          currentPath={currentPath} />
        </div>
        <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
          <span /><span /><span />
        </button>
      </div>
      {open && (
        <div className="mobile-menu">
          {NAV_PAGES.map(item => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}
              className={`mobile-link${currentPath === item.href ? ' active' : ''}`}>
              {item.label}
            </a>
          ))}
          <div className="mobile-section">Groups</div>
          {NAV_GROUPS.map(item => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}
              className={`mobile-link mobile-sub${currentPath === item.href ? ' active' : ''}`}>
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
