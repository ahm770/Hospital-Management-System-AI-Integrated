// src/app/dashboard/staff/super-admin/task/my-tasks/page.tsx
'use client';

import React, { useState } from 'react';
import { Typography, Button, Modal } from 'antd';
import ReceptionistDashboardLayout from '@/components/Layout/ReceptionistDashboardLayout';
import MyTaskList from "@/components/Task/MyTaskList"
import { useCompleteTaskMutation } from '@/services/task/taskSliceAPI';
import TaskView from "@/components/Task/TaskView";
import { Task } from '@/services/task/taskSliceAPI';
import TaskEditForm from '@/components/Task/TaskEditForm';
import TaskCreateForm from '@/components/Task/TaskCreateForm';
import TaskComplete from '@/components/Task/TaskComplete';
const { Title } = Typography;

const ReceptionistMyTasksPage = () => {
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isCompleteModalVisible, setIsCompleteModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

     const handleView = (task: Task) => {
            setSelectedTask(task);
            setIsViewModalVisible(true);
        };
        const showCreateModal = () => {
            setIsCreateModalVisible(true);
        };
    
        const handleCreateSuccess = () => {
            setIsCreateModalVisible(false);
        };
           const handleEdit = (task: Task) => {
                setSelectedTask(task);
                setIsEditModalVisible(true);
            };
            const handleEditSuccess = () => {
                setIsEditModalVisible(false);
                setSelectedTask(null);
            };
        
            const handleEditCancel = () => {
                setIsEditModalVisible(false);
                setSelectedTask(null);
            };

            const handleComplete = (task: Task) => {
                setSelectedTask(task);
                setIsCompleteModalVisible(true);
            };

            const handleCompleteSuccess = () => {
                setIsCompleteModalVisible(false);
                setSelectedTask(null);
            };
    return (
        <ReceptionistDashboardLayout >
            <Title level={3}>My Tasks</Title>
            <p>View your assigned tasks here.</p>
         
            <MyTaskList 
              onComplete={handleComplete} 
              onView={handleView}
              onEdit={handleEdit}
              
            />  
             <Modal
                    title="Complete Task"
                    open={isCompleteModalVisible}
                    onCancel={() => setIsCompleteModalVisible(false)}
                    footer={null}
                >
                    {selectedTask && (
                        <TaskComplete task={selectedTask} 
                        onSuccess={handleCompleteSuccess}
                        />
                    )}
                </Modal>
              <Modal
                    title="View Task"
                    open={isViewModalVisible}
                    onCancel={() => setIsViewModalVisible(false)}
                    footer={null}
                >
                    {selectedTask && (
                        <TaskView task={selectedTask} />
                    )}
                </Modal>
                 <Modal
                                title="Create Task"
                                open={isCreateModalVisible}
                                onCancel={() => setIsCreateModalVisible(false)}
                                footer={null}
                            >
                                <TaskCreateForm onSuccess={handleCreateSuccess} />
                            </Modal>
                            <Modal
                                title="Edit Task"
                                open={isEditModalVisible}
                                onCancel={handleEditCancel}
                                footer={null}
                            >
                                {selectedTask && (
                                    <TaskEditForm
                                        task={selectedTask}
                                        onSuccess={handleEditSuccess}
                                        onCancel={handleEditCancel}
                                    />
                                )}
                            </Modal>
        </ReceptionistDashboardLayout>
    );
};

export default ReceptionistMyTasksPage;