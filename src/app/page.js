import Image from "next/image";
import { matches } from "./data";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {matches.map((item) => {
        return (
          <div className="bg-gray border-black border-2">
            {item.fixture.competitionName}
            <img src={item.fixture.competitors[0].logo} className="w-24 h-24" />
          </div>
        );
      })}
    </main>
  );
}
