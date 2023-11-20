"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";
import { setMatches } from "./store/matchSlicer";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <Provider store={store}>
      <html lang="tr">
        <head>
          <title>Basketball Statistics</title>
        </head>
        <body className={inter.className}>
          <MatchSetter />
          {children}
        </body>
      </html>
    </Provider>
  );
}

const MatchSetter = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const cachedMatches = localStorage.getItem("matches");
    if (cachedMatches == null) {
      return;
    }

    try {
      dispatch(setMatches(JSON.parse(cachedMatches)));
    } catch (err) {
      console.log(err);
    }
  }, []);
  return null;
};
