import { List, Tabs } from "antd";

export const Timeline = ({ match }) => {
  const dataSourceQuarters = Object.keys(match.pbp);
  const dataSourceEvents = [];

  dataSourceQuarters.forEach((key) => {
    const value = match.pbp[key];
    const events = value.events;
    dataSourceEvents.push(...events);
  });

  const tabs = dataSourceQuarters.map((item) => {
    return {
      key: item,
      label: `Q${item}`,
      children: <ListView match={match} events={match.pbp[item].events} />,
    };
  });
  tabs.push({
    key: "all",
    label: "Tümü",
    children: <ListView match={match} events={dataSourceEvents} />,
  });

  return <Tabs defaultActiveKey="1" items={tabs} />;
};

const ListView = ({ match, events }) => {
  let competitorsById = {};
  match.fixture.competitors.forEach((item, index) => {
    competitorsById[item.entityId] = { ...item, index };
  });
  const allPersons = match.statistics.home.persons.concat(
    match.statistics.away.persons
  );

  return (
    <List
      size="large"
      bordered
      dataSource={events}
      renderItem={(item) => {
        const competitor = competitorsById[item.entityId];
        const logo = competitor?.logo;
        const index = competitor?.index;

        const person = allPersons.find((person) => {
          return person.personId === item.personId;
        });

        const homeEntity = match.fixture.competitors[0]?.entityId;
        const awayEntity = match.fixture.competitors[1]?.entityId;
        const homeScore = item?.scores[homeEntity];
        const awayScore = item?.scores[awayEntity];

        return (
          <List.Item>
            <div className="w-full flex items-center justify-between">
              <div className={`${index === 0 ? "" : "opacity-0"}`}>
                <p className="font-medium text-lg mb-2">{item.desc}</p>
                <div className="flex items-center">
                  <img
                    className="w-[32px] h-[32px] rounded-full mr-2"
                    src={logo}
                    alt=""
                  />
                  <p>{person?.personName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <p className="text-2xl">{homeScore}</p>
                <p>Kalan süre: {item.clock.slice(2)}</p>
                <p className="text-2xl">{awayScore}</p>
              </div>
              <div
                className={`${
                  index === 1 ? "flex flex-col items-end" : "opacity-0"
                }`}
              >
                <p className="font-medium text-lg mb-2">{item.desc}</p>
                <div className="flex items-center">
                  <img
                    className="w-[32px] h-[32px] rounded-full mr-2"
                    src={logo}
                    alt=""
                  />
                  <p>{person?.personName}</p>
                </div>
              </div>
            </div>
          </List.Item>
        );
      }}
    />
  );
};
