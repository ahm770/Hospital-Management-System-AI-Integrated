// src/components/Patient/PatientView.tsx
import React from 'react';
import { Typography, Descriptions } from 'antd';
import { Patient } from '@/services/patient/types';
import { formatDate } from '@/utils/dateUtils';

interface PatientViewProps {
    patient: Patient;
}

const PatientView: React.FC<PatientViewProps> = ({ patient }) => {
     return (
        <div>
            <Typography.Title level={4}>Patient Details</Typography.Title>
            <Descriptions bordered column={1}>
                <Descriptions.Item label="ID">{patient._id}</Descriptions.Item>
                <Descriptions.Item label="First Name">{patient.firstName}</Descriptions.Item>
                <Descriptions.Item label="Last Name">{patient.lastName}</Descriptions.Item>
                <Descriptions.Item label="Email">{patient.email}</Descriptions.Item>
                <Descriptions.Item label="Phone">{patient.phone}</Descriptions.Item>
                <Descriptions.Item label="Date of Birth">{formatDate(patient.dob)}</Descriptions.Item>
                <Descriptions.Item label="Address">{patient.address}</Descriptions.Item>
                <Descriptions.Item label="Gender">{patient.gender}</Descriptions.Item>
            </Descriptions>
        </div>
    );
};

export default PatientView;