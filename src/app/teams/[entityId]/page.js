"use client";
import { React, useState, useEffect } from 'react';
import { v4 as uuidv4 } from "uuid";
import { useParams } from "next/navigation";
import { teams } from '../../data/teams';
import { initialPlayers } from '../../data/players';
import { Form, Card, Row, Col, Button, Modal, Input, Popconfirm, message } from 'antd';

const TeamInfoPage = () => {
    const [isPlayerModalOpen, setisPlayerModalOpen] = useState(false);
    const [form] = Form.useForm();

    const handleDelete = (player) => {
        setPlayers((prevPlayers) => prevPlayers.filter(p => p.personId !== player.personId));
        message.success('Player deleted');
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
                    personImage: "https://static.vecteezy.com/system/resources/previews/004/511/281/original/default-avatar-photo-placeholder-profile-picture-vector.jpg",
                    personName: values.personName,
                    starter: false,
                    statistics: {},
                };
                setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
                setisPlayerModalOpen(false);
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const handleCancel = () => {
        setisPlayerModalOpen(false);
    };

    const [players, setPlayers] = useState([]);

    useEffect(() => {
        const storedPlayers = localStorage.getItem('players');
        if (storedPlayers) {
            setPlayers(JSON.parse(storedPlayers));
        } else {
            setPlayers(initialPlayers);
            localStorage.setItem('players', JSON.stringify(initialPlayers));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('players', JSON.stringify(players));
    }, [players]);

    const { entityId } = useParams();
    const team = teams.find((team) => team.entityId === entityId);

    if (!team) {
        return <p>Team not found</p>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="flex flex-col items-center p-8">
                <h1 className="text-4xl font-bold mb-8 text-blue-600">{team.name}</h1>
                <img
                    src={team.logo}
                    alt={`${team.name} Logo`}
                    className="w-24 h-24 rounded-full mb-8 shadow-lg"
                />
                <Button type="primary" onClick={showPlayerModal}>
                    Add New Player
                </Button>
                <Modal title="Add New Player" visible={isPlayerModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <Form form={form} layout="vertical" name="form_in_modal">
                        <Form.Item
                            name="personName"
                            rules={[{ required: true, message: 'Please input the player name!' }]}
                        >
                            <Input placeholder="İsim Soyisim" />
                        </Form.Item>
                        <Form.Item
                            name="bib"
                            rules={[{ required: true, message: 'Please input the player image URL!' }]}
                        >
                            <Input placeholder="Numara" />
                        </Form.Item>
                    </Form>
                </Modal>
                <h2 className="text-2xl font-bold mb-4 text-blue-500">Players</h2>
                <Row gutter={16} justify="center">
                    {players.filter(player => player.entityId === entityId).map((player) => (
                        <Col span={8} className="mb-4">
                            <Card
                                hoverable
                                style={{ width: 240 }}
                                cover={<img alt={player.personName} src={player.personImage} />}
                            >
                                <Card.Meta title={player.personName} className="text-center" />
                                <Popconfirm
                                    title="Are you sure to delete this player?"
                                    onConfirm={() => handleDelete(player)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button type="primary" danger>
                                        Delete Player
                                    </Button>
                                </Popconfirm>
                            </Card>
                        </Col>
                    ))}
                </Row>

            </div>
        </div>
    );
};

export default TeamInfoPage;