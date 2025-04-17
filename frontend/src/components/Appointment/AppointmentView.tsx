// src/components/Appointment/AppointmentView.tsx
import React from 'react';
import { Typography, Descriptions } from 'antd';
import { Appointment } from '@/services/appointment/appointmentSliceAPI';
import dayjs from 'dayjs';  

interface AppointmentViewProps {
    appointment: Appointment;
}

const AppointmentView: React.FC<AppointmentViewProps> = ({ appointment }) => {
    const formattedDate = appointment.date ? dayjs(appointment.date).format('MMMM D, YYYY') : 'N/A';

    return (
        <div>
            <Typography.Title level={4}>Appointment Details</Typography.Title>
            <Descriptions bordered column={1}>
            <Descriptions.Item label="Patient ID">
                    {appointment.patient._id}  
                </Descriptions.Item>
                <Descriptions.Item label="Patient">
                    {appointment.patient.firstName} {appointment.patient.lastName}
                </Descriptions.Item>
                <Descriptions.Item label="Doctor ID">
                    {appointment.doctor._id} 
                </Descriptions.Item>
                <Descriptions.Item label="Doctor">
                    {appointment.doctor.firstName} {appointment.doctor.lastName}
                </Descriptions.Item>
                <Descriptions.Item label="Department">
                    {appointment.department.name}
                </Descriptions.Item>
                <Descriptions.Item label="Date">{formattedDate}</Descriptions.Item>
                <Descriptions.Item label="Status">{appointment.status}</Descriptions.Item>
            </Descriptions>
        </div>
    );
};

export default AppointmentView;