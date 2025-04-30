import './globals.css';
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
          <main className="main-content">
            {children}
          </main>
      </body>
    </html>
  );
}   