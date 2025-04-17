// src/components/Patient/PatientEditForm.tsx
'use client';

import React, { useEffect } from 'react';
import { useUpdatePatientMutation } from '@/services/patient/patientSliceAPI';
import { Form, Input, Button, Select, message, DatePicker } from 'antd';
import { Patient, PatientUpdateRequest } from '@/services/patient/types';
import dayjs from 'dayjs'
import { disabledFutureDate } from '@/utils/disabledFutureDate';
const { Option } = Select

interface PatientEditFormProps {
    patient: Patient;
    onSuccess: () => void;
    onCancel: () => void;
}

const PatientEditForm: React.FC<PatientEditFormProps> = ({ patient, onSuccess, onCancel }) => {
    const [updatePatient, { isLoading, isError: isUpdatePatientError, error: updatePatientError }] = useUpdatePatientMutation();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    
    useEffect(() => {
        form.setFieldsValue({
            ...patient,
            dob: patient.dob ? dayjs(patient.dob) : null,
        });
    }, [form, patient]);

    const onFinish = async (values: PatientUpdateRequest) => {
        try {
            const formattedDob = values['dob'] ? dayjs(values['dob']).format('YYYY-MM-DD') : "";
            const patientData: PatientUpdateRequest = {
                ...values,
                dob: formattedDob,
            };

            await updatePatient({ id: patient._id, data: patientData }).unwrap();
            messageApi.success('Patient updated successfully');
            onSuccess();
        } catch (error: any) {
            const errorMessage = `Failed to update patient: ${error?.data.message || 'Unknown error'}`;
            messageApi.error(errorMessage);
        }
    };

    const genderOptions = [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Other', label: 'Other' },
    ];

    return (
    <>{contextHolder}
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
                    Update Patient
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={onCancel}>
                    Cancel
                </Button>
            </Form.Item>
        </Form>
        </>
    );
};

export default PatientEditForm;