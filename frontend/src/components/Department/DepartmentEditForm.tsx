// src/components/Department/DepartmentEditForm.tsx
'use client';

import React, { useEffect } from 'react';
import { useUpdateDepartmentMutation } from '@/services/department/departmentSliceAPI';
import { Form, Input, Button, message } from 'antd';
import { Department, DepartmentUpdateRequest } from '@/services/department/departmentSliceAPI';

interface DepartmentEditFormProps {
    department: Department;
    onSuccess: () => void;
    onCancel: () => void;
}

const DepartmentEditForm: React.FC<DepartmentEditFormProps> = ({ department, onSuccess, onCancel }) => {
    const [updateDepartment, { isLoading, isError: isUpdateDepartmentError, error: updateDepartmentError }] = useUpdateDepartmentMutation();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        form.setFieldsValue({
            name: department.name,
            description: department.description,
        });
    }, [form, department]);

    const onFinish = async (values: any) => {
        try {
            const departmentData: DepartmentUpdateRequest = {
                name: values.name,
                description: values.description,
            };

            await updateDepartment({ id: department._id, data: departmentData }).unwrap();
            messageApi.success('Department updated successfully');
            onSuccess();
        } catch (error: any) {
            const  errorMessage = `Failed to update department: ${error?.data.message || 'Unknown error'}`;
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
                    Update Department
                </Button>
                <Button onClick={onCancel}>Cancel</Button>
            </Form.Item>
        </Form>
        </>
    );
};

export default DepartmentEditForm;