import "./globals.css";
import Sidebar from "./components/Sidebar";
import "./Styles/Sidebar.css"; 

export const metadata = {
  title: "News4Tamil",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="layout">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <main className="content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
