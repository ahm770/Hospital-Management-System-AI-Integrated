// src/components/Permission/PermissionDelete.tsx
'use client';

import React from 'react';
import { Button, message, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Permission } from '@/services/permission/permissionSliceAPI';
import { useDeletePermissionMutation } from '@/services/permission/permissionSliceAPI';

interface PermissionDeleteProps {
    permission: Permission;
    onSuccess: () => void;
    onCancel: () => void;
}

const PermissionDelete: React.FC<PermissionDeleteProps> = ({ permission, onSuccess, onCancel }) => {
    const [deletePermission, { isLoading }] = useDeletePermissionMutation();
    const [messageApi, contextHolder] = message.useMessage();

    const handleDelete = async () => {
        try {
            await deletePermission(permission._id).unwrap();
            messageApi.success('Permission deleted successfully');
            onSuccess();
        } catch (error: any) {
            messageApi.error(`Failed to delete permission: ${error?.data.message || 'Unknown error'}`);
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

export default PermissionDelete;