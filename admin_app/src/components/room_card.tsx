import React from 'react';
import { Badge, Card, Button } from 'antd';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import SpeedIcon from '@mui/icons-material/Speed';

type RoomsCardProps = {
  roomNumber: number;
  occupied: boolean;
  temperature: number;
  humidity: number;
  pressure: number;
  onOpenDoor?: () => void;
};

const RoomsCard: React.FC<RoomsCardProps> = ({
  roomNumber,
  occupied,
  temperature,
  humidity,
  pressure,
  onOpenDoor,
}) => (
  <Badge.Ribbon
    text={occupied ? "Занято" : "Свободно"}
    color={occupied ? "red" : "green"}
    placement="end"
  >
    <Card title={`Комната ${roomNumber}`} style={{ width: 300 }}>
      <p>
        <ThermostatIcon sx={{ fontSize: 20 }} /> Температура: <b>{temperature}°C</b>
      </p>
      <p>
        <WaterDropIcon sx={{ fontSize: 15 }} className="mr-1 ml-0.5" /> Влажность <b>{humidity}%</b>
      </p>
      <p>
        <SpeedIcon sx={{ fontSize: 20 }} /> Давление <b>{pressure} мм.рт.ст.</b>
      </p>
      <Button className="mt-3" onClick={onOpenDoor}>Открыть дверь</Button>
    </Card>
  </Badge.Ribbon>
);

export default RoomsCard;