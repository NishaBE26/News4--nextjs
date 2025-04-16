
import "./globals.css";
import Sidebar from "./components/Sidebar";
 

export const metadata = {
  title: "News4Tamil",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex">
        <Sidebar />
        <main className="flex-1 p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
