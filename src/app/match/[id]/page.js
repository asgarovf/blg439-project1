"use client";

import { Field } from "@/app/components/field";
import { Stats } from "@/app/components/stats";
import { Timeline } from "@/app/components/timeline";
import { eventOptions } from "@/app/const";
import { addEvent } from "@/app/store/matchSlicer";
import { Button, Checkbox, Input, Modal, Select, Tabs, Typography } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
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
  const [minute, setMinutes] = useState(12);
  const [seconds, setSeconds] = useState(0);
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

  const getPlayerOptions = () => {
    return matchData.statistics.home.persons.concat(
      matchData.statistics.away.persons
    );
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

  return (
    <div className="pt-10 flex flex-col items-center max-w-[1280px] mx-auto">
      <Modal
        okButtonProps={{
          disabled: player == null || event == null,
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
              entityId: "af7e4c88-32c2-11ed-b619-7bbcc08f45bf",
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
            setIsModalVisible(false);
            setCoordinates({
              x: 0,
              y: 0,
            });
            setStep(0);
            setMinutes(0);
            setSeconds(0);
            setPlayer(null);
          }
        }}
        cancelText="Geri"
        okText="İleri"
        width={step === 1 ? "90%" : 640}
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
        {step === 0 ? (
          <div className="flex flex-col space-y-4">
            <Select
              onChange={(e) => {
                setEvent(e);
              }}
              placeholder="Aktivite"
              className="min-w-[400px]"
              options={eventOptions.map((item) => {
                return { value: item.key, label: item.code, key: item.key };
              })}
            />
            <Select
              onChange={(e) => {
                setPlayer(e);
              }}
              value={player?.personId}
              placeholder="Oyuncu"
              className="min-w-[400px]"
              optionLabelProp="label"
            >
              {getPlayerOptions().map((player, index) => {
                const value = player.name ?? player?.personName;
                const label = `${player.bib} - ${value}`;
                return (
                  <Select.Option
                    label={label}
                    value={player.personId}
                    key={index}
                  >
                    {label}
                  </Select.Option>
                );
              })}
            </Select>
            <Checkbox
              onChange={(e) => {
                setSuccess(e.target.checked);
              }}
              value={success}
            >
              Başarılı
            </Checkbox>

            <Typography.Text>Çeyrek</Typography.Text>
            <Select
              onChange={(e) => {
                setQuarter(e);
              }}
              value={quarter}
              placeholder="Çeyrek"
              className="min-w-[400px]"
              options={[
                { value: 1, label: 1 },
                { value: 2, label: 2 },
                { value: 3, label: 3 },
                { value: 4, label: 4 },
              ]}
            />

            <Typography.Text>Kalan Dakika</Typography.Text>
            <Input
              type="number"
              value={minute}
              onChange={(e) => setMinutes(e.target.value)}
            />

            <Typography.Text>Kalan Saniye</Typography.Text>
            <Input
              type="number"
              value={seconds}
              onChange={(e) => setSeconds(e.target.value)}
            />
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
