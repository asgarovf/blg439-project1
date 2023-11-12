import { Table } from "antd";
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
    const statistics = {
      away: {
        entity: {
          assists: 0,
          blocks: 0,
          efficiency: 0,
          fieldGoalsAttempted: 0,
          fieldGoalsMade: 0,
          fieldGoalsPercentage: 0,
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
        },
        extra: {
          // Initialize extra stats
          rebounds: 0,
          reboundsDefensive: 0,
          reboundsOffensive: 0,
          turnovers: 0,
        },
        persons: [] // Array to store individual player statistics
      },
    };

    // Iterate through each event in the pbpData
    pbpData[1].events.forEach(event => {
      // Assuming the event data contributes to player statistics (omitting actual calculations for brevity)

      // For each player in the 'persons' array
      let player = match.statistics.away.persons.find(person => person.personId === event.personId);

      // Similar updates for other player-specific stats based on event data
      if (!player) {
        player = match.statistics.home.persons.find(person => person.personId === event.personId);
      }

      const playerStats = { ...player.statistics };

      if (event.desc.includes("Asist")) {
        playerStats.assists++;
      } else if (event.desc.includes("Blok")) {
        playerStats.blocks++;
      } else if (event.desc === "Kişisel Faul" || event.desc === "Hücum Faul") {
        playerStats.foulsDrawn++;
        playerStats.foulsTotal++;
      } else if (event.desc === "Alınan Faul") {
        playerStats.foulsTotal++;
      } else if (event.desc.includes("Top Çalma")) {
        playerStats.steals++;
      } else if (event.desc.includes("Top Kaybı")) {
        playerStats.turnovers++;
      } else if (event.desc.includes("2 Sayı")) {
        playerStats.pointsTwoAttempted++;
        playerStats.fieldGoalsAttempted++;
        if (event.success === true) {
          playerStats.pointsTwoMade++;
          playerStats.fieldGoalsMade++;
          playerStats.points += 2;
        }
        playerStats.pointsTwoPercentage = (playerStats.pointsTwoMade / playerStats.pointsTwoAttempted) * 100;
        playerStats.fieldGoalsPercentage = (playerStats.fieldGoalsMade / playerStats.fieldGoalsAttempted) * 100;
      } else if (event.desc.includes("3 Sayı")) {
        playerStats.pointsThreeAttempted++;
        playerStats.fieldGoalsAttempted++;
        if (event.success === true) {
          playerStats.pointsThreeMade++;
          playerStats.fieldGoalsMade++;
          playerStats.points += 3;
        }
        playerStats.pointsThreePercentage = (playerStats.pointsThreeMade / playerStats.pointsThreeAttempted) * 100;
        playerStats.fieldGoalsPercentage = (playerStats.fieldGoalsMade / playerStats.fieldGoalsAttempted) * 100;
      } else if (event.desc.includes("Serbest Atış")) {
        playerStats.freeThrowsAttempted++;
        if (event.success === true) {
          playerStats.freeThrowsMade++;
          playerStats.points++;
        }
        playerStats.freeThrowsPercentage = (playerStats.freeThrowsMade / playerStats.freeThrowsAttempted) * 100;
      } else if (event.desc.includes("Ribaund")) {
        playerStats.rebounds++;
        if (event.desc.includes("Savunma")) {
          playerStats.reboundsDefensive++;
        } else if (event.desc.includes("Hücum")) {
          playerStats.reboundsOffensive++;
        }
      }
      playerStats.efficiency = (playerStats.points * 1.0) + (playerStats.fieldGoalsMade * 0.4) + (playerStats.fieldGoalsAttempted * -0.7) + ((playerStats.freeThrowsAttempted - playerStats.freeThrowsMade) * -0.4) + (playerStats.reboundsOffensive * 0.7) + (playerStats.reboundsDefensive * 0.3) + (playerStats.steals * 1.0) + (playerStats.assists * 0.7) + (playerStats.blocks * 0.7) + (playerStats.foulsTotal * -0.4) + (playerStats.turnovers * -1.0);

      player = {
        ...player,
        statistics: {
          ...playerStats,
        },
      };

    });

    return statistics;
  }

  const transformedData = generateStatisticsFromPBP(pbpData);
  console.log(transformedData);

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
