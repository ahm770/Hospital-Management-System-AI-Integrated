// src/components/Department/DepartmentCreateForm.tsx
'use client';

import React from 'react';
import { useCreateDepartmentMutation } from '@/services/department/departmentSliceAPI';
import { Form, Input, Button, message } from 'antd';
import { DepartmentCreateRequest } from '@/services/department/departmentSliceAPI';

interface DepartmentCreateFormProps {
    onSuccess: () => void;
}

const DepartmentCreateForm: React.FC<DepartmentCreateFormProps> = ({ onSuccess }) => {
    const [createDepartment, { isLoading, isError: isCreateDepartmentError, error: createDepartmentError }] = useCreateDepartmentMutation();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: DepartmentCreateRequest) => {
        try {
            await createDepartment(values).unwrap();
            messageApi.success('Department created successfully');
            form.resetFields();
            onSuccess();
        } catch (error: any) {
            const errorMessage = `Failed to create department: ${error?.data.message || 'Unknown error'}`;
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
                rules={[{ required: true, message: 'Please enter department name!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Please enter department description!' }]}
            >
                <Input.TextArea />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                    Create Department
                </Button>
            </Form.Item>
        </Form>
        </>
    );
};

export default DepartmentCreateForm;