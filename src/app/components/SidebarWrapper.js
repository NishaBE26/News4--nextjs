'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function SidebarWrapper({ children }) {
  const pathname = usePathname();

  
const hideSidebarRoutes = ['/login', '/register'];
const shouldHideSidebar = hideSidebarRoutes.some(route => pathname.startsWith(route));

  if (shouldHideSidebar) {
    return <>{children}</>; 
  }

  return (
    <div className="layout-container">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}
 