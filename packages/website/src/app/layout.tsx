import { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';

import '../theme/global.scss';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { backgroundColor } from '@/theme';

// Cannot move options to a helper - it all must be a constant.
const mursGothic = localFont({
  src: [
    {
      path: '../../public/MursGothic-KeyRegular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/MursGothic-WideMedium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/MursGothic-WideDark.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  preload: true,
  variable: '--font-murs-gothic',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: backgroundColor,
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  title: { template: `%s | СР ФПМ`, default: 'СР ФПМ' },
  description: 'Опис студради',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ua">
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="СР ФПМ" />
      </head>
      <body className={mursGothic.className}>
        <Header userLogOn={false} />
        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}
