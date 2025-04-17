// src/components/Auth/PasswordResetForm.tsx
"use client";

import React, { useState } from 'react';
import { useResetPasswordMutation } from '@/services/auth/authSliceAPI';
import { Form, Input, Button, Typography, message, Card } from 'antd'; // Added Card
import { LockOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface PasswordResetFormProps { }

const PasswordResetForm: React.FC<PasswordResetFormProps> = () => {
    const [resetPassword, { isLoading, isError, error, isSuccess }] = useResetPasswordMutation();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: any) => {
        try {
            await resetPassword({ currentPassword: values.currentPassword, newPassword: values.newPassword }).unwrap();
            messageApi.success('Password reset successfully!');
            form.resetFields();
        } catch (err: any) {
            console.error('Password reset failed:', err.data.message || err.error);
            messageApi.error((err as any)?.data?.message || 'An unexpected error occurred.');
        }
    };

    return (
        <>
            {contextHolder}
            <Card
                title={<Title level={3} style={{ textAlign: 'center', margin: 0 }}>Reset Password</Title>}
                style={{ maxWidth: 600, margin: 'auto' }} // Centered Card
            >
                <Form
                    form={form}
                    name="reset-password"
                    onFinish={onFinish}
                    layout="vertical" // Added layout="vertical" for better spacing
                >
                    <Form.Item
                        label="Current Password"
                        name="currentPassword"
                        rules={[{ required: true, message: 'Please enter your current password!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            placeholder="Current Password"
                        />
                    </Form.Item>
                    <Form.Item
                        label="New Password"
                        name="newPassword"
                        rules={[
                            { required: true, message: 'Please enter your new password!', min: 6 },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            placeholder="New Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isLoading} style={{ width: '100%' }}>
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </>
    );
};

export default PasswordResetForm;