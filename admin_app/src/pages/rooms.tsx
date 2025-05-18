import React, { useEffect, useState } from 'react';
import { Flex, Card, Divider, Col, Row, Badge, Button, Avatar } from 'antd';
import { DatePicker, Drawer, Form, Input, Select, Space } from 'antd';

import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { getCookie, removeCookie } from 'typescript-cookie'
import RoomsCard from '../components/room_card';
import { on } from 'events';

const token = getCookie('bearer-hotel');

const open_door = async (): Promise<void> => {
    const response = await fetch('http://127.0.0.1:8000/controller/lock_open', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
}

const get_info = async (navigate: ReturnType<typeof useNavigate>) => {
    console.log('Получение информации с сервера...');
    console.log('Токен:', token);
    if (!token) {
        console.error('Токен не найден');

        navigate("/login");
        return;
    }
    try {
        const response = await fetch('http://127.0.0.1:8000/admin/all_users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Ошибка при получении данных');
        }
        const data = await response.json();
        console.log('Информация с сервера:', data);
    } catch (error) {
        console.error('Ошибка:', error);
    }
};

const get_rooms = async (navigate: ReturnType<typeof useNavigate>) => {
    console.log('Получение информации с сервера...');
    console.log('Токен:', token);
    if (!token) {
        console.error('Токен не найден');

        navigate("/login");
        return;
    }
    try {
        const response = await fetch('http://127.0.0.1:8000/rooms/all', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Ошибка при получении данных');
        }
        const data = await response.json();
        console.log('Информация с сервера:', data);
        return data;
    } catch (error) {
        console.error('Ошибка:', error);
    }
};

const Rooms: React.FC = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState<any[]>([]);
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    // Получение комнат при загрузке страницы
    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        // Получаем комнаты и сохраняем в state
        const fetchRooms = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/rooms/all', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Ошибка при получении данных');
                }
                const data = await response.json();
                setRooms(data);
            } catch (error) {
                console.error('Ошибка:', error);
            }
        };
        fetchRooms();
    }, [navigate]);

    const goToLoginPage = () => {
        removeCookie('bearer-hotel', { path: '' })
        navigate("/login");
    };

    return (
        <div className="m-20" style={{ minHeight: '100vh' }}>
            <Flex className='items-center justify-between'>
                <h1 className="text-3xl font-bold">
                    Здравствуйте, Антон!
                </h1>
                <Avatar size={64} icon={<UserOutlined />} onClick={goToLoginPage}/>
            </Flex>
            <Divider />
            <Row gutter={40} wrap>
                <Col span={18}>
                <Flex wrap gap={20} className='h-[480px] overflow-x-scroll' vertical>
                    {rooms.map((room, i) => (
                        <Flex className='gap-4' key={room.id || i}>
                            <RoomsCard
                                roomNumber={room.room_number}
                                occupied={!room.is_available}
                                temperature={room.temperature ?? 22}
                                humidity={room.humidity ?? 45}
                                pressure={room.pressure ?? 760}
                                onOpenDoor={open_door}
                            />
                        </Flex>
                    ))}
                </Flex>
                </Col>
                <Col span={6} className='d-none d-lg-block'>
                <Flex vertical gap={30}>
                    <Card title="Наши комнаты" variant="borderless" className='w-100'>
                    <Flex className='gap-2' vertical>
                        <Button onClick={() => get_info(navigate)}>Добавить порт</Button>
                        <Button>Настроить комнаты</Button>
                        <Button>Удалить комнату</Button>
                    </Flex>
                    </Card>
                    <Card title="Заселить пользователя" variant="borderless" >
                    <Flex className='gap-2' vertical>
                        <Button onClick={showDrawer}>Заселение</Button>
                        <Button>Услуги</Button>
                        <Button>Выселение</Button>
                    </Flex>
                    <Drawer
                        title="Форма заселения"
                        closable={{ 'aria-label': 'Close Button' }}
                        onClose={onClose}
                        open={open}
                    >
                        <Form
                            layout="vertical"
                            name="register_guest"
                            onFinish={async (values) => {
                                const payload = {
                                    last_name: values.lastName,
                                    first_name: values.firstName,
                                    email: values.email,
                                    phone_number: values.phone,
                                    room_number: values.room,
                                    start_date: values.checkIn.format('YYYY-MM-DD'),
                                    end_date: values.checkOut.format('YYYY-MM-DD'),
                                };

                                try {
                                    const response = await fetch('http://127.0.0.1:8000/admin/checkin_guest', {
                                        method: 'POST',
                                        headers: {
                                            'Authorization': `Bearer ${token}`,
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(payload),
                                    });
                                    if (!response.ok) {
                                        throw new Error('Ошибка при заселении');
                                    }
                                    const data = await response.json();
                                    console.log('Заселение успешно:', data);
                                    onClose();
                                } catch (error) {
                                    console.error('Ошибка при заселении:', error);
                                } finally {
                                    const updatedRooms = await get_rooms(navigate);
                                    setRooms(updatedRooms);
                                    onClose();
                                }
                            }}
                        >
                            <Form.Item
                                label="Фамилия"
                                name="lastName"
                                rules={[{ required: true, message: 'Пожалуйста, введите фамилию' }]}
                            >
                                <Input placeholder="Введите фамилию" />
                            </Form.Item>
                            <Form.Item
                                label="Имя"
                                name="firstName"
                                rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}
                            >
                                <Input placeholder="Введите имя" />
                            </Form.Item>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Пожалуйста, введите email' },
                                    { type: 'email', message: 'Некорректный email' }
                                ]}
                            >
                                <Input placeholder="Введите email" />
                            </Form.Item>
                            <Form.Item
                                label="Телефон"
                                name="phone"
                                rules={[{ required: true, message: 'Пожалуйста, введите телефон' }]}
                            >
                                <Input placeholder="Введите телефон" />
                            </Form.Item>
                            <Form.Item
                                label="Комната"
                                name="room"
                                rules={[{ required: true, message: 'Пожалуйста, выберите комнату' }]}
                            >
                                <Select placeholder="Выберите комнату">
                                    {rooms
                                        .filter((room) => room.is_available)
                                        .map((room) => (
                                            <Select.Option key={room.id} value={room.room_number}>
                                                {room.room_number}
                                            </Select.Option>
                                        ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Дата заезда"
                                name="checkIn"
                                rules={[{ required: true, message: 'Пожалуйста, выберите дату заезда' }]}
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item
                                label="Дата выезда"
                                name="checkOut"
                                rules={[{ required: true, message: 'Пожалуйста, выберите дату выезда' }]}
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" block>
                                    Зарегистрировать
                                </Button>
                            </Form.Item>
                        </Form>
                    </Drawer>
                    </Card>
                </Flex>
                </Col>
            </Row>
        </div>
    );
};

export default Rooms;
