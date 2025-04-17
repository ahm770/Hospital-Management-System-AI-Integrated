// src/components/Permission/PermissionView.tsx
import React from 'react';
import { Typography, Descriptions } from 'antd';
import { Permission } from '@/services/permission/permissionSliceAPI';

interface PermissionViewProps {
    permission: Permission;
}

const PermissionView: React.FC<PermissionViewProps> = ({ permission }) => {
    return (
        <div>
            <Typography.Title level={4}>Permission Details</Typography.Title>
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Action">{permission.action}</Descriptions.Item>
                <Descriptions.Item label="Description">{permission.description}</Descriptions.Item>
            </Descriptions>
        </div>
    );
};

export default PermissionView;