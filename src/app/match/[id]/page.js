"use client";

import { Field } from "@/app/components/field";
import { Stats } from "@/app/components/stats";
import { Timeline } from "@/app/components/timeline";
import { eventOptions } from "@/app/const";
import { players } from "@/app/data/players";
import { addEvent } from "@/app/store/matchSlicer";
import { Button, Checkbox, Modal, Tabs, Typography } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useResizeObserver from "use-resize-observer";

export default function Match() {
  const { id } = useParams();
  const matches = useSelector((state) => state.matchSlicer.matches);
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [event, setEvent] = useState("");
  const [quarter, setQuarter] = useState(1);
  const [minute, setMinutes] = useState(11);
  const [seconds, setSeconds] = useState(59);
  const [player, setPlayer] = useState(null);
  const [success, setSuccess] = useState(false);
  const [coordinates, setCoordinates] = useState({
    x: 0,
    y: 0,
  });
  const { ref, width = 1200, height = 750 } = useResizeObserver();
  const wrapperRef = useRef();
  const dispatch = useDispatch();

  const matchData = matches[id];

  const competitor1 = matchData.fixture.competitors[0];
  const competitor2 = matchData.fixture.competitors[1];
  const periodData = matchData.periodData;
  const periodLabels = periodData.periodLabels;
  const teamScoreKeys = Object.keys(periodData.teamScores);
  const teamScoresArray = teamScoreKeys.map((key) => {
    return periodData.teamScores[key];
  });

  const getHomePlayerOptions = () => {
    return matchData.statistics.home.persons;
  };

  const getAwayPlayerOptions = () => {
    return matchData.statistics.away.persons;
  };

  const items = [
    {
      key: "1",
      label: "İstatistikler",
      children: <Stats match={matchData} />,
    },
    {
      key: "2",
      label: "Atış Grafiği",
      children: <Field match={matchData} />,
    },
    {
      key: "3",
      label: "Oyun akışı",
      children: <Timeline match={matchData} />,
    },
  ];

  const rawPlayer = useMemo(() => {
    if (player == null) {
      return null;
    }
    return players.find((item) => item.personId === player);
  }, [player]);

  return (
    <div className="pt-10 flex flex-col items-center max-w-[1280px] mx-auto">
      <Modal
        okButtonProps={{
          disabled:
            (step === 1 && (player == null || event == null || event == "")) ||
            (step == 0 && coordinates.x == 0 && coordinates.y == 0),
        }}
        onOk={() => {
          if (step === 0) {
            setStep(1);
          } else {
            const eventOption = eventOptions.find((item) => item.key === event);
            const newShot = {
              bib: "9",
              clock: `PT${minute}M${seconds}S`,
              desc: eventOption.code,
              entityId: rawPlayer?.entityId,
              eventType: eventOption.key,
              name: "",
              periodId: quarter,
              personId: player,
              success: success,
              successString: "",
              scores: {
                [competitor1.entityId]: 0,
                [competitor2.entityId]: 0,
              },
              x: coordinates.x,
              y: coordinates.y,
            };
            dispatch(
              addEvent({
                matchId: matchData.seasonId,
                event: newShot,
              })
            );
            setCoordinates({
              x: 0,
              y: 0,
            });
            setStep(0);
            setPlayer(null);
          }
        }}
        cancelText="Geri"
        okText="İleri"
        width={"90%"}
        onCancel={() => {
          if (step === 1) {
            setStep(0);
          } else {
            setIsModalVisible(false);
          }
        }}
        open={isModalVisible}
      >
        <Typography.Title level={3}>Veri Girişi</Typography.Title>
        {step === 1 ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-4 justify-center align-center">
              {eventOptions.map((item, index) => (
                <div
                  onClick={() => {
                    setEvent(item.key);
                  }}
                  className={`min-h-[32px] text-center cursor-pointer min-w-[64px] p-2 border-2 rounded-lg border-neutral-800  flex justify-center ${
                    event === item.key ? "bg-blue-300" : "bg-neutral-0"
                  } `}
                  key={index}
                >
                  {item.code}
                </div>
              ))}
            </div>

            <div className="flex">
              <div className="flex flex-col space-x-4 shrink-0 w-1/2">
                <p className="text-lg font-bold mb-3">{competitor1?.name}</p>
                <div className="flex flex-wrap items-center justify-center">
                  {getHomePlayerOptions()
                    .slice(0, 5)
                    .map((p, index) => (
                      <div
                        onClick={() => {
                          setPlayer(p.personId);
                        }}
                        key={index}
                        className={`mr-4 mb-4 flex shrink-0 flex-col border-neutral-400 border-2 p-2 rounded-lg justify-center items-center ${
                          p.personId === player ? "bg-blue-300" : ""
                        }`}
                      >
                        <img alt="" src={p.personImage} className="w-[60px]" />
                        <p className="font-bold">
                          {p.bib} - {p.personName}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex flex-col space-x-4 shrink-0 w-1/2">
                <p className="text-lg flex mb-3 font-bold">
                  {competitor2?.name}
                </p>
                <div className="flex flex-wrap items-center justify-center">
                  {getAwayPlayerOptions()
                    .slice(0, 5)
                    .map((p, index) => (
                      <div
                        onClick={() => {
                          setPlayer(p.personId);
                        }}
                        key={index}
                        className={`mr-4 mb-4 flex shrink-0 flex-col border-neutral-400 border-2 p-2 rounded-lg justify-center items-center ${
                          p.personId === player ? "bg-blue-300" : ""
                        }`}
                      >
                        <img alt="" src={p.personImage} className="w-[60px]" />
                        <p>
                          {p.bib} - {p.personName}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <Checkbox
              checked={success}
              onChange={(e) => {
                setSuccess(e.target.checked);
              }}
            >
              Başarılı
            </Checkbox>

            <Typography.Text>Çeyrek</Typography.Text>
            <div className="flex space-x-4">
              {[1, 2, 3, 4].map((item, index) => (
                <div
                  onClick={() => {
                    setQuarter(item);
                  }}
                  className={`min-h-[32px] text-center cursor-pointer min-w-[64px] p-2 border-2 rounded-lg border-neutral-800  flex justify-center ${
                    quarter === item ? "bg-blue-300" : "bg-neutral-0"
                  } `}
                  key={index}
                >
                  {item}
                </div>
              ))}
            </div>

            <Typography.Text>Kalan Dakika</Typography.Text>
            <div className="flex space-x-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((item, index) => (
                <div
                  onClick={() => {
                    setMinutes(item);
                  }}
                  className={`min-h-[32px] text-center cursor-pointer min-w-[64px] p-2 border-2 rounded-lg border-neutral-800  flex justify-center ${
                    minute === item ? "bg-blue-300" : "bg-neutral-0"
                  } `}
                  key={index}
                >
                  {item}
                </div>
              ))}
            </div>

            <Typography.Text>Kalan Saniye</Typography.Text>
            <div className="flex flex-wrap">
              {new Array(60).fill(0).map((item, index) => (
                <div
                  onClick={() => {
                    setSeconds(index);
                  }}
                  className={`min-h-[32px] mr-2 mb-2 text-center cursor-pointer min-w-[64px] p-2 border-2 rounded-lg border-neutral-800  flex justify-center ${
                    seconds === index ? "bg-blue-300" : "bg-neutral-0"
                  } `}
                  key={index}
                >
                  {index}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div
              ref={wrapperRef}
              onClick={(e) => {
                let bounds = wrapperRef.current.getBoundingClientRect();
                let x = e.clientX - bounds.left;
                let y = Math.abs(bounds.top - e.clientY);
                setCoordinates({
                  x: (x * 100) / width,
                  y: ((height - y) * 100) / height,
                });
              }}
              className="w-full h-full relative mb-10"
            >
              {/* <div className="bg-white absolute border-2 border-gray-200 shadow-lg top-[-12px] right-[-12px] p-4 rounded-lg">
                <Button onClick={showModalFiltre}>Filtre</Button>
              </div> */}
              {[coordinates].map((shot, index) => {
                const scaledX = (shot.x / 100) * width;
                const scaledY = height - (shot.y / 100) * height;

                return (
                  <div
                    id="button"
                    style={{
                      top: scaledY,
                      left: scaledX,
                    }}
                    className={`absolute cursor-pointer w-[16px] h-[16px] rounded-full hover:scale-125 z-10 ${
                      shot.success ? "bg-green-400" : "bg-red-400"
                    } `}
                    key={index}
                  />
                );
              })}
              <img ref={ref} src={"/field.png"} alt="" />
            </div>
          </>
        )}
      </Modal>
      <div className="flex justify-between w-full">
        <div className="flex items-center space-x-3">
          <div className="text-3xl font-medium">{competitor1.name}</div>
          <img src={competitor1.logo} className="w-[64px]" alt="" />
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="flex space-x-3">
            <Button
              onClick={() => {
                router.push("/");
              }}
            >
              Maçlar
            </Button>
            {matchData.isCustom && (
              <Button
                onClick={() => {
                  setIsModalVisible(true);
                }}
              >
                Veri Girişi
              </Button>
            )}
          </div>

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
          <div className="text-3xl font-medium max-w-[350px] overflow-hidden">
            {competitor2.name}
          </div>
        </div>
      </div>
      <div className="w-full">
        <Tabs defaultActiveKey="1" items={items} />
      </div>
    </div>
  );
}
