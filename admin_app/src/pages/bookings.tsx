import React, { useEffect, useState } from 'react';
import { Table, Flex } from 'antd';
import type { TableProps } from 'antd';
import { getCookie } from 'typescript-cookie'
import { useNavigate } from "react-router-dom";

interface CheckInType {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  start_date: string;
  end_date: string;
}

const columns: TableProps<CheckInType>['columns'] = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Room Number', dataIndex: 'room_number', key: 'room_number' },
  { title: 'First Name', dataIndex: 'first_name', key: 'first_name' },
  { title: 'Last Name', dataIndex: 'last_name', key: 'last_name' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Phone Number', dataIndex: 'phone_number', key: 'phone_number' },
  { title: 'Start Date', dataIndex: 'start_date', key: 'start_date' },
  { title: 'End Date', dataIndex: 'end_date', key: 'end_date' },
];

const Bookings: React.FC = () => {
  const [data, setData] = useState<CheckInType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = getCookie('bearer-hotel');
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await fetch('http://127.0.0.1:8000/checkin/all', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Ошибка при получении данных');
        }
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error('Ошибка:', error);
      }
    };
    fetchData();
  }, [navigate]);

  return (
    <Flex className='h-screen justify-center mx-40' vertical>
      <h1 className="text-3xl font-bold mb-5">
          Все резервации
      </h1>
      <Table<CheckInType> columns={columns} dataSource={data} rowKey="id" />
    </Flex>
  );
};

export default Bookings;
