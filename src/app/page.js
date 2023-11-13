"use client";
import { useRouter } from "next/navigation";
import { matches } from "./data";
import { Button, Input, Modal, Select, Typography } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { addNewMatch, buildMatch } from "./store/matchSlicer";
import { players } from "./data/players";
import { teams } from "./data/teams";
import { getTeamScoresFromPBP } from "./utils/getTeamScoresFromPBP";

export default function Home() {
  const matchList = useSelector((state) => state.matchSlicer.matches);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [team1, setTeam1] = useState(null);
  const [team2, setTeam2] = useState(null);
  const [venue, setVenue] = useState("");
  const dispatch = useDispatch();

  const buildInitialMatchData = () => {
    const home = teams.find((item) => {
      return item.entityId == team1;
    });
    const away = teams.find((item) => item.entityId == team2);

    const homePersons = players.filter((item) => {
      return item.entityId === home.entityId;
    });

    const awayPersons = players.filter((item) => {
      return item.entityId === away.entityId;
    });

    const matchData = {
      isCustom: true,
      fixture: {
        competitors: [home, away],
        venue,
        fixtureId: uuidv4(),
        startTimeLocal: new Date().toISOString(),
      },
      seasonId: uuidv4(),
      periodData: {
        periodLabels: {
          1: "Ç1",
          2: "Ç2",
          3: "Ç3",
          4: "Ç4",
          11: "UZ1",
          12: "UZ2",
          13: "UZ3",
          14: "UZ4",
          15: "UZ5",
          16: "UZ6",
        },
        teamScores: {
          [home.entityId]: [
            {
              periodId: 1,
              score: 0,
            },
            {
              periodId: 2,
              score: 0,
            },
            {
              periodId: 3,
              score: 0,
            },
            {
              periodId: 4,
              score: 0,
            },
          ],
          [away.entityId]: [
            {
              periodId: 1,
              score: 0,
            },
            {
              periodId: 2,
              score: 0,
            },
            {
              periodId: 3,
              score: 0,
            },
            {
              periodId: 4,
              score: 0,
            },
          ],
        },
      },
      statistics: {
        headers: [],
        entitiesLabels: [],
        boxScoreLabels: {},
        home: {
          persons: homePersons,
        },
        away: {
          persons: awayPersons,
        },
      },
      shotChart: {
        competitors: {},
        persons: {},
        shots: [],
      },
      pbp: {
        1: {
          ended: true,
          events: [],
        },
        2: {
          ended: true,
          events: [],
        },
        3: {
          ended: true,
          events: [],
        },
        4: {
          ended: true,
          events: [],
        },
      },
    };
    return matchData;
  };

  const getTeamOptions = teams.map((team) => {
    return { label: team.name, value: team.entityId };
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 pt-10">
      <Modal
        okButtonProps={{
          disabled: team1 == null || team2 == null || team1 == team2,
        }}
        onOk={() => {
          const matchData = buildInitialMatchData();
          dispatch(buildMatch(matchData));
          dispatch(addNewMatch(matchData));
          setIsModalOpen(false);
        }}
        okText="Continue"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
      >
        <Typography.Title level={2}>Yeni Maç Oluştur</Typography.Title>
        <Select
          size="large"
          value={team1?.entityId}
          placeholder="1. Takım Seçiniz"
          className="w-full mt-4"
          options={getTeamOptions}
          onChange={(e) => {
            setTeam1(e);
          }}
          optionLabelProp="label"
        />
        <Select
          size="large"
          value={team2?.entityId}
          placeholder="2. Takım Seçiniz"
          className="mt-2 w-full"
          options={getTeamOptions}
          onChange={(e) => {
            setTeam2(e);
          }}
          optionLabelProp="label"
        />
        <Input
          size="large"
          className="mt-2"
          placeholder="Lokasyon"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
        />
      </Modal>
      <Button className="mb-2" onClick={() => setIsModalOpen(true)}>
        Yeni Maç
      </Button>
      <h1 className="text-4xl font-bold mb-8">Maçlar</h1>
      {matchList.map((match, index) => {
        const fixture = match.fixture;
        const date = new Date(fixture.startTimeLocal);

        const formattedDate = date.toLocaleDateString("tr-TR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const teamScoresFromPBP = getTeamScoresFromPBP(match.pbp);

        const competitor1 = fixture.competitors[0];
        const competitor2 = fixture.competitors[1];

        const competitor1Score =
          teamScoresFromPBP[competitor1.entityId] ?? competitor1?.score;
        const competitor2Score =
          teamScoresFromPBP[competitor2.entityId] ?? competitor2?.score;

        return (
          <div
            onClick={() => router.push(`/match/${index}`)}
            key={index}
            className="bg-white hover:cursor-pointer hover:bg-gray-50 border-2 border-gray-300 p-4 mb-4 rounded-lg shadow-md"
            style={{ width: "1200px" }}
          >
            <p className="text-center text-lg font-semibold mt-2">
              {fixture.venue}
            </p>
            <div className="flex items-center justify-center my-2">
              <div className="flex items-center justify-center my-2">
                <div className="mr-4">
                  <img
                    src={competitor1.logo}
                    alt="Team Logo"
                    className="w-24 h-24 rounded-full"
                  />
                </div>
                <p className="ml-4 text-xl font-semibold">{competitor1.name}</p>
                <p className="mx-2 font-bold text-2xl">{competitor1Score}</p>
                <p className="mx-2 font-bold text-2xl">-</p>
                <p className="mx-2 font-bold text-2xl">{competitor2Score}</p>
                <p className="text-xl font-semibold ml-4">{competitor2.name}</p>
                <div className="ml-4">
                  <img
                    src={competitor2.logo}
                    alt="Team Logo"
                    className="w-24 h-24 rounded-full"
                  />
                </div>
              </div>
            </div>
            <p className="text-center text-lg font-semibold mt-4">
              {formattedDate}
            </p>
          </div>
        );
      })}
    </main>
  );
}
