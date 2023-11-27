"use client";
import { React, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Modal, Input, Form, Popconfirm, message, Table } from "antd";
import { v4 as uuidv4 } from "uuid";
import { getPopulatedTeams, teams as initialTeams } from "../data/teams";

const AdminPage = () => {
  const router = useRouter();
  const [isTeamModalOpen, setisTeamModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [teams, setTeams] = useState([]);

  const handleDelete = (team) => {
    const newTeams = teams.filter((t) => t.entityId !== team.entityId);
    setTeams(newTeams);
    localStorage.setItem("teams", JSON.stringify(newTeams));
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
        const newTeams = [...getPopulatedTeams(), newTeam];
        setTeams(newTeams);
        localStorage.setItem("teams", JSON.stringify(newTeams));
        setisTeamModalOpen(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setisTeamModalOpen(false);
  };

  useEffect(() => {
    const storedTeams = localStorage.getItem("teams");
    if (storedTeams != null) {
      setTeams(JSON.parse(storedTeams));
    } else {
      setTeams(initialTeams);
      localStorage.setItem("teams", JSON.stringify(initialTeams));
    }
  }, []);

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
      render: (_, a) => {
        return (
          <Popconfirm
            title="Takımı silmek istediğine emin misin?"
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
    <main className="flex items-center w-full h-[90vh] overflow-auto flex-col p-24 pt-10">
      <Modal
        title="Takım Ekle"
        open={isTeamModalOpen}
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
        <Table pagination={false} dataSource={dataSource} columns={columns} />
      </div>
    </main>
  );
};

export default AdminPage;
