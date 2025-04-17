// src/components/role/RoleCreateForm.tsx
'use client';

import React, { useState } from 'react';
import { useCreateRoleMutation } from '@/services/role/roleSliceAPI';
import { useGetPermissionsQuery, Permission } from '@/services/permission/permissionSliceAPI';
import { Form, Input, Button, Select, message } from 'antd';

interface RoleCreateFormProps {
    onSuccess: () => void;
}

const RoleCreateForm: React.FC<RoleCreateFormProps> = ({ onSuccess }) => {
    const [createRole, { isLoading, isError: isCreateRoleError, error: createRoleError }] = useCreateRoleMutation();
    const [form] = Form.useForm();
    const { data: permissions, isLoading: isPermissionsLoading, isError: isPermissionsError } = useGetPermissionsQuery({});
    const [messageApi, contextHolder] = message.useMessage();
    
    const onFinish = async (values: any) => {
        try {
            await createRole(values).unwrap();
            messageApi.success('Role created successfully');
            form.resetFields();
            onSuccess();
        } catch (error: any) {
            const errorMessage = `Failed to create role: ${error?.data.message || 'Unknown error'}`;
            messageApi.error(errorMessage);
        }
    };

    return (
        <>
         {contextHolder}
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please enter role name!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Permissions"
                name="permissions"
                rules={[{ required: true, message: 'Please select permissions!' }]}
            >
                <Select
                    mode="multiple"
                    placeholder="Select Permissions"
                    loading={isPermissionsLoading}
                    options={permissions?.permissions?.map((permission: Permission) => ({
                        label: `${permission.action} - ${permission.description}`,
                        value: permission._id,
                    }))}
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                    Create Role
                </Button>
            </Form.Item>
        </Form>
        </>
    );
};

export default RoleCreateForm;