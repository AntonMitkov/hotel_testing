import React, { useEffect } from 'react';
import { Flex, Card, Divider, Col, Row, Badge, Button, Avatar } from 'antd';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import SpeedIcon from '@mui/icons-material/Speed';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { getCookie, removeCookie } from 'typescript-cookie'

const token = getCookie('bearer-hotel');

const open_door: () => void() => {
    const response = await fetch('http://127.0.0.1:8000/admin/all_users', {
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

    // Проверка токена при загрузке страницы
    useEffect(() => {
        const token = getCookie('bearer-hotel');
        if (!token) {
            navigate("/login");
        }
        get_rooms(navigate);
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
                <Flex wrap gap={20} className='h-96 overflow-x-scroll' vertical>
                    {Array.from({ length: 12 }, (_, i) => (
                    <Flex className='gap-4' key={i}>
                        {}
                        <Badge.Ribbon text="Занято" color="red" placement="end">
                        <Card title={`Комната ${2*i}`} style={{ width: 300 }}>
                            <p> <ThermostatIcon sx={{ fontSize: 20 }}/> Температура: <b>{Math.floor(Math.random()*15)+10}°C</b></p>
                            <p> <WaterDropIcon sx={{ fontSize: 15 }} className='mr-1 ml-0.5'/> Влажность <b>{Math.floor(Math.random()*20)+60}%</b></p>
                            <p> <SpeedIcon sx={{ fontSize: 20 }}/> Давление <b>{Math.floor(Math.random()*50)+730} мм.рт.ст.</b></p>
                            <Button onClick={() => open_door()}>Открыть дверь</Button>
                        </Card>
                        </Badge.Ribbon>                    
                    </Flex>
                    ))}
                </Flex>
                </Col>
                <Col span={6} className='d-none d-lg-block'>
                <Flex vertical gap={30}>
                    <Card title="Наши комнаты" variant="borderless" className='w-100'>
                    <Flex className='gap-2' vertical>
                        <Button onClick={() => get_info(navigate)}>Добавить порт</Button>
                        <Button onClick={() => get_rooms(navigate)}>Настроить комнаты</Button>
                        <Button>Удалить комнату</Button>
                    </Flex>
                    </Card>
                    <Card title="Заселить пользователя" variant="borderless" >
                    <Flex className='gap-2' vertical>
                        <Button>Заселение</Button>
                        <Button>Услуги</Button>
                        <Button>Выселение</Button>
                    </Flex>
                    </Card>
                </Flex>
                </Col>
            </Row>
        </div>
    );
};

export default Rooms;
