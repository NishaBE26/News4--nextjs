'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '../components/Sidebar';

export default function SidebarWrapper({ children }) {
  const pathname = usePathname();

  const hideSidebarRoutes = ['/', '/login', '/register', "/posts/Home"];
  const shouldHideSidebar = hideSidebarRoutes.includes(pathname);

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
