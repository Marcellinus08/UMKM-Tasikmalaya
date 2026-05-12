import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "UMKM Tasikmalaya",
  description: "Peta sebaran UMKM di Tasikmalaya",
  icons: {
    icon: '/logo_website.png',
    shortcut: '/logo_website.png',
    apple: '/logo_website.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/icon?family=Material+Icons" 
        />
        <link 
          rel="stylesheet" 
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body suppressHydrationWarning className={`${poppins.className} min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark`}>
        <script
          id="theme-script"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function() {
              try {
                const theme = localStorage.getItem('theme') || 'light';
                document.documentElement.classList.toggle('dark', theme === 'dark');
              } catch (error) {
                console.warn('Theme init failed:', error);
              }
            })();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
