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
