import Image from "next/image";
import { matches } from "./data";

export default function Home() {
  const fixtures = matches.data.team.fixtures.items;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">Maçlar</h1>
      {fixtures.map((fixture, index) => {
        const date = new Date(fixture.startTimeLocal);

        const formattedDate = date.toLocaleDateString("tr-TR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const competitor1 = fixture.competitors[0];
        const competitor2 = fixture.competitors[1];

        return (
          <div
            key={index}
            className="bg-white border-2 border-gray-300 p-4 mb-4 rounded-lg shadow-md"
            style={{ width: "1200px" }}
          >
            <p className="text-center text-lg font-semibold mt-2">{fixture.venue}</p>
            <div className="flex items-center justify-center my-2">
              <div className="flex items-center justify-center my-2">
                <div className="mr-4">
                  <img src={competitor1.logo} alt="Team Logo" className="w-24 h-24 rounded-full" />
                </div>
                <p className="ml-4 text-xl font-semibold">{competitor1.name}</p>
                <p className="mx-2 font-bold text-2xl">{competitor1.score}</p>
                <p className="mx-2 font-bold text-2xl">-</p>
                <p className="mx-2 font-bold text-2xl">{competitor2.score}</p>
                <p className="text-xl font-semibold ml-4">{competitor2.name}</p>
                <div className="ml-4">
                  <img src={competitor2.logo} alt="Team Logo" className="w-24 h-24 rounded-full" />
                </div>
              </div>
            </div>
            <p className="text-center text-lg font-semibold mt-4">{formattedDate}</p>
          </div>
        );
      })}
    </main>
  );
}
