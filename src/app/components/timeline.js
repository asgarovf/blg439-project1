import { List, Tabs } from "antd";
import { players } from "../data/players";

export const Timeline = ({ match }) => {
  const dataSourceQuarters = Object.keys(match.pbp);
  const dataSourceEvents = [];

  dataSourceQuarters.forEach((key) => {
    const value = match.pbp[key];
    const events = value.events;
    dataSourceEvents.push(...events);
  });

  const getSortedEvents = (events) => {
    const _events = [...events];
    return _events.sort((a, b) => {
      if (a.clock < b.clock) {
        return 1;
      } else {
        return -1;
      }
    });
  };

  const tabs = dataSourceQuarters.map((item) => {
    return {
      key: item,
      label: `Q${item}`,
      children: (
        <ListView
          match={match}
          events={getSortedEvents(match.pbp[item].events)}
        />
      ),
    };
  });
  tabs.push({
    key: "all",
    label: "Tümü",
    children: (
      <ListView match={match} events={getSortedEvents(dataSourceEvents)} />
    ),
  });

  return <Tabs defaultActiveKey="1" items={tabs} />;
};

const ListView = ({ match, events }) => {
  let competitorsById = {};
  match.fixture.competitors.forEach((item, index) => {
    competitorsById[item.entityId] = { ...item, index };
  });

  return (
    <List
      size="large"
      bordered
      dataSource={events}
      renderItem={(item) => {
        const competitor = competitorsById[item.entityId];
        const logo = competitor?.logo;
        const index = competitor?.index;

        const person = players.find((person) => {
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
                <p className="font-medium text-lg mb-1">{item.desc}</p>
                <p className="font-medium text-xs mb-3">
                  {item.success != null && item.success
                    ? "Başarılı"
                    : "Başarısız"}
                </p>
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
                <p className="font-medium text-lg mb-1">{item.desc}</p>
                {item.success != null && (
                  <p className="font-medium text-xs mb-3">
                    {item.success ? "Başarılı" : "Başarısız"}
                  </p>
                )}

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
