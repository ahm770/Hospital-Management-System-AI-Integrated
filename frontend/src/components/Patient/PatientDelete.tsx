// src/components/Patient/PatientDelete.tsx
'use client';

import React from 'react';
import { Button, message, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Patient } from '@/services/patient/types';
import { useDeletePatientMutation } from '@/services/patient/patientSliceAPI';
 


interface PatientDeleteProps {
    patient: Patient;
    onSuccess: () => void;
    onCancel: () => void;
}

const PatientDelete: React.FC<PatientDeleteProps> = ({ patient, onSuccess, onCancel }) => {
    const [deletePatient, { isLoading }] = useDeletePatientMutation();
    const [messageApi, contextHolder] = message.useMessage();

    const handleDelete = async () => {
        try {
            await deletePatient(patient._id).unwrap();
            messageApi.success('Patient deleted successfully');
            onSuccess(); // Notify parent component of successful deletion
        } catch (error: any) {
            messageApi.error(`Failed to delete patient: ${error?.data.message || 'Unknown error'}`);
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

export default PatientDelete;