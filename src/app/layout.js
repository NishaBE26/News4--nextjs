import './globals.css';
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
        <div className='page-wrapper'>
          <SidebarWrapper>
            {children}
          </SidebarWrapper>
        </div>
      </body>
    </html>
  );
}
