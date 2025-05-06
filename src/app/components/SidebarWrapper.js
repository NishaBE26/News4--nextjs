'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function SidebarWrapper({ children }) {
  const pathname = usePathname();

  // List of routes that should NOT show the sidebar
  const hideSidebarRoutes = ['/login', '/register'];

  const shouldHideSidebar = hideSidebarRoutes.includes(pathname);

  if (shouldHideSidebar) {
    return <>{children}</>; // Render children without sidebar
  }

  return (
    <div className="layout-container">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}
 