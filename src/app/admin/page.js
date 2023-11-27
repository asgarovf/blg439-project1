"use client";
import { React, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Modal, Input, Form, Popconfirm, message, Table } from "antd";
import { v4 as uuidv4 } from "uuid";
import { teams as initialTeams } from "../data/teams";

const AdminPage = () => {
  const router = useRouter();
  const [isTeamModalOpen, setisTeamModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleDelete = (team) => (event) => {
    event.stopPropagation();
    setTeams((prevTeams) =>
      prevTeams.filter((t) => t.entityId !== team.entityId)
    );
    message.success("Team deleted");
  };

  const showTeamModal = () => {
    setisTeamModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        const newTeam = {
          entityId: uuidv4(),
          name: values.teamName,
          logo: "https://www.espn.com/i/teamlogos/soccer/500/default-team-logo-500.png?h=100&w=100",
        };
        setTeams((prevTeams) => [...prevTeams, newTeam]);
        setisTeamModalOpen(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setisTeamModalOpen(false);
  };

  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const storedTeams = localStorage.getItem("teams");
    if (storedTeams) {
      setTeams(JSON.parse(storedTeams));
    } else {
      setTeams(initialTeams);
      localStorage.setItem("teams", JSON.stringify(initialTeams));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("teams", JSON.stringify(teams));
  }, [teams]);

  const dataSource = teams.map((item) => {
    return item;
  });

  const columns = [
    {
      title: "#",
      dataIndex: "number",
      key: "number",
      render: (_, __, b) => {
        return <a>{b}</a>;
      },
    },
    {
      title: "İsim",
      dataIndex: "name",
      key: "name",
      render: (text, a, b) => {
        return (
          <a
            onClick={() => {
              router.push(`/teams/${a.entityId}`);
            }}
          >
            {text}
          </a>
        );
      },
    },
    {
      title: "Logo",
      dataIndex: "Logo",
      key: "age",
      align: "center",
      render: (_, team) => (
        <div className="flex justify-center">
          <img
            src={team.logo}
            alt="logo"
            className="w-[64px] h-[64px] rounded-full"
          />
        </div>
      ),
    },
    {
      title: "İşlemler",
      dataIndex: "actions",
      key: "actions",
      align: "right",
      render: (text, a, b) => {
        return (
          <Popconfirm
            title="Takımı silmek istediğine emin misin?"
            onConfirm={(event) => handleDelete(team)(event)} // Pass event to handleDelete
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
    <main className="flex items-center w-full h-[90vh] overflow-auto flex-col p-24 pt-10">
      <Modal
        title="Takım Ekle"
        visible={isTeamModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="teamName"
            label="Takım ismi"
            rules={[{ required: true, message: "Lütfen takım ismi giriniz" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <div className="flex w-full justify-between max-w-[90%]">
        <h1 className="text-4xl font-bold mb-8">Takımlar</h1>
        <Button type="primary" onClick={showTeamModal}>
          Takım Ekle
        </Button>
      </div>
      <div className="w-full max-w-[90%]">
        {/* {teams.map((team, index) => (
          <div
            onClick={() => router.push(`/teams/${team.entityId}`)}
            key={team.entityId}
            className="bg-white hover:cursor-pointer hover:bg-gray-50 border-2 border-gray-300 p-4 mb-4 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-center my-2">
              <div className="flex items-center justify-center my-2">
                <div className="mr-4">
                  <img
                    src={team.logo}
                    alt={`${team.name} Logo`}
                    className="w-24 h-24 rounded-full"
                  />
                </div>
                <p className="ml-4 text-xl font-semibold">{team.name}</p>
                <Popconfirm
                  title="Are you sure to delete this team?"
                  onConfirm={(event) => handleDelete(team)(event)} // Pass event to handleDelete
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="primary" danger>
                    Delete Team
                  </Button>
                </Popconfirm>
              </div>
            </div>
          </div>
        ))} */}
        <Table pagination={false} dataSource={dataSource} columns={columns} />
      </div>
    </main>
  );
};

export default AdminPage;
