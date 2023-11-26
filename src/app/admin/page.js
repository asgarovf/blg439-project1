"use client";
import { React, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Modal, Input, Form, Popconfirm, message } from "antd";
import { v4 as uuidv4 } from "uuid";
import { intialTeams } from "../data/teams";

const AdminPage = () => {
    const router = useRouter();
    const [isTeamModalOpen, setisTeamModalOpen] = useState(false);
    const [form] = Form.useForm();

    const handleDelete = (team) => (event) => {
        event.stopPropagation();
        setTeams((prevTeams) => prevTeams.filter(t => t.entityId !== team.entityId));
        message.success('Team deleted');
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
                console.log('Validate Failed:', info);
            });
    };

    const handleCancel = () => {
        setisTeamModalOpen(false);
    };

    const [teams, setTeams] = useState([]);

    useEffect(() => {
        const storedTeams = localStorage.getItem('teams');
        if (storedTeams) {
            setTeams(JSON.parse(storedTeams));
        } else {
            setTeams(intialTeams);
            localStorage.setItem('teams', JSON.stringify(intialTeams));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('teams', JSON.stringify(teams));
    }, [teams]);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24 pt-10">
            <h1 className="text-4xl font-bold mb-8">Takımlar</h1>
            <Button type="primary" onClick={showTeamModal}>
                Add Team
            </Button>

            <Modal title="Add Team" visible={isTeamModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} layout="vertical">
                    <Form.Item name="teamName" label="Team Name" rules={[{ required: true, message: 'Please input the team name!' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            <div className="flex flex-col items-center">
                {teams.map((team, index) => (
                    <div
                        onClick={() => router.push(`/teams/${team.entityId}`)}
                        key={team.entityId}
                        className="bg-white hover:cursor-pointer hover:bg-gray-50 border-2 border-gray-300 p-4 mb-4 rounded-lg shadow-md"
                        style={{ width: '1200px' }}
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
                ))}
            </div>
        </main>
    );
};

export default AdminPage;
