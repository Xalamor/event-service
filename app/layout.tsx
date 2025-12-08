import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "../lib/ReduxProvider";
import Header from "@/components/layout/Header";
import InitAuthState from "@/components/auth/InitAuthState";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Event Platform - Найдите свои мероприятия",
  description: "Платформа для поиска и организации мероприятий",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <StoreProvider>
          <InitAuthState />
          <Header />
          <main>{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
