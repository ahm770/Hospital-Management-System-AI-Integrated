// src/components/MedicalRecord/MedicalRecordDelete.tsx
'use client';

import React from 'react';
import { Button, message, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { MedicalRecord } from '@/services/medicalRecord/medicalRecordSliceAPI';
import { useDeleteMedicalRecordMutation } from '@/services/medicalRecord/medicalRecordSliceAPI';

interface MedicalRecordDeleteProps {
    record: MedicalRecord;
    onSuccess: () => void;
    onCancel: () => void;
}

const MedicalRecordDelete: React.FC<MedicalRecordDeleteProps> = ({ record, onSuccess, onCancel }) => {
    const [deleteMedicalRecord, { isLoading }] = useDeleteMedicalRecordMutation();
    const [messageApi, contextHolder] = message.useMessage();

    const handleDelete = async () => {
        try {
            await deleteMedicalRecord(record._id).unwrap();
            messageApi.success('Medical record deleted successfully');
            onSuccess();
        } catch (error: any) {
            const  errorMessage = `Failed to delete medical record: ${error?.data.message || 'Unknown error'}`;
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

export default MedicalRecordDelete;