"use client";
import { React, useState, useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "next/navigation";
import { getPopulatedTeams } from "../../data/teams";
import { getPopulatedPlayers, initialPlayers } from "../../data/players";
import { Form, Button, Modal, Input, Popconfirm, message, Table } from "antd";

const TeamInfoPage = () => {
  const [isPlayerModalOpen, setisPlayerModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [players, setPlayers] = useState([]);

  const handleDelete = (player) => {
    const newPlayers = players.filter((p) => p.personId !== player.personId);
    setPlayers(newPlayers);
    localStorage.setItem("players", JSON.stringify(newPlayers));
    message.success("Player deleted");
  };

  const showPlayerModal = () => {
    setisPlayerModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        const newPlayer = {
          active: false,
          bib: values.bib,
          entityId: team.entityId,
          personId: uuidv4(),
          personImage:
            "https://static.vecteezy.com/system/resources/previews/004/511/281/original/default-avatar-photo-placeholder-profile-picture-vector.jpg",
          personName: values.personName,
          starter: false,
          statistics: {},
        };
        const newPlayers = [...players, newPlayer];
        const newAllPlayers = [...getPopulatedPlayers(), newPlayer];
        setPlayers(newPlayers);
        localStorage.setItem("players", JSON.stringify(newAllPlayers));
        setisPlayerModalOpen(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setisPlayerModalOpen(false);
  };

  const { entityId } = useParams();

  const team = useMemo(() => {
    return getPopulatedTeams().find((team) => team.entityId === entityId);
  }, [entityId]);

  useEffect(() => {
    const allPlayers = getPopulatedPlayers();
    const teamPlayers = allPlayers.filter((player) => {
      return player.entityId === team.entityId;
    });
    setPlayers(teamPlayers);
  }, [team]);

  if (!team) {
    return (
      <div className="flex flex-col h-[94vh] overflow-auto items-center justify-center bg-gray-100">
        <p>Team not found</p>
      </div>
    );
  }

  const dataSource = players.map((item) => {
    return item;
  });

  const columns = [
    {
      title: "#",
      dataIndex: "number",
      key: "number",
      render: (_, p) => {
        return <a>{p.bib}</a>;
      },
    },
    {
      title: "",
      dataIndex: "personImage",
      key: "personImage",
      align: "center",
      render: (_, p) => {
        return (
          <div className="flex justify-center">
            <img
              src={p.personImage}
              alt="logo"
              className="w-[64px] h-[64px] rounded-full"
            />
          </div>
        );
      },
    },
    {
      title: "İsim",
      dataIndex: "name",
      key: "personName",
      render: (_, p) => {
        return <a>{p.personName}</a>;
      },
    },
    {
      title: "İşlemler",
      dataIndex: "actions",
      key: "actions",
      align: "right",
      render: (_, a) => {
        return (
          <Popconfirm
            title="Oyuncuyu silmek istediğine emin misin?"
            onConfirm={(event) => {
              event.stopPropagation();
              handleDelete(a);
            }} // Pass event to handleDelete
            okText="Evet"
            cancelText="Hayır"
          >
            <Button type="primary" danger>
              Sil
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <main className="flex items-center w-full h-[94vh] overflow-auto flex-col p-24 pt-10">
      <Modal
        title="Yeni oyuncu ekle"
        open={isPlayerModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical" name="form_in_modal">
          <Form.Item
            name="personName"
            rules={[
              { required: true, message: "Please input the player name!" },
            ]}
          >
            <Input placeholder="İsim Soyisim" />
          </Form.Item>
          <Form.Item
            name="bib"
            rules={[
              {
                required: true,
                message: "Please input the player image URL!",
              },
            ]}
          >
            <Input placeholder="Numara" />
          </Form.Item>
        </Form>
      </Modal>
      <div className="flex flex-col items-center p-8 w-full">
        <h1 className="text-4xl font-bold mb-8 text-blue-600">{team.name}</h1>
        <img
          src={team.logo}
          alt={`${team.name} Logo`}
          className="w-16 h-16 rounded-full mb-8 shadow-lg"
        />

        <div className="flex justify-between w-full">
          <h2 className="text-2xl font-bold mb-4 text-blue-500">Oyuncular</h2>
          <Button type="primary" onClick={showPlayerModal}>
            Yeni oyuncu ekle
          </Button>
        </div>

        <div className="w-full">
          <Table
            className="w-full"
            pagination={false}
            dataSource={dataSource}
            columns={columns}
          />
        </div>
      </div>
    </main>
  );
};

export default TeamInfoPage;
