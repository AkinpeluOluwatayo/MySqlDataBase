import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/tanstackprovider/QueryProvider";
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SecurePath | Agricultural Security",
  description: "Advanced monitoring and tactical security for agricultural assets.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#04120a',
                color: '#27AE60',
                border: '1px solid rgba(39,174,96,0.2)',
                fontWeight: 'bold',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}