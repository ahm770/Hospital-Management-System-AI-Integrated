// src/components/Task/TaskDelete.tsx
'use client';

import React from 'react';
import { Button, message, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Task } from '@/services/task/taskSliceAPI';
import { useDeleteTaskMutation } from '@/services/task/taskSliceAPI';

interface TaskDeleteProps {
    task: Task;
    onSuccess: () => void;
    onCancel: () => void;
}

const TaskDelete: React.FC<TaskDeleteProps> = ({ task, onSuccess, onCancel }) => {
    const [deleteTask, { isLoading }] = useDeleteTaskMutation();
     const [messageApi, contextHolder] = message.useMessage();

    const handleDelete = async () => {
        try {
            await deleteTask(task._id).unwrap();
             messageApi.success('Task deleted successfully');
            onSuccess();
        } catch (error: any) {
            messageApi.error(`Failed to delete task: ${error?.data.message || 'Unknown error'}`);
            
        }
    };

    return (
        <> {contextHolder}
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

export default TaskDelete;