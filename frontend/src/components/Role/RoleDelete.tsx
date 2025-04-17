// src/components/Role/roleDelete.tsx
'use client';

import React from 'react';
import { Button, message, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Role } from '@/services/role/roleSliceAPI';
import { useDeleteRoleMutation } from '@/services/role/roleSliceAPI';

interface RoleDeleteProps {
    role: Role;
    onSuccess: () => void;
    onCancel: () => void;
}

const RoleDelete: React.FC<RoleDeleteProps> = ({ role, onSuccess, onCancel }) => {
    const [deleteRole, { isLoading }] = useDeleteRoleMutation();
    const [messageApi, contextHolder] = message.useMessage();

    const handleDelete = async () => {
        try {
            await deleteRole(role._id).unwrap();
            messageApi.success('Role deleted successfully');
            onSuccess();
        } catch (error: any) {
            messageApi.error(`Failed to delete role: ${error?.data.message || 'Unknown error'}`);
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

export default RoleDelete;