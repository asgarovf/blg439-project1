"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "./store";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <Provider store={store}>
      <html lang="tr">
        <head>
          <title>Basketball Statistics</title>
        </head>
        <body className={inter.className}>{children}</body>
      </html>
    </Provider>
  );
}
