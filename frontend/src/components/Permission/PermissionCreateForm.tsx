// src/components/Permission/PermissionCreateForm.tsx
'use client';

import React from 'react';
import { useCreatePermissionMutation } from '@/services/permission/permissionSliceAPI';
import { Form, Input, Button, message  } from 'antd';


interface PermissionCreateFormProps {
    onSuccess: () => void;
}

const PermissionCreateForm: React.FC<PermissionCreateFormProps> = ({ onSuccess }) => {
    const [createPermission, { isLoading, isError, error }] = useCreatePermissionMutation();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: any) => {
        try {
            await createPermission(values).unwrap();
            messageApi.success('Permission created successfully');
            form.resetFields();
            onSuccess();
        } catch (error: any) {
            const errorMessage = `Failed to create permission: ${error?.data.message || 'Unknown error'}`;
            messageApi.error(errorMessage);
        }
    };

    return (
        <>
            {contextHolder}
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
                        Create Permission
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default PermissionCreateForm;