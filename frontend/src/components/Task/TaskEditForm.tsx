// src/components/Task/TaskEditForm.tsx
'use client';

import React, { useEffect } from 'react';
import { useUpdateTaskMutation, Task } from '@/services/task/taskSliceAPI';
import { Form, Input, Button, Select, message } from 'antd';

interface TaskEditFormProps {
    task: Task;
    onSuccess: () => void;
    onCancel: () => void;
}

const TaskEditForm: React.FC<TaskEditFormProps> = ({ task, onSuccess, onCancel }) => {
    const [updateTask, { isLoading }] = useUpdateTaskMutation();
     const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            title: task.title,
            description: task.description,
            assignedTo: task.assignedTo._id,
            status: task.status,
            priority: task.priority,
        });
    }, [form, task]);

    const onFinish = async (values: any) => {
        try {
            await updateTask({ id: task._id, data: values }).unwrap();
           messageApi.success('Task updated successfully');
            onSuccess();
        } catch (error: any) {
            messageApi.error(`Failed to update task: ${error?.data.message || 'Unknown error'}`);
           
        }
    };

    return (
        <>   {contextHolder}
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
                    label="Assigned To (User ID)"
                    name="assignedTo"
                    rules={[{ required: true, message: 'Please enter user ID!' }]}
                >
                    <Input disabled />
                    
                </Form.Item>
                <Form.Item
                    label="Status"
                    name="status"
                    rules={[{ required: true, message: 'Please select a status!' }]}
                >
                    <Select>
                        <Select.Option value="pending">Pending</Select.Option>
                        <Select.Option value="in_progress">In Progress</Select.Option>
                        <Select.Option value="completed">Completed</Select.Option>
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
                        Update Task
                    </Button>
                    <Button onClick={onCancel}>Cancel</Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default TaskEditForm;