import React, { Component } from 'react';
import { Flex, Card, Statistic } from 'antd';
import { Line } from 'react-chartjs-2';
import Papa from 'papaparse';
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

interface AnalyticsState {
  chartData: any;
}

class Analytics extends Component<{}, AnalyticsState> {
  state: AnalyticsState = {
    chartData: null,
  };

  componentDidMount() {
    // Example CSV file path (public folder)
    fetch('reservation_predictions_ridge.csv')
      .then(response => response.text())
      .then(csv => {
        Papa.parse(csv, {
          delimiter: ',',
          header: false,
          complete: (results: Papa.ParseResult<any>) => {
            // results.data is an array of arrays: [date, value, label]
            // Filter out empty rows
            const filtered = results.data.filter((row: any[]) => row.length >= 2 && row[0] && row[1]);
            const labels = filtered.map((row: any[]) => row[0]);
            const values = filtered.map((row: any[]) => Number(row[1]));
            console.log('Parsed CSV results:', filtered);
            console.log('Labels:', labels);
            console.log('Values:', values);
            this.setState({
              chartData: {
                labels,
                datasets: [
                  {
                    label: 'Значение',
                    data: values,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                  },
                ],
              },
            });
          },
        });
      });
  }

  render() {
    return (
      <div className="m-20" style={{ minHeight: '100vh' }}>
        <h1 className="text-3xl font-bold">Аналитика</h1>
        <Flex className='h-screen mt-10 gap-10' vertical>
          <Flex className='gap-10'>
            <Card className='w-1/4 h-[150px] bg-white shadow-md rounded-lg p-4'>
              <Statistic title="Всего комнат" value={6} />
            </Card>
            <Card className='w-1/4 h-[150px] bg-white shadow-md rounded-lg p-4'>
              <Statistic title="Свободных комнат" value={3} />
            </Card>
          </Flex>
          <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Предсказание</h2>
            {this.state.chartData ? (
              <Line data={this.state.chartData} />
            ) : (
              <p>Загрузка данных...</p>
            )}
          </div>
        </Flex>
      </div>
    );
  }
}

export default Analytics;
