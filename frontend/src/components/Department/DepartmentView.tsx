// src/components/Department/DepartmentView.tsx
import React from 'react';
import { Typography, Descriptions } from 'antd';
import { Department } from '@/services/department/departmentSliceAPI';
import { formatDate, formatDateWithTime } from '@/utils/dateUtils';

interface DepartmentViewProps {
    department: Department;
}

const DepartmentView: React.FC<DepartmentViewProps> = ({ department }) => {
    return (
        <div>
            <Typography.Title level={4}>Department Details</Typography.Title>
            <Descriptions bordered column={1}>
                <Descriptions.Item label="ID">{department._id}</Descriptions.Item>
                <Descriptions.Item label="Name">{department.name}</Descriptions.Item>
                <Descriptions.Item label="Description">{department.description}</Descriptions.Item>
                <Descriptions.Item label="Created At">{formatDateWithTime(department.createdAt)}</Descriptions.Item>
                <Descriptions.Item label="Updated At">{formatDateWithTime(department.updatedAt)}</Descriptions.Item>
            </Descriptions>
        </div>
    );
};

export default DepartmentView;