'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '../components/Sidebar';

export default function SidebarWrapper({ children }) {
  const pathname = usePathname();


  const hideSidebarRoutes = ['/', '/Mainpost', '/login','/posts/author', '/register', '/posts/Home'];

  // Check if the current route starts with `/category/` (e.g., /category/India)
  const isCategoryPage = pathname.startsWith('/category/');

  const shouldHideSidebar = hideSidebarRoutes.includes(pathname) || isCategoryPage;

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
