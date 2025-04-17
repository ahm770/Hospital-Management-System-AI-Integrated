// src/components/auth/StaffLoginForm.tsx
"use client";

import React from 'react';
import { useLoginMutation } from '@/services/auth/authSliceAPI';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Typography, Alert, message } from 'antd';
import { LockOutlined, MailOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import Link from 'next/link';
import { useAppDispatch } from '@/store/store';
import logger from "@/utils/logger";

const { Title } = Typography;

const StaffLoginForm: React.FC = () => {
    const [login, { isLoading, isError, error }] = useLoginMutation();
    const router = useRouter();
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();

    const onFinish = async (values: any) => {
        try {
            const response = await login(values).unwrap();
            logger.silly("response::", response)

            if (response.user.userType !== "Staff" || !response.user.role) {
                message.error("Login failed: Invalid user type or staff role. Please contact support.");
                return; // Early return for non-staff users
            }

            if (typeof response.user.role.name !== 'string') {
                console.warn('role.name is not a string:', response.user.role);
                message.error("Login failed: Invalid staff role name. Please contact support.");
                return; // Prevent further execution if role.name is not a string
            }

            const roleName = response.user.role.name.toLowerCase();

            switch (roleName) {
                case "super admin":
                    router.push(`/dashboard/staff/super-admin`);
                    break;
                case "admin":
                    router.push(`/dashboard/staff/admin`);
                    break;
                default:
                    router.push(`/dashboard/staff/${roleName}`);
                    break;
            }

        } catch (err: any) {
            console.error('Staff Login failed:', err.data.message || err.error);
            message.error(`Staff Login failed: ${err.data.message || err.error || "Unknown error."}`); // Show error message
        }
    };

    return (
        <div style={{ padding: 24, minHeight: 360 }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Staff Login</Title>
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
                    <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Staff Email" />
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

export default StaffLoginForm;