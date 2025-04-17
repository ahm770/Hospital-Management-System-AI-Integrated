// src/components/Appointment/AppointmentEditForm.tsx
'use client';

import React, { useEffect } from 'react';
import { useUpdateAppointmentMutation } from '@/services/appointment/appointmentSliceAPI';
import { Form, Input, Button, message, DatePicker, Select } from 'antd';
import { Appointment } from '@/services/appointment/appointmentSliceAPI';
import dayjs from 'dayjs'

interface AppointmentEditFormProps {
    appointment: Appointment;
    onSuccess: () => void;
    onCancel: () => void;
}

const AppointmentEditForm: React.FC<AppointmentEditFormProps> = ({ appointment, onSuccess, onCancel }) => {
    const [updateAppointment, { isLoading }] = useUpdateAppointmentMutation();
    const [form] = Form.useForm();
     const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        form.setFieldsValue({
            patient: appointment.patient._id,
            doctor: appointment.doctor._id,
            department: appointment.department._id,
            date: dayjs(appointment.date),   
            status: appointment.status,
        });
    }, [form, appointment]);

    const onFinish = async (values: any) => {
        try {
                  const formattedDate = values['date'] ? dayjs(values['date']).format('YYYY-MM-DD') : null;
                 const appointmentData = {
                    ...values,
                  date: formattedDate,
                };
            await updateAppointment({ id: appointment._id, data: appointmentData }).unwrap();
          messageApi.success('Appointment updated successfully');
            onSuccess();
        } catch (error: any) {
            const  errorMessage = `Failed to delete appointment: ${error?.data.message || 'Unknown error'}`;
            messageApi.error(errorMessage);
        }
    };

    return (
        <>   {contextHolder}
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Patient"
                    name="patient"
                    rules={[{ required: true, message: 'Please enter patient ID!' }]}
                >
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    label="Doctor"
                    name="doctor"
                    rules={[{ required: true, message: 'Please enter doctor!' }]}
                >
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    label="Department"
                    name="department"
                    rules={[{ required: true, message: 'Please enter department!' }]}
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                  label="Date"
                  name="date"
                  rules={[{ required: true, message: 'Please select a date!' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                  />
                </Form.Item>

                <Form.Item
                  label="Status"
                  name="status"
                  rules={[{ required: true, message: 'Please select a status!' }]}
                >
                  <Select>
                    <Select.Option value="pending">Pending</Select.Option>
                    <Select.Option value="confirmed">Confirmed</Select.Option>
                    <Select.Option value="rescheduled">Rescheduled</Select.Option>
                    <Select.Option value="canceled">Canceled</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        Update Appointment
                    </Button>
                    <Button onClick={onCancel}>Cancel</Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default AppointmentEditForm;