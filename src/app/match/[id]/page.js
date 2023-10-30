"use client";
import { Stats } from "@/app/components/stats";
import { Timeline } from "@/app/components/timeline";
import { matches } from "@/app/data";
import { Button, Tabs } from "antd";
import { useParams } from "next/navigation";

export default function Match() {
  const { id } = useParams();

  const matchData = matches[id];
  const competitor1 = matchData.fixture.competitors[0];
  const competitor2 = matchData.fixture.competitors[1];
  const periodData = matchData.periodData;
  const periodLabels = periodData.periodLabels;
  const teamScoreKeys = Object.keys(periodData.teamScores);
  const teamScoresArray = teamScoreKeys.map((key) => {
    return periodData.teamScores[key];
  });

  const items = [
    {
      key: "1",
      label: "İstatistikler",
      children: <Stats match={matchData} />,
    },
    {
      key: "2",
      label: "Atış Grafiği",
      children: "Content of Tab Pane 2",
    },
    {
      key: "3",
      label: "Oyun akışı",
      children: <Timeline match={matchData} />,
    },
  ];

  return (
    <div className="pt-10 flex flex-col items-center max-w-[1280px] mx-auto">
      <div className="flex justify-between w-full">
        <div className="flex items-center space-x-3">
          <div className="text-3xl font-medium">{competitor1.name}</div>
          <img src={competitor1.logo} className="w-[64px]" alt="" />
        </div>
        <div className="flex flex-col justify-center items-center">
          <Button href="/">Maçlar</Button>
          <div className="flex items-center space-x-10 mt-4">
            <div className="text-4xl font-medium">{competitor1.score}</div>
            <div className="text-4xl font-medium">-</div>
            <div className="text-4xl font-medium">{competitor2.score}</div>
          </div>
          <div className="flex flex-col mt-2">
            {teamScoresArray[0].map((item, index) => (
              <p className="row text-xs" key={index}>
                {periodLabels[item.periodId]} - {item.score} -{" "}
                {teamScoresArray[1][index].score}
              </p>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <img src={competitor2.logo} className="w-[64px]" alt="" />
          <div className="text-3xl font-medium">{competitor2.name}</div>
        </div>
      </div>
      <div className="w-full">
        <Tabs defaultActiveKey="1" items={items} />
      </div>
    </div>
  );
}
