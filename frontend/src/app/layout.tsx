import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import Providers from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Pizza Store',
    template: '%s | Pizza Store',
  },
  description: 'Доставка горячей и вкусной пиццы',
  icons: {
    icon: '/icon.svg',
  },
};

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="mx-auto w-full max-w-content flex-1 px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
