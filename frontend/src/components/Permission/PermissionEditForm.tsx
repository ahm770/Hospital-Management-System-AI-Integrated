// src/components/Permission/PermissionEditForm.tsx
'use client';

import React, { useEffect } from 'react';
import { useUpdatePermissionMutation, Permission } from '@/services/permission/permissionSliceAPI';
import { Form, Input, Button, message } from 'antd';


interface PermissionEditFormProps {
    permission: Permission;
    onSuccess: () => void;
    onCancel: () => void;
}

const PermissionEditForm: React.FC<PermissionEditFormProps> = ({ permission, onSuccess, onCancel }) => {
    const [updatePermission, { isLoading, isError: isUpdatePermissionError, error: updatePermissionError }] = useUpdatePermissionMutation();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
     
    useEffect(() => {
        form.setFieldsValue({
            action: permission.action,
            description: permission.description,
        });
    }, [form, permission]);

    const onFinish = async (values: any) => {
        try {
            await updatePermission({ id: permission._id, data: values }).unwrap();
            messageApi.success('Permission updated successfully');
            form.resetFields();
            onSuccess();
        } catch (error: any) {
            const errorMessage = `Failed to update permission: ${error?.data.message || 'Unknown error'}`;
            messageApi.error(errorMessage);
        }
    };

    return (     
    <> {contextHolder}
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
                label="Action"
                name="action"
                rules={[{ required: true, message: 'Please enter action!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Please enter description!' }]}
            >
                <Input.TextArea />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                    Update Permission
                </Button>
                <Button onClick={onCancel}>Cancel</Button>
            </Form.Item>
        </Form>
        </>
    );
};

export default PermissionEditForm;