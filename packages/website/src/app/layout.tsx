import localFont from 'next/font/local';

import '../theme/global.scss';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ua">
      <body className={mursGothic.className}>
        <Header userLogOn={false} />
        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}
