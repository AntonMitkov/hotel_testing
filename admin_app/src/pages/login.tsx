import React from 'react';
import { Flex, Card, Button, Checkbox, Form, Input, message, notification, Spin } from 'antd';
import type { FormProps } from 'antd';
import { getCookie, setCookie } from 'typescript-cookie'
import "../login.css";
import { useNavigate } from "react-router-dom";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

type NotificationType = 'success' | 'info' | 'warning' | 'error';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = React.useState<boolean>(false);

  const openNotificationWithIcon = (type: NotificationType, description: string) => {
    api[type]({
      message: 'Ошибка',
      description,
    });
  };

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/auth/token", {
        body: `grant_type=password&username=${values.username}&password=${values.password}&scope=&client_id=string&client_secret=string`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
      });

      if (response.status === 401) {
        openNotificationWithIcon('error', 'Неверный логин или пароль!');
        setLoading(false); // Stop loading spinner
        return; // Prevent navigation
      }

      const text = await response.text();
      const json_text = JSON.parse(text);
      setCookie('bearer-hotel', json_text.access_token, { expires: 7, path: '' });
      navigate("/");
    } catch (error) {
      message.error('Network error!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex className='min-h-screen login-page'>
      {contextHolder}
      <Card title='Login' className='w-1/3 m-auto'>
        <Spin spinning={loading} size="large">
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={() => console.log("err")}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
        </Spin>
      </Card>
    </Flex>
  );
};

export default Login;
