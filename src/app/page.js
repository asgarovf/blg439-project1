"use client";
import { useRouter } from "next/navigation";
import { Button, Input, Modal, Select, Typography } from "antd";
import { useEffect, useState } from "react";
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
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  // const [newTeamData, setNewTeamData] = useState({
  //   entityId: uuidv4(),
  //   name: null,
  //   logo: "https://www.espn.com/i/teamlogos/soccer/500/default-team-logo-500.png?h=100&w=100",
  // });

  // const [newPlayerData, setNewPlayerData] = useState({
  //   isCustom: true,
  //   active: false,
  //   bib: null,
  //   entityId: null,
  //   personId: uuidv4(),
  //   personImage:
  //     "https://static.vecteezy.com/system/resources/previews/004/511/281/original/default-avatar-photo-placeholder-profile-picture-vector.jpg",
  //   personName: null,
  //   starter: null,
  //   statistics: {},
  // });

  const [team1, setTeam1] = useState(null);
  const [team2, setTeam2] = useState(null);
  const [venue, setVenue] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.setItem("players", JSON.stringify(players));
    localStorage.setItem("teams", JSON.stringify(teams));
  }, []);

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

  const buildNewPlayer = () => {
    const localPlayers = JSON.parse(localStorage.getItem("players"));
    const updatedPlayers = [...localPlayers, newPlayerData];
    localStorage.setItem("players", JSON.stringify(updatedPlayers));

    setIsPlayerModalOpen(false);
  };

  const buildNewTeam = () => {
    const localTeams = JSON.parse(localStorage.getItem("teams"));
    console.log("Local Teams", localTeams);
    console.log("New Team Data", newTeamData);
    const updatedTeams = [...localTeams, newTeamData];
    console.log("Updated Teams", updatedTeams);
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
    setIsTeamModalOpen(false);
  };

  return (
    <main className="flex w-full h-screen overflow-auto flex-col items-center justify-between p-24 pt-10">
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

      <div className="flex justify-between w-full max-w-[90%]">
        <h1 className="text-4xl font-bold mb-8">Maçlar</h1>
        <Button
          type="primary"
          className="mb-2"
          onClick={() => setIsModalOpen(true)}
        >
          Yeni Maç
        </Button>
      </div>

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
            className="bg-white hover:cursor-pointer hover:bg-gray-50 border-2 border-gray-300 p-4 mb-4 rounded-lg shadow-md w-full max-w-[90%]"
          >
            <p className="text-center text-lg font-semibold mt-2">
              {fixture.venue}
            </p>
            <div className="flex items-center justify-center my-2">
              <div className="grid grid-cols-3 items-center justify-center my-2">
                <div className="flex justify-center items-center col-span-1 pl-10">
                  <div className="mr-4">
                    <img
                      src={competitor1.logo}
                      alt="Team Logo"
                      className="w-16 h-16 rounded-full"
                    />
                  </div>
                  <p className="ml-4 text-md font-semibold text-center">
                    {competitor1.name}
                  </p>
                </div>

                <div className="flex justify-center items-center col-span-1">
                  <p className="mx-2 font-bold text-2xl">{competitor1Score}</p>
                  <p className="mx-2 font-bold text-2xl">-</p>
                  <p className="mx-2 font-bold text-2xl">{competitor2Score}</p>
                </div>

                <div className="flex justify-center items-center col-span-1 pr-10">
                  <p className="text-md font-semibold ml-4 text-center">
                    {competitor2.name}
                  </p>
                  <div className="ml-4">
                    <img
                      src={competitor2.logo}
                      alt="Team Logo"
                      className="w-16 h-16 rounded-full shrink-0"
                    />
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-lg font-semibold">{formattedDate}</p>
          </div>
        );
      })}
    </main>
  );
}
