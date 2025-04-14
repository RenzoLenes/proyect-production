'use client';

import { useConfigStore } from '@/lib/store/configStore';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });



export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { colors, theme } = useConfigStore();

  // useEffect(() => {
  //   document.documentElement.style.setProperty('--primary', colors.primary);
  //   document.documentElement.style.setProperty('--accent', colors.accent);
  //   document.documentElement.style.setProperty('--background', colors.background);
  //   document.documentElement.style.setProperty('--foreground', colors.foreground);
  //   document.documentElement.className = theme;
  // }, [colors, theme]);

  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}