import localFont from 'next/font/local';

import '../theme/global.scss';

const mursGothic = localFont({
  src: '../../public/MursGothic-WideDark.ttf',
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
      <body className={mursGothic.className}>{children}</body>
    </html>
  );
}
