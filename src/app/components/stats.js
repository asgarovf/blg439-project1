import { Table } from "antd";
import { players } from "../data/players";

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
];

export const Stats = ({ match }) => {
  const columns = headers.map((item) => {
    return {
      title: item.name,
      dataIndex: item.key === "name" ? "personName" : item.key,
      key: item.key,
    };
  });

  const homeDataSource = match.statistics.home.persons.map((item) => {
    return {
      ...item,
      ...item.statistics,
      key: item.personId,
    };
  });

  const awayDataSource = match.statistics.away.persons.map((item) => {
    return {
      ...item,
      ...item.statistics,
      key: item.personId,
    };
  });

  ////////////////////////////////////////////////////////////////////////////
  const pbpData = match.pbp;

  function generateStatisticsFromPBP(pbpData) {
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

    pbpData[1].events.forEach(event => {

      let player = players.find(person => person.personId === event.personId);

      if (!player) {
        return;
      }

      if (!player.statistics) {
        player.statistics = { ...initialPlayerStatistics };
      }

      if (event.desc.includes("Asist")) {
        player.statistics.assists++;
      } else if (event.desc.includes("Blok")) {
        player.statistics.blocks++;
      } else if (event.desc === "Kişisel Faul" || event.desc === "Hücum Faul") {
        player.statistics.foulsDrawn++;
        player.statistics.foulsTotal++;
      } else if (event.desc === "Alınan Faul") {
        player.statistics.foulsTotal++;
      } else if (event.desc.includes("Top Çalma")) {
        player.statistics.steals++;
      } else if (event.desc.includes("Top Kaybı")) {
        player.statistics.turnovers++;
      } else if (event.desc.includes("2 Sayı")) {
        player.statistics.pointsTwoAttempted++;
        player.statistics.fieldGoalsAttempted++;
        if (event.success === true) {
          player.statistics.pointsTwoMade++;
          player.statistics.fieldGoalsMade++;
          player.statistics.points += 2;
        }
        player.statistics.pointsTwoPercentage = (player.statistics.pointsTwoMade / player.statistics.pointsTwoAttempted) * 100;
        player.statistics.fieldGoalsPercentage = (player.statistics.fieldGoalsMade / player.statistics.fieldGoalsAttempted) * 100;
      } else if (event.desc.includes("3 Sayı")) {
        player.statistics.pointsThreeAttempted++;
        player.statistics.fieldGoalsAttempted++;
        if (event.success === true) {
          player.statistics.pointsThreeMade++;
          player.statistics.fieldGoalsMade++;
          player.statistics.points += 3;
        }
        player.statistics.pointsThreePercentage = (player.statistics.pointsThreeMade / player.statistics.pointsThreeAttempted) * 100;
        player.statistics.fieldGoalsPercentage = (player.statistics.fieldGoalsMade / player.statistics.fieldGoalsAttempted) * 100;
      } else if (event.desc.includes("Serbest Atış")) {
        player.statistics.freeThrowsAttempted++;
        if (event.success === true) {
          player.statistics.freeThrowsMade++;
          player.statistics.points++;
        }
        player.statistics.freeThrowsPercentage = (player.statistics.freeThrowsMade / player.statistics.freeThrowsAttempted) * 100;
      } else if (event.desc.includes("Ribaund")) {
        player.statistics.rebounds++;
        if (event.desc.includes("Savunma")) {
          player.statistics.reboundsDefensive++;
        } else if (event.desc.includes("Hücum")) {
          player.statistics.reboundsOffensive++;
        }
      }
      player.statistics.efficiency = (player.statistics.points * 1.0) + (player.statistics.fieldGoalsMade * 0.4) +
        (player.statistics.fieldGoalsAttempted * -0.7) + ((player.statistics.freeThrowsAttempted - player.statistics.freeThrowsMade) * -0.4)
        + (player.statistics.reboundsOffensive * 0.7) + (player.statistics.reboundsDefensive * 0.3) + (player.statistics.steals * 1.0)
        + (player.statistics.assists * 0.7) + (player.statistics.blocks * 0.7) + (player.statistics.foulsTotal * -0.4) + (player.statistics.turnovers * -1.0);

    });

    return player.statistics;
  }

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
