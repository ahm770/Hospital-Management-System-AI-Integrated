// src/app/dashboard/staff/super-admin/task/my-tasks/page.tsx
'use client';

import React, { useState } from 'react';
import { Typography, Button, Modal } from 'antd';
import NurseDashboardLayout from '@/components/Layout/NurseDashboardLayout';
import MyTaskList from "@/components/Task/MyTaskList"
 
import TaskView from "@/components/Task/TaskView";
import { Task } from '@/services/task/taskSliceAPI';
 
import TaskComplete from '@/components/Task/TaskComplete';
const { Title } = Typography;

const NurseMyTasksPage = () => {
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  
    const [isCompleteModalVisible, setIsCompleteModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

     const handleView = (task: Task) => {
            setSelectedTask(task);
            setIsViewModalVisible(true);
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
        <NurseDashboardLayout >
            <Title level={3}>My Tasks</Title>
            <p>View your assigned tasks here.</p>
      
            <MyTaskList 
              onComplete={handleComplete} 
              onView={handleView}
              
              
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
                 
                            
        </NurseDashboardLayout>
    );
};

export default NurseMyTasksPage;