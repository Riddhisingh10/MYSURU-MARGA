import type { Metadata, Viewport } from 'next';
import './globals.css';
import 'leaflet/dist/leaflet.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Mysuru Marga — Smart City Bus Journey Planner & Real-Time Tracking',
  description:
    'Plan city bus journeys, discover nearest boarding stops, check timetables, and track buses on an interactive map in Mysuru, Karnataka.',
  keywords: [
    'Mysuru Bus',
    'Mysore City Bus Stand',
    'Chamundi Hill Bus',
    'Mysuru Marga',
    'Bus Tracking',
    'Journey Planner',
    'KSRTC City Bus',
  ],
  authors: [{ name: 'Mysuru Marga Mobility Team' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F7F1E7] text-[#282321] selection:bg-[#702C3B] selection:text-white">
        {children}
      </body>
    </html>
  );
}
