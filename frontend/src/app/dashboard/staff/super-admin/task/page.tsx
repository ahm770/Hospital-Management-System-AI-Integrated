// src/app/dashboard/staff/admin/task/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Button, Modal, message } from 'antd';
import SuperAdminDashboardLayout from '@/components/Layout/SuperAdminDashboardLayout';
import TaskList from '@/components/Task/TaskList';
import TaskCreateForm from '@/components/Task/TaskCreateForm';
import TaskEditForm from '@/components/Task/TaskEditForm';
import TaskView from "@/components/Task/TaskView";
import TaskDelete from "@/components/Task/TaskDelete";
// import TaskComplete from "@/components/Task/TaskComplete";
import { Task } from '@/services/task/taskSliceAPI';
import { useAppSelector } from "@/store/store";
import { useRouter } from 'next/navigation';

const { Title } = Typography;

const SuperAdminTaskManagementPage = () => {
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();
    const user = useAppSelector((state) => state.auth.user);
    

      useEffect(() => {
            if (!user || (user.userType !== "Staff" || user.role?.name?.toLowerCase() !== "super admin")) {
                messageApi.error("You are not authorized to view this page.");
                router.push('/auth');
            }
        }, [user, router]);

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
     const handleDelete = (task: Task) => {
         setSelectedTask(task);
         setIsDeleteModalVisible(true);
     };

    const handleEditSuccess = () => {
        setIsEditModalVisible(false);
        setSelectedTask(null);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        setSelectedTask(null);
    };
      const handleCancelDelete = () => {
          setIsDeleteModalVisible(false);
          setSelectedTask(null);
      };

      const handleDeleteSuccess = () => {
          setIsDeleteModalVisible(false);
          setSelectedTask(null);
      };
 

    return (
        <SuperAdminDashboardLayout >
            <Title level={3}>Task Management</Title>
            <p>Manage tasks here.</p>

            <Button type="primary" onClick={showCreateModal} style={{ marginBottom: 16 }}>
                Create Task
            </Button>

            <TaskList
                onEdit={handleEdit}
                onView={handleView}
                onDelete={handleDelete}
                 
                
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
                 <Modal
                     title="Delete Task"
                     onCancel={handleCancelDelete}
                     open={isDeleteModalVisible}
                     footer={null}
                 >
                     {selectedTask && (
                         <TaskDelete
                             task={selectedTask}
                             onSuccess={handleDeleteSuccess}
                             onCancel={handleCancelDelete}
                         />
                     )}
                 </Modal>
        </SuperAdminDashboardLayout>
    );
};

export default SuperAdminTaskManagementPage;