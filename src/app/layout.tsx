import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Traduction en Arabe - Aicha Salhi",
  description: "Services de traduction professionnelle et certifiée à Dijon",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <Providers>
          <Header />
          <main id="main-content" className="flex-grow pt-16 flex items-center justify-center dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-2xl mx-auto my-16 p-8 md:p-12 text-center bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700 mx-4">
              <div className="flex justify-center mb-6">
                <svg className="w-16 h-16 text-red-700 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Information Importante
              </h1>
              <div className="w-16 h-1 bg-red-700 dark:bg-red-400 mx-auto mb-8 rounded-full"></div>
              <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl mb-4 font-medium">
                Chères clientes, chers clients,
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 leading-relaxed">
                Je suis actuellement en période de congé. Les services de traduction et le traitement des commandes sont donc temporairement suspendus.
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed">
                Je serai de retour très prochainement pour prendre en charge vos nouvelles demandes avec le plus grand soin.
              </p>
              <div className="inline-block px-8 py-3 bg-red-700 dark:bg-red-600 text-white rounded-full font-medium shadow-md">
                Merci de votre compréhension
              </div>
            </div>
            {/* {children} */}
          </main>
          <CookieBanner />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
