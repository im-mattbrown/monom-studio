import { Inter } from 'next/font/google';
import './globals.css';
import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/CustomCursor';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'Monom Studio',
  description: 'The Human Agency',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <CustomCursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
