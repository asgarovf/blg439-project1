"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";
import { setClocks, setMatches } from "./store/matchSlicer";
import { Sidebar } from "./components/sidebar";
import { getPopulatedTeams, teams } from "./data/teams";
import { players } from "./data/players";

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
          <ClockIntervalHandler />
          <div className="flex flex-col">
            <Sidebar />
            {children}
          </div>
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
      const allMatches = JSON.parse(cachedMatches);
      const teams = getPopulatedTeams();
      const allValidMatches = allMatches.filter((match) => {
        if (
          teams.find(
            (team) =>
              team.entityId === match.fixture.competitors[0].entityId ||
              team.entityId === match.fixture.competitors[1].entityId
          ) == null
        ) {
          return false;
        } else {
          return true;
        }
      });
      dispatch(setMatches(allValidMatches));
    } catch (err) {
      console.log(err);
    }
  }, []);
  return null;
};

const ClockIntervalHandler = () => {
  const dispatch = useDispatch();
  const clocks = useSelector((state) => state.matchSlicer.clocks);

  useEffect(() => {
    if (localStorage.getItem("players") == null) {
      localStorage.setItem("players", JSON.stringify(players));
    }
    if (localStorage.getItem("teams") == null) {
      localStorage.setItem("teams", JSON.stringify(teams));
    }
  }, []);

  useEffect(() => {
    const cachedClocks = localStorage.getItem("clocks");
    if (cachedClocks == null) {
      return;
    }

    const cachedClocksJSON = JSON.parse(cachedClocks);
    const clockKeys = Object.keys(cachedClocksJSON);
    const newClocks = {};

    clockKeys.forEach((key) => {
      newClocks[key] = {
        time: cachedClocksJSON[key].time,
        running: false,
      };
    });
    try {
      dispatch(setClocks(newClocks));
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const clockKeys = Object.keys(clocks);
      const newClocks = {};
      clockKeys.forEach((key) => {
        if (clocks[key].running && clocks[key].time > 0) {
          newClocks[key] = {
            time: clocks[key].time - 1,
            running: true,
          };
        } else {
          newClocks[key] = {
            time: clocks[key].time,
            running: false,
          };
        }
      });
      dispatch(setClocks(newClocks));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [clocks, dispatch]);

  return null;
};
