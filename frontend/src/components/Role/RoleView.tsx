// src/components/role/RoleView.tsx
import React from 'react';
import { Typography, Descriptions } from 'antd';
import { Role } from '@/services/role/roleSliceAPI';

interface RoleViewProps {
    role: Role;
}

const RoleView: React.FC<RoleViewProps> = ({ role }) => {
    return (
        <div>
            <Typography.Title level={4}>Role Details</Typography.Title>
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Name">{role.name}</Descriptions.Item>
                <Descriptions.Item label="Permissions">
                    {role.permissions?.map(perm => perm.action).join(', ')}
                </Descriptions.Item>
            </Descriptions>
        </div>
    );
};

export default RoleView;