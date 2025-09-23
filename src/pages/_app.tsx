import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Open_Sans } from "next/font/google";
import { useRouter } from "next/router";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import { UserProvider } from "../context/UserContext";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <main className={openSans.className}>
      <UserProvider>
        <>
          {router.pathname !== "/" && <Header isVisible={true} isAtTop={false} />} 
          <Component {...pageProps} />
          <Footer />
        </>
      </UserProvider>
    </main>
  );
}
