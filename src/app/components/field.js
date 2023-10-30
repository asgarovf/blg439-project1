import { Button, Modal } from "antd";
import { useState } from "react";
import useResizeObserver from "use-resize-observer";

export const Field = ({ match }) => {
  const { ref, width = 1200, height = 750 } = useResizeObserver();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const shots = match.shotChart.shots;

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        okButtonProps={{
          className: "hidden",
        }}
        onCancel={handleCancel}
        title="Filtre"
        open={isModalOpen}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
      <div className="w-full h-full relative">
        <div className="bg-white absolute border-2 border-gray-200 shadow-lg top-[-12px] right-[-12px] p-4 rounded-lg">
          <Button onClick={showModal}>Filtre</Button>
        </div>
        {shots.map((shot, index) => {
          const scaledX = (shot.x / 100) * width;
          const scaledY = height - (shot.y / 100) * height;

          return (
            <div
              id="button"
              onClick={() => {}}
              style={{
                top: scaledY,
                left: scaledX,
              }}
              className={`absolute w-[16px] h-[16px] rounded-full hover:scale-125 z-10 ${
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
