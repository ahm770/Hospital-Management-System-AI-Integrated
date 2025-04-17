// src/components/Task/TaskComplete.tsx
'use client';

import React from 'react';
import { Button, message } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { useCompleteTaskMutation, Task } from '@/services/task/taskSliceAPI';
import { useAppSelector } from '@/store/store';
import logger from '@/utils/logger';

interface TaskCompleteProps {
    task: Task;
    onSuccess: () => void;
}

const TaskComplete: React.FC<TaskCompleteProps> = ({ task, onSuccess }) => {
    const [completeTask, { isLoading, isError }] = useCompleteTaskMutation();
    const [messageApi, contextHolder] = message.useMessage();
    const user = useAppSelector((state) => state.auth.user);

    // Check if the logged-in user created the task
    const isCreatedByUser = user?._id === task.createdBy._id;

    const handleComplete = async () => {
        logger.silly("in complete task")
        try {
            await completeTask(task._id).unwrap();
            messageApi.success('Task completed successfully!');
            onSuccess(); // Notify the parent component to refresh the task list
        } catch (error: any) {
            console.error(`Error completing task:`, error);
            messageApi.error(`Failed to complete task: ${error?.data?.message || 'An unexpected error occurred.'}`);
        }
    };

    // Do not return complete button if created by user.
    if (isCreatedByUser) {
        return null;
    }

    return (
        <>
            {contextHolder}
            <Button
                icon={<CheckOutlined />}
                onClick={handleComplete}
                loading={isLoading}
                disabled={isLoading || isError}
            >
                Complete
            </Button>
        </>
    );
};

export default TaskComplete;