// src/components/Department/DepartmentDelete.tsx
'use client';

import React from 'react';
import { Button, message, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Department } from '@/services/department/departmentSliceAPI';
import { useDeleteDepartmentMutation } from '@/services/department/departmentSliceAPI';

interface DepartmentDeleteProps {
    department: Department;
    onSuccess: () => void;
    onCancel: () => void;
}

const DepartmentDelete: React.FC<DepartmentDeleteProps> = ({ department, onSuccess, onCancel }) => {
    const [deleteDepartment, { isLoading }] = useDeleteDepartmentMutation();
    const [messageApi, contextHolder] = message.useMessage();

    const handleDelete = async () => {
        try {
            await deleteDepartment(department._id).unwrap();
            messageApi.success('Department deleted successfully');
            onSuccess();
        } catch (error: any) {
            messageApi.error(`Failed to delete department: ${error?.data.message || 'Unknown error'}`);
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

export default DepartmentDelete;