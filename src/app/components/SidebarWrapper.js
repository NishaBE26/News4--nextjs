'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function SidebarWrapper() {
  const pathname = usePathname();
  if (pathname === '/login') return null;
  return <Sidebar />;
}
