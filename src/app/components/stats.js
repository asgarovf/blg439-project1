import { Table } from "antd";

export const Stats = ({ match }) => {
  const columns = match.statistics.headers.map((item) => {
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
    };
  });

  const awayDataSource = match.statistics.away.persons.map((item) => {
    return {
      ...item,
      ...item.statistics,
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
