import { IconLoader } from '@tabler/icons-react';
import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'EmergenSee',
  description: '',
};

export const experimental_ppr = true;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={`${manrope.variable} font-sans dark:antialiased`}>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </body>
    </html>
  );
}

function Loading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <IconLoader className="animate-spin" />
    </div>
  );
}
