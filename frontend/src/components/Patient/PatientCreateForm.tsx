// src/components/Patient/PatientCreateForm.tsx
'use client';

import React from 'react';
import { useCreatePatientMutation } from '@/services/patient/patientSliceAPI';
import { Form, Input, Button, Select, message, DatePicker } from 'antd';
import { PatientCreateRequest } from '@/services/patient/types'; // Ensure this type exists
import dayjs from 'dayjs'

interface PatientCreateFormProps {
    onSuccess: () => void;
}

const PatientCreateForm: React.FC<PatientCreateFormProps> = ({ onSuccess }) => {
    const [createPatient, { isLoading, isError: isCreatePatientError, error: createPatientError }] = useCreatePatientMutation();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
   
    const onFinish = async (values: PatientCreateRequest) => {
        try {
            const formattedDob = values['dob'] ? dayjs(values['dob']).format('YYYY-MM-DD') : "";
            const patientData = {
                ...values,
                dob: formattedDob,
            };
            await createPatient(patientData).unwrap();
            messageApi.success('Patient created successfully');
            form.resetFields();
            onSuccess();
        } catch (error: any) {
         const errorMessage = `Failed to create patient: ${error?.data.message || 'Unknown error'}`;
            messageApi.error(errorMessage);
        }
    };

     const disabledFutureDate = (current: dayjs.Dayjs ) => {
            // Disable dates after today
            return current && current > dayjs().endOf('day');
        };
   const genderOptions = [
        { value: 'Male', label: 'Male' },
        { value: 'Other', label: 'Other' },
        { value: 'Female', label: 'Female' },
    ];

    return (<> {contextHolder}
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: 'Please enter first name!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: 'Please enter last name!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please enter email!', type: 'email' }]}
            >
                <Input />
            </Form.Item>
             <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: 'Please select gender!' }]}
            >
              <Select
                placeholder="Select Gender"
                options={genderOptions}
              />
            </Form.Item>
            <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true, message: 'Please enter your phone number!' }]}
            >
                <Input  placeholder="Phone Number" />
            </Form.Item>
            <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: 'Please enter your address!' }]}
            >
                <Input  placeholder="Address" />
            </Form.Item>
            <Form.Item
                label="Date of Birth"
                name="dob"
                rules={[{ required: true, message: 'Please select a date of birth!' }]}
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
                <Button type="primary" htmlType="submit" loading={isLoading}>
                    Create Patient
                </Button>
            </Form.Item>
        </Form>
        </>
    );
};

export default PatientCreateForm;