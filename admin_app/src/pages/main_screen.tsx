import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import DoorBackIcon from '@mui/icons-material/DoorBack';
import Rooms from '../pages/rooms'; // Change this path as needed
import TestPage from './bookings'; // Make sure this file exists
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

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

class MainScreen extends Component {
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
        <Layout>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
          >
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[this.state.selectedKey]}
              items={items}
              onClick={this.handleMenuClick}
            />
          </Sider>
          
          <Content>
              {this.renderContent()}
          </Content>
        </Layout>
    );
  }
}

export default MainScreen;