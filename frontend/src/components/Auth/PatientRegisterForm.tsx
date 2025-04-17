// src/components/auth/PatientRegisterForm.tsx
"use client";

import React, { useState } from 'react';
import { useRegisterMutation } from '@/services/auth/authSliceAPI';
import { Form, Input, Button, Typography, Alert, Select, DatePicker } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import moment from 'moment';
import logger from "@/utils/logger1"

const { Title } = Typography;

const PatientRegisterForm: React.FC = () => {
    const [form] = Form.useForm();
    const [register, { isLoading, isError, error }] = useRegisterMutation();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const onFinish = async (values: any) => {
        try {
            // Format the date of birth using moment.js
            const formattedDob = values['dateOfBirth'] ? moment(values['dateOfBirth']).format('YYYY-MM-DD') : null;

            const registrationData = {
                ...values,
                dob: formattedDob,
                userType: 'Patient', // Set to "Patient"
            };

            const response = await register(registrationData).unwrap();
            logger.silly(JSON.stringify(response))
            console.log(response)
            setSuccessMessage('Patient Registration successful!');
            form.resetFields();
        } catch (err: any) {
            console.error('Registration failed:', err.message || err.error);
        }
    };

    const genderOptions = [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Other', label: 'Other' },
    ];

    const disabledFutureDate = (current: moment.Moment) => {
        // Disable dates after today
        return current && current > moment().endOf('day');
    };

    return (
        <div style={{ padding: 24, minHeight: 360 }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Patient Register</Title>
            {successMessage && <Alert message={successMessage} type="success" showIcon style={{ marginBottom: 24 }} />}
            {isError && error?.data?.message && <Alert message={error.data.message} type="error" showIcon style={{ marginBottom: 24 }} />}
            <Form
                form={form}
                name="register"
                onFinish={onFinish}
                style={{ maxWidth: 400, margin: '0 auto' }}
            >
                <Form.Item
                    name="firstName"
                    rules={[{ required: true, message: 'Please enter your first name!' }]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="First Name" />
                </Form.Item>
                <Form.Item
                    name="lastName"
                    rules={[{ required: true, message: 'Please enter your last name!' }]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Last Name" />
                </Form.Item>
                <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Please enter your email!', type: 'email' }]}
                >
                    <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please enter your password!', min: 6 }]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item
                    name="phone"
                    rules={[{ required: true, message: 'Please enter your phone number!' }]}
                >
                    <Input prefix={<PhoneOutlined className="site-form-item-icon" />} placeholder="Phone Number" />
                </Form.Item>
                 <Form.Item
                    name="address"
                    rules={[{ required: true, message: 'Please enter your address!' }]}
                >
                    <Input prefix={<HomeOutlined className="site-form-item-icon" />} placeholder="Address" />
                </Form.Item>
                  <Form.Item
                    name="gender"
                    rules={[{ required: true, message: 'Please select your gender!' }]}
                >
                  <Select
                    placeholder="Select Gender"
                    options={genderOptions}
                  />
                </Form.Item>
                <Form.Item
                   name="dateOfBirth"
                   rules={[{ required: true, message: 'Please select your date of birth!' }]}
                 >
                    <DatePicker
                     style={{ width: '100%' }}
                     disabledDate={disabledFutureDate}
                     format="YYYY-MM-DD"
                     picker="date"
                     placeholder="Select Date of Birth"
                     />
                 </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isLoading} style={{ width: '100%' }}>
                        {isLoading ? 'Registering...' : 'Register'}
                    </Button>
                </Form.Item>
                <div style={{ textAlign: 'center', marginTop: 12 }}>
                    Already have an account? <Link href="/auth/patient/login">Login</Link>
                </div>
            </Form>
        </div>
    );
};

export default PatientRegisterForm;