import React, { Component } from 'react';
import { Flex, Card, Divider, Col, Row, Badge, Statistic } from 'antd';
import { LineChart } from '@mui/x-charts/LineChart';


class Analytics extends Component {
  render() {
    return (
        <div className="m-20" style={{ minHeight: '100vh' }}>
          <h1 className="text-3xl font-bold">
              Аналитика
          </h1>
          <Flex className='h-screen mt-10 gap-10'>
            <Card className='w-1/4 h-[150px] bg-white shadow-md rounded-lg p-4'>
              <Statistic title="Всего комнат" value={6} />
            </Card>
            <Card className='w-1/4 h-[150px] bg-white shadow-md rounded-lg p-4'>
              <Statistic title="Свободных комнат" value={3} />
            </Card>
          </Flex>
          <LineChart
            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
            series={[
              {
                data: [2, 5.5, 2, 8.5, 1.5, 5],
              },
            ]}
            height={300}
          />
        </div>
    );
  }
}


export default Analytics;
