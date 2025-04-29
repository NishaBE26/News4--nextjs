import './globals.css';
import './Styles/Sidebar.css';
import SidebarWrapper from './components/SidebarWrapper';

export const metadata = {
  title: 'News4Tamil',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="layout">
          <SidebarWrapper />
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}   