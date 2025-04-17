// src/components/Staff/StaffDelete.tsx
'use client';

import React from 'react';
import { Button, message, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Staff } from '@/services/staff/types';
import { useDeleteStaffMutation } from '@/services/staff/staffSliceAPI';
 

interface StaffDeleteProps {
    staff: Staff;
    onSuccess: () => void;
    onCancel: () => void;
}

const StaffDelete: React.FC<StaffDeleteProps> = ({ staff, onSuccess, onCancel }) => {
    const [deleteStaff, { isLoading }] = useDeleteStaffMutation();
    const [messageApi, contextHolder] = message.useMessage();

    const handleDelete = async () => {
        try {
            await deleteStaff(staff._id).unwrap();
            messageApi.success('Staff member deleted successfully');
            onSuccess(); // Notify parent component of successful deletion
        } catch (error: any) {
            messageApi.error(`Failed to delete staff: ${error?.data.message || 'Unknown error'}`);
           
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

export default StaffDelete;