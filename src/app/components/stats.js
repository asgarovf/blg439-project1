import { Table } from "antd";
import { players } from "../data/players";
import { useEffect, useMemo } from "react";
import { getTeamScoresFromPBP } from "../utils/getTeamScoresFromPBP";

export const headers = [
  {
    key: "bib",
    name: "#",
  },
  {
    key: "name",
    name: "Name",
  },
  {
    code: "İki Sayı Başarılı",
    key: "pointsTwoMade",
    name: "2SB",
  },
  {
    code: "İki Sayı Deneme",
    key: "pointsTwoAttempted",
    name: "2SD",
  },
  {
    code: "İki Sayı Yüzdesi",
    key: "pointsTwoPercentage",
    name: "2S%",
  },
  {
    code: "Üç Sayı Başarılı",
    key: "pointsThreeMade",
    name: "3SB",
  },
  {
    code: "Üç Sayılık Deneme",
    key: "pointsThreeAttempted",
    name: "3SD",
  },
  {
    code: "Üç Sayı Yüzdesi",
    key: "pointsThreePercentage",
    name: "3S%",
  },
  {
    code: "Başarılı Serbest Atış",
    key: "freeThrowsMade",
    name: "BSA",
  },
  {
    code: "Serbest Atış Denemesi",
    key: "freeThrowsAttempted",
    name: "SA",
  },
  {
    code: "Serbest Atış Yüzdesi",
    key: "freeThrowsPercentage",
    name: "SA%",
  },
  {
    code: "Hücum Ribaundu",
    key: "reboundsOffensive",
    name: "HR",
  },
  {
    code: "Savunma Ribaundu",
    key: "reboundsDefensive",
    name: "SR",
  },
  {
    code: "Top Çalma",
    key: "steals",
    name: "TÇ",
  },
  {
    code: "Blok",
    key: "blocks",
    name: "BL",
  },
  {
    code: "Faul",
    key: "foulsTotal",
    name: "FA",
  },
  {
    code: "Points",
    key: "points",
    name: "PT",
  },
];

const isEmpty = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

export const Stats = ({ match }) => {
  const columns = headers.map((item) => {
    return {
      title: item.name,
      dataIndex: item.key === "name" ? "personName" : item.key,
      key: item.key,
    };
  });

  function generateStatisticsFromPBP(pbpData, players) {
    const initialPlayerStatistics = {
      assists: 0,
      blocks: 0,
      efficiency: 0,
      fieldGoalsAttempted: 0,
      fieldGoalsMade: 0,
      foulsDrawn: 0,
      foulsTotal: 0,
      freeThrowsAttempted: 0,
      freeThrowsMade: 0,
      freeThrowsPercentage: 0,
      minutes: "PT0M",
      plusMinus: null,
      points: 0,
      pointsThreeAttempted: 0,
      pointsThreeMade: 0,
      pointsThreePercentage: 0,
      pointsTwoAttempted: 0,
      pointsTwoMade: 0,
      pointsTwoPercentage: 0,
      rebounds: 0,
      reboundsDefensive: 0,
      reboundsOffensive: 0,
      steals: 0,
      turnovers: 0,
    };

    const modifiedPlayers = players.map((player) => {
      return {
        ...player,
        statistics: { ...initialPlayerStatistics },
      };
    });

    let allEvents = pbpData[1].events;
    if (pbpData[2]?.events) {
      allEvents = allEvents.concat(pbpData[2].events);
    }
    if (pbpData[3]?.events) {
      allEvents = allEvents.concat(pbpData[3].events);
    }
    if (pbpData[4]?.events) {
      allEvents = allEvents.concat(pbpData[4].events);
    }

    allEvents.forEach((event) => {
      let index = -1;
      for (let i = 0; i < modifiedPlayers.length; i++) {
        if (modifiedPlayers[i].personId === event.personId) {
          index = i;
          break;
        }
      }

      if (index === -1) {
        return;
      }

      const player = { ...modifiedPlayers[index] };

      if (event.desc.includes("Asist")) {
        player.statistics = {
          ...player.statistics,
          assists: player.statistics.assists + 1,
        };
      } else if (event.desc.includes("Blok")) {
        player.statistics = {
          ...player.statistics,
          blocks: player.statistics.blocks + 1,
        };
      } else if (event.desc === "Kişisel Faul" || event.desc === "Hücum Faul") {
        player.statistics = {
          ...player.statistics,
          foulsDrawn: player.statistics.foulsDrawn + 1,
          foulsTotal: player.statistics.foulsTotal + 1,
        };
      } else if (event.desc === "Alınan Faul") {
        player.statistics = {
          ...player.statistics,
          foulsTotal: player.statistics.foulsTotal + 1,
        };
      } else if (event.desc.includes("Top Çalma")) {
        player.statistics = {
          ...player.statistics,
          steals: player.statistics.steals + 1,
        };
      } else if (event.desc.includes("Top Kaybı")) {
        player.statistics = {
          ...player.statistics,
          turnovers: player.statistics.turnovers + 1,
        };
      } else if (
        event.desc.includes("İki Sayı") ||
        event.desc.includes("2 Sayı")
      ) {
        const newPointsTwoAttempted = player.statistics.pointsTwoAttempted + 1;
        const newPointsTwoMade = event.success
          ? player.statistics.pointsTwoMade + 1
          : player.statistics.pointsTwoMade;

        const pointsTwoPercentage =
          newPointsTwoAttempted !== 0
            ? ((newPointsTwoMade / newPointsTwoAttempted) * 100).toFixed(2)
            : 0;

        const newFieldGoalsAttempted = player.statistics.fieldGoalsAttempted + 1;
        const newFieldGoalsMade = event.success
          ? player.statistics.fieldGoalsMade + 1
          : player.statistics.fieldGoalsMade;

        const fieldGoalsPercentage =
          newFieldGoalsAttempted !== 0
            ? ((newFieldGoalsMade / newFieldGoalsAttempted) * 100).toFixed(2)
            : 0;

        player.statistics = {
          ...player.statistics,
          pointsTwoAttempted: newPointsTwoAttempted,
          fieldGoalsAttempted: newFieldGoalsAttempted,
          pointsTwoMade: newPointsTwoMade,
          fieldGoalsMade: newFieldGoalsMade,
          points: event.success ? player.statistics.points + 2 : player.statistics.points,
          pointsTwoPercentage: pointsTwoPercentage,
          fieldGoalsPercentage: fieldGoalsPercentage,
        };
      } else if (
        event.desc.includes("Üç Sayı") ||
        event.desc.includes("3 Sayı")
      ) {
        const newPointsThreeAttempted = player.statistics.pointsThreeAttempted + 1;
        const newPointsThreeMade = event.success
          ? player.statistics.pointsThreeMade + 1
          : player.statistics.pointsThreeMade;

        const newFieldGoalsAttempted = player.statistics.fieldGoalsAttempted + 1;
        const newFieldGoalsMade = event.success
          ? player.statistics.fieldGoalsMade + 1
          : player.statistics.fieldGoalsMade;

        const fieldGoalsPercentage =
          newFieldGoalsAttempted !== 0
            ? ((newFieldGoalsMade / newFieldGoalsAttempted) * 100).toFixed(2)
            : 0;

        const pointsThreePercentage =
          newPointsThreeAttempted !== 0
            ? ((newPointsThreeMade / newPointsThreeAttempted) * 100).toFixed(2)
            : 0;

        player.statistics = {
          ...player.statistics,
          pointsThreeAttempted: newPointsThreeAttempted,
          fieldGoalsAttempted: newFieldGoalsAttempted,
          pointsThreeMade: newPointsThreeMade,
          fieldGoalsMade: newFieldGoalsMade,
          points: event.success ? player.statistics.points + 3 : player.statistics.points,
          pointsThreePercentage: pointsThreePercentage,
          fieldGoalsPercentage: fieldGoalsPercentage,
        };

      } else if (event.desc.includes("Serbest Atış")) {
        const newFreeThrowsMade = event.success
          ? player.statistics.freeThrowsMade + 1
          : player.statistics.freeThrowsMade;
        const newFreeThrowsAttempted =
          player.statistics.freeThrowsAttempted + 1;
        const newFieldGoalsAttempted =
          player.statistics.fieldGoalsAttempted + 1;
        const newFieldGoalsMade = event.success
          ? player.statistics.fieldGoalsMade + 1
          : player.statistics.fieldGoalsMade;

        const freeThrowsPercentage =
          newFreeThrowsAttempted !== 0
            ? ((newFreeThrowsMade / newFreeThrowsAttempted) * 100).toFixed(2)
            : 0;

        const fieldGoalsPercentage =
          newFieldGoalsAttempted !== 0
            ? ((newFieldGoalsMade / newFieldGoalsAttempted) * 100).toFixed(2)
            : 0;

        player.statistics = {
          ...player.statistics,
          freeThrowsAttempted: newFreeThrowsAttempted,
          freeThrowsMade: newFreeThrowsMade,
          points: event.success
            ? player.statistics.points + 1
            : player.statistics.points,
          freeThrowsPercentage: freeThrowsPercentage,
          fieldGoalsPercentage: fieldGoalsPercentage,
        };
      } else if (event.desc.includes("Ribaund")) {
        player.statistics = {
          ...player.statistics,
          rebounds: player.statistics.rebounds + 1,
        };
        if (event.desc.includes("Savunma")) {
          player.statistics = {
            ...player.statistics,
            reboundsDefensive: player.statistics.reboundsDefensive + 1,
          };
        } else if (event.desc.includes("Hücum")) {
          player.statistics = {
            ...player.statistics,
            reboundsOffensive: player.statistics.reboundsOffensive + 1,
          };
        }
      }

      modifiedPlayers[index] = {
        ...modifiedPlayers[index],
        statistics: player.statistics,
      };
    });

    return modifiedPlayers;
  }

  const homeDataSource = useMemo(() => {
    const source = generateStatisticsFromPBP(
      match.pbp,
      match.statistics.home.persons
    );

    return source.map((item) => {
      return { ...item, ...item.statistics, key: item.personId };
    });
  }, [match]);

  const awayDataSource = useMemo(() => {
    const source = generateStatisticsFromPBP(
      match.pbp,
      match.statistics.away.persons
    );

    return source.map((item) => {
      return { ...item, ...item.statistics, key: item.personId };
    });
  }, [match]);

  return (
    <div className="w-full overflow-auto">
      <div className="mt-4 text-2xl font-medium">Ev Sahibi</div>
      <Table
        className="mt-4"
        pagination={false}
        columns={columns}
        dataSource={homeDataSource}
      />

      <div className="mt-10 text-2xl font-medium">Deplasman</div>
      <Table
        className="mt-4"
        pagination={false}
        columns={columns}
        dataSource={awayDataSource}
      />
    </div>
  );
};
