// src/app/dashboard/staff/admin/task/page.tsx
'use client';

import React, { useState } from 'react';
import { Typography, Button, Modal } from 'antd';
import AdminDashboardLayout from '@/components/Layout/AdminDashboardLayout';
import TaskList from '@/components/Task/TaskList';
import TaskCreateForm from '@/components/Task/TaskCreateForm';
import TaskEditForm from '@/components/Task/TaskEditForm';
import TaskView from "@/components/Task/TaskView";
import { Task } from '@/services/task/taskSliceAPI';

const { Title } = Typography;

const AdminTaskManagementPage = () => {
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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

    const handleView = (task: Task) => {
        setSelectedTask(task);
        setIsViewModalVisible(true);
    };
  

    const handleEditSuccess = () => {
        setIsEditModalVisible(false);
        setSelectedTask(null);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        setSelectedTask(null);
    };
    

    return (
        <AdminDashboardLayout >
            <Title level={3}>Task Management</Title>
            <p>Manage tasks here.</p>

            <Button type="primary" onClick={showCreateModal} style={{ marginBottom: 16 }}>
                Create Task
            </Button>

            <TaskList
                onEdit={handleEdit}
                onView={handleView}
  
            />

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
                 
        </AdminDashboardLayout>
    );
};

export default AdminTaskManagementPage;