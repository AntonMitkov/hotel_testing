import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import DoorBackIcon from '@mui/icons-material/DoorBack';
import './App.css';
import Rooms from './pages/rooms';
import TestPage from './pages/bookings'; // Make sure this file exists
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './pages/login';
import MainScreen from './pages/main_screen';

const { Content, Sider } = Layout;

const items = [
  {
    key: '1',
    icon: <DoorBackIcon />,
    label: 'Rooms',
  },
  {
    key: '2',
    icon: <UserOutlined />,
    label: 'Booking',
  },
  {
    key: '3',
    icon: <UploadOutlined />,
    label: 'Other',
  },
];

class App extends Component {
  state = {
    selectedKey: '1',
  };

  handleMenuClick = (e: any) => {
    this.setState({ selectedKey: e.key });
  };

  renderContent = () => {
    const { selectedKey } = this.state;
    switch (selectedKey) {
      case '1':
        return <Rooms />;
      case '2':
        return <TestPage />;
      default:
        return <div>Other Page</div>;
    }
  };

  render() {
    return (
      <Router>
        <Routes>
          <Route path='/' element={<MainScreen/>}/>
          <Route path='login' element={<Login />}/>
        </Routes>
      </Router>
    );
  }
}

export default App;