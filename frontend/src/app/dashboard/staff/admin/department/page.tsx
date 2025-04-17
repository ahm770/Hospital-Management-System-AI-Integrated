// src/app/dashboard/staff/admin/department/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Button, Modal, message } from 'antd';
import AdminDashboardLayout from '@/components/Layout/AdminDashboardLayout';
import { useAppSelector } from "@/store/store";
import { useRouter } from 'next/navigation';
import DepartmentList from '@/components/Department/DepartmentList';
import DepartmentView from '@/components/Department/DepartmentView';
import { Department } from '@/services/department/departmentSliceAPI';

const { Title } = Typography;

const AdminDepartmentManagementPage = () => {
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

    const user = useAppSelector((state) => state.auth.user);
    const router = useRouter();

    useEffect(() => {
        if (!user || (user.userType !== "Staff" || user.role?.name?.toLowerCase() !== "admin" )) {
            messageApi.error("You are not authorized to view this page.");
            router.push('/auth');
        }
    }, [user, router]);

   

    const handleView = (department: Department) => {
        setSelectedDepartment(department);
        setIsViewModalVisible(true);
    };

    
   
   

    return (
        <>
            {contextHolder}
            <AdminDashboardLayout >
                <Title level={3}>Department Management</Title>
                <p>Manage departments here.</p>

              
                <DepartmentList
                    
                    onView={handleView}
                   
                />
          
                
                <Modal
                    title="View Department"
                    open={isViewModalVisible}
                    onCancel={() => setIsViewModalVisible(false)}
                    footer={null}
                >
                    {selectedDepartment && (
                        <DepartmentView department={selectedDepartment} />
                    )}
                </Modal>
             
            </AdminDashboardLayout>
        </>
    );
};

export default AdminDepartmentManagementPage;