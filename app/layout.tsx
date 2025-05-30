import "./globals.css";
import AuthProvider from "./context/AuthProvider";
// import { Toaster } from "@/components/ui/toaster"
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <AuthProvider>
        <body>
          {children}
          <Toaster />
          </body>
      </AuthProvider>
    </html>
  );
}
