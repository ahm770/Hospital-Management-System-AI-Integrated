// src/components/Appointment/AppointmentDelete.tsx
'use client';

import React from 'react';
import { Button, message, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Appointment } from '@/services/appointment/appointmentSliceAPI';
import { useDeleteAppointmentMutation } from '@/services/appointment/appointmentSliceAPI';

interface AppointmentDeleteProps {
    appointment: Appointment;
    onSuccess: () => void;
    onCancel: () => void;
}

const AppointmentDelete: React.FC<AppointmentDeleteProps> = ({ appointment, onSuccess, onCancel }) => {
    const [deleteAppointment, { isLoading }] = useDeleteAppointmentMutation();
    const [messageApi, contextHolder] = message.useMessage();

    const handleDelete = async () => {
        try {
            await deleteAppointment(appointment._id).unwrap();
            messageApi.success('Appointment deleted successfully');
            onSuccess();
        } catch (error: any) {
            const  errorMessage = `Failed to delete appointment: ${error?.data.message || 'Unknown error'}`;
            messageApi.error(errorMessage);
        }
    };

    return (
        <>
            {contextHolder}
            <Space>
                <Button danger icon={<DeleteOutlined />} loading={isLoading} onClick={handleDelete}>
                    Delete
                </Button>
                <Button onClick={onCancel}>
                    Cancel
                </Button>
            </Space>
        </>
    );
};

export default AppointmentDelete;