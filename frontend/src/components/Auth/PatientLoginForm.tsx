// src/components/auth/PatientLoginForm.tsx
"use client";

import React from 'react';
import { useLoginMutation } from '@/services/auth/authSliceAPI';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Typography, Alert } from 'antd';
import { LockOutlined, MailOutlined} from '@ant-design/icons';
import { useAppDispatch } from '@/store/store';
import Link from 'next/link';
import logger from "@/utils/logger1"

const { Title } = Typography;

const PatientLoginForm: React.FC = () => {
    const [login, { isLoading, isError, error }] = useLoginMutation();
    const router = useRouter();
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();

    const onFinish = async (values: any) => {
        try {
            const response = await login(values).unwrap();

            if (response.user.userType === "Patient") {
                // Construct the dashboard route for patients
                const dashboardRoute = `/dashboard/patient`; // Direct route to patient dashboard
                router.push(dashboardRoute);
                

            } else {
                logger.warn('Unexpected user type:', response.user.userType);
                // Optionally, redirect to a default dashboard or display an error message
                // router.push('/default-dashboard');
            }

        } catch (err: any) {
            console.error('Patient Login failed:', err.message || err.error);
        }
    };

    return (
        <div style={{ padding: 24, minHeight: 360 }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Patient Login</Title>
            {isError && error?.data?.message && <Alert message={error.data.message} type="error" showIcon style={{ marginBottom: 24 }} />}
            <Form
                form={form}
                name="login"
                onFinish={onFinish}
                style={{ maxWidth: 400, margin: '0 auto' }}
            >
                <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Please enter your email!', type: 'email' }]}
                >
                    <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Patient Email" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please enter your password!' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                         visibilityToggle
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isLoading} style={{ width: '100%' }}>
                        {isLoading ? 'Logging In...' : 'Login'}
                    </Button>
                </Form.Item>
               
            </Form>
        </div>
    );
};

export default PatientLoginForm;