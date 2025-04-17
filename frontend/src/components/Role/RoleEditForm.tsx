// src/components/role/RoleEditForm.tsx
'use client';

import React, { useEffect } from 'react';
import { useUpdateRoleMutation } from '@/services/role/roleSliceAPI';
import { useGetPermissionsQuery, Permission } from '@/services/permission/permissionSliceAPI';
import { Form, Input, Button, Select, message } from 'antd';
import { Role } from '@/services/role/roleSliceAPI';

interface RoleEditFormProps {
    role: Role;
    onSuccess: () => void;
    onCancel: () => void;
}

const RoleEditForm: React.FC<RoleEditFormProps> = ({ role, onSuccess, onCancel }) => {
    const [updateRole, { isLoading, isError: isUpdateRoleError, error: updateRoleError }] = useUpdateRoleMutation();
    const [form] = Form.useForm();
    const { data: permissionsData, isLoading: isPermissionsLoading, isError: isPermissionsError } = useGetPermissionsQuery({});
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        form.setFieldsValue({
            name: role.name,
            permissions: role.permissions?.map(perm => perm._id), // Set initial permission IDs
        });
    }, [form, role]);

    const onFinish = async (values: any) => {
        try {
            await updateRole({ id: role._id, data: values }).unwrap();
            messageApi.success('Role updated successfully');
            onSuccess();
        } catch (error: any) {
            const errorMessage = `Failed to update role: ${error?.data.message || 'Unknown error'}`;
            messageApi.error(errorMessage);
        }
    };

    const permissions = permissionsData?.permissions || [];

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
                        options={permissions.map((permission: Permission) => ({
                            label: `${permission.action} - ${permission.description}`,
                            value: permission._id, // Use permission._id as the value
                        }))}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        Update Role
                    </Button>
                    <Button onClick={onCancel}>Cancel</Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default RoleEditForm;