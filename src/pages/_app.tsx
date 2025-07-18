import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Open_Sans } from 'next/font/google';

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '700'], // Add more if needed: ['300', '400', '600', '700', '800']
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={openSans.className}>
      <Component {...pageProps} />
    </main>
  );
}
