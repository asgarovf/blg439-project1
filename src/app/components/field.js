import { Modal } from "antd";
import { useState } from "react";
import useResizeObserver from "use-resize-observer";

export const Field = ({ match }) => {
  const { ref, width = 1200, height = 750 } = useResizeObserver();
  const [isModalOpenFiltre, setIsModalOpenFiltre] = useState(false);
  const [isModalOpenShot, setIsModalOpenShot] = useState(false);
  const [selectedShot, setSelectedShot] = useState(null); // Store the selected shot
  const [selectedPlayer, setSelectedPlayer] = useState(null); // Store the selected shot
  const [selectedTeam, setSelectedTeam] = useState(null); // Store the selected shot

  const shots = match.shotChart.shots;
  const homePersons = match.statistics.home.persons;
  const awayPersons = match.statistics.away.persons;
  const allPersons = homePersons.concat(awayPersons);

  const findPersonByPersonId = (personId) => {
    return allPersons.find((person) => person.personId === personId);
  };

  const findTeamByEntityId = (entityId) => {
    return match.fixture.competitors.find((team) => team.entityId === entityId);
  };

  const showModalFiltre = () => {
    setIsModalOpenFiltre(true);
  };

  const showModalShot = (shot, player, team) => {
    setSelectedShot(shot);
    setSelectedPlayer(player);
    setSelectedTeam(team);
    setIsModalOpenShot(true);
  };

  const handleCancelFiltre = () => {
    setIsModalOpenFiltre(false);
  };

  const handleCancelShot = () => {
    setIsModalOpenShot(false);
  };

  return (
    <>
      {/* <Modal
        okButtonProps={{
          className: "hidden",
        }}
        onCancel={handleCancelFiltre}
        title="Filtre"
        visible={isModalOpenFiltre}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal> */}

      <Modal
        okButtonProps={{
          className: "hidden",
        }}
        onCancel={handleCancelShot}
        title="Shot Info"
        open={isModalOpenShot}
      >
        {selectedShot && selectedPlayer && selectedTeam && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                backgroundColor: "#f7f7f7",
                padding: "20px",
                borderRadius: "10px",
                textAlign: "center",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  src={selectedPlayer.personImage}
                  alt={selectedPlayer.personName}
                  style={{
                    width: "200px",
                    borderRadius: "8px",
                    marginBottom: "10px",
                  }}
                />
              </div>
              <h2
                style={{ fontSize: "1.5em", fontWeight: "bold", margin: "0" }}
              >
                {selectedPlayer.personName}
              </h2>
              <h2
                style={{ fontSize: "1.3em", fontWeight: "bold", margin: "0" }}
              >
                #{selectedPlayer.bib}
              </h2>
              <p style={{ fontSize: "1.2em", color: "grey", margin: "5px 0" }}>
                {selectedTeam.name}
              </p>
              <hr style={{ width: "80%", color: "#ddd", margin: "10px 0" }} />
              <p style={{ fontSize: "1em" }}>{selectedShot.desc}</p>
              <hr style={{ width: "80%", color: "#ddd", margin: "10px 0" }} />
              <p style={{ fontSize: "1em", color: "grey", margin: "5px 0" }}>
                {selectedShot.details}
              </p>

              {selectedShot.success && (
                <p style={{ fontSize: "1em", color: "green", margin: "5px 0" }}>
                  Başarılı Atış
                </p>
              )}
              {!selectedShot.success && (
                <p style={{ fontSize: "1em", color: "red", margin: "5px 0" }}>
                  Başarısız Atış
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>

      <div className="w-full h-full relative mb-10">
        {/* <div className="bg-white absolute border-2 border-gray-200 shadow-lg top-[-12px] right-[-12px] p-4 rounded-lg">
          <Button onClick={showModalFiltre}>Filtre</Button>
        </div> */}
        {shots.map((shot, index) => {
          const scaledX = (shot.x / 100) * width;
          const scaledY = height - (shot.y / 100) * height;

          const player = findPersonByPersonId(shot.personId);
          const team = findTeamByEntityId(shot.entityId);

          return (
            <div
              id="button"
              onClick={() => showModalShot(shot, player, team)}
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
  );
};
