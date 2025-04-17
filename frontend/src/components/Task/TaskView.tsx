// src/components/Task/TaskView.tsx
import React from 'react';
import { Typography, Descriptions } from 'antd';
import { Task } from '@/services/task/taskSliceAPI';
import dayjs from 'dayjs';

interface TaskViewProps {
    task: Task;
}

const TaskView: React.FC<TaskViewProps> = ({ task }) => {
    const formattedCreatedAt = task.createdAt ? dayjs(task.createdAt).format('MMMM D, YYYY h:mm A') : 'N/A';

    return (
        <div>
            <Typography.Title level={4}>Task Details</Typography.Title>
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Title">{task.title}</Descriptions.Item>
                <Descriptions.Item label="Description">{task.description}</Descriptions.Item>
                 <Descriptions.Item label="Assigned To Name">{task.assignedTo.firstName} {task.assignedTo.lastName}</Descriptions.Item>
                <Descriptions.Item label="Type">{task.type}</Descriptions.Item>
                <Descriptions.Item label="Status">{task.status}</Descriptions.Item>
                <Descriptions.Item label="Priority">{task.priority}</Descriptions.Item>
                <Descriptions.Item label="Created By Name">{task.createdBy.firstName} {task.createdBy.lastName}</Descriptions.Item>
                <Descriptions.Item label="Created At">{formattedCreatedAt}</Descriptions.Item>
            </Descriptions>
        </div>
    );
};

export default TaskView;