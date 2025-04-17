// src/components/Shift/ShiftDelete.tsx
'use client';

import React from 'react';
import { Button, message, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Shift } from '@/services/shift/shiftSliceAPI';
import { useDeleteShiftMutation } from '@/services/shift/shiftSliceAPI';

interface ShiftDeleteProps {
    shift: Shift;
    onSuccess: () => void;
    onCancel: () => void;
}

const ShiftDelete: React.FC<ShiftDeleteProps> = ({ shift, onSuccess, onCancel }) => {
    const [deleteShift, { isLoading }] = useDeleteShiftMutation();
    const [messageApi, contextHolder] = message.useMessage();

    const handleDelete = async () => {
        try {
            await deleteShift(shift._id).unwrap();
            messageApi.success('Shift deleted successfully');
            onSuccess();
        } catch (error: any) {
            messageApi.error(`Failed to delete shift: ${error?.data.message || 'Unknown error'}`);
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

export default ShiftDelete;