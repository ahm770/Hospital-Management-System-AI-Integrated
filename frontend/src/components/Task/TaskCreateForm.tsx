// src/components/Task/TaskCreateForm.tsx
'use client';

import React from 'react';
import { useCreateTaskMutation } from '@/services/task/taskSliceAPI';
import { Form, Input, Button, Select, message } from 'antd';
import { TaskCreateRequest } from '@/services/task/taskSliceAPI';
import logger from "@/utils/logger"

interface TaskCreateFormProps {
    onSuccess: () => void;
}

const TaskCreateForm: React.FC<TaskCreateFormProps> = ({ onSuccess }) => {
    const [createTask, { isLoading }] = useCreateTaskMutation();
    const [form] = Form.useForm();
     const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: TaskCreateRequest) => {
        try {
            await createTask(values).unwrap();
           messageApi.success('Task created successfully');
            form.resetFields();
            onSuccess();
        } catch (error: any) {
            logger.error(error)
            const  errorMessage = `Failed to create task: ${error?.data.message || 'Unknown error'}`;
            messageApi.error(errorMessage);
         }
    };

    return (
        <>  {contextHolder}
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: 'Please enter task title!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please enter task description!' }]}
                >
                    <Input.TextArea />
                </Form.Item>
                <Form.Item
                    label="Assigned To (Patient ID)"
                    name="assignedTo"
                    rules={[{ required: true, message: 'Please enter patient ID!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Type"
                    name="type"
                    rules={[{ required: true, message: 'Please select a task type!' }]}
                >
                    <Select>
                      
                        <Select.Option value="medical_record">Medical Record</Select.Option>
                        <Select.Option value="discharge">Discharge</Select.Option>
                        <Select.Option value="prescription">Prescription</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Priority"
                    name="priority"
                    rules={[{ required: true, message: 'Please select a priority!' }]}
                >
                    <Select>
                        <Select.Option value="low">Low</Select.Option>
                        <Select.Option value="medium">Medium</Select.Option>
                        <Select.Option value="high">High</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        Create Task
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default TaskCreateForm;