// src/app/dashboard/staff/admin/staff/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Button, Modal, message } from 'antd';
import AdminDashboardLayout from '@/components/Layout/AdminDashboardLayout';
import StaffList from '@/components/Staff/StaffList';
import StaffCreateForm from '@/components/Staff/StaffCreateForm';
import StaffEditForm from '@/components/Staff/StaffEditForm';
import StaffView from '@/components/Staff/StaffView';
import StaffDelete from '@/components/Staff/StaffDelete';
import { Staff } from '@/services/staff/types';
import { useAppSelector } from "@/store/store";
import { useRouter } from 'next/navigation';

const { Title } = Typography;

const AdminStaffManagementPage = () => {
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);  
    const user = useAppSelector((state) => state.auth.user);
    const router = useRouter();

    useEffect(() => {
        if (!user || (user.userType !== "Staff" || user.role?.name?.toLowerCase() !== "admin"  )) {
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

    const handleView = (staff: Staff) => {
        setSelectedStaff(staff);
        setIsViewModalVisible(true);
    };

    const handleEdit = (staff: Staff) => {
        setSelectedStaff(staff);
        setIsEditModalVisible(true);
    };

    const handleEditSuccess = () => {
        setIsEditModalVisible(false);
        setSelectedStaff(null);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        setSelectedStaff(null);
    };
  
 
 

    return (
        <>
            {contextHolder}
            <AdminDashboardLayout  >
                <Title level={3}>Staff Management</Title>
                <p>Manage Staff</p>

                <Button type="primary" onClick={showCreateModal} style={{ marginBottom: 16 }}>
                    Create Staff
                </Button>
                <StaffList
                    onView={handleView}
                    onEdit={handleEdit}
                  
                />
                <Modal
                    title="Create Staff"
                    open={isCreateModalVisible}
                    onCancel={() => setIsCreateModalVisible(false)}
                    footer={null}
                >
                    <StaffCreateForm onSuccess={handleCreateSuccess} />
                </Modal>
                <Modal
                    title="Edit Staff"
                    open={isEditModalVisible}
                    onCancel={handleEditCancel}
                    footer={null}
                >
                    {selectedStaff && (
                        <StaffEditForm
                            staff={selectedStaff}
                            onSuccess={handleEditSuccess}
                            onCancel={handleEditCancel}
                        />
                    )}
                </Modal>
                <Modal
                    title="View Staff"
                    open={isViewModalVisible}
                    onCancel={() => setIsViewModalVisible(false)}
                    footer={null}
                >
                    {selectedStaff && (
                        <StaffView staff={selectedStaff} />
                    )}
                </Modal>
                  
               
            </AdminDashboardLayout>
        </>
    );
};

export default AdminStaffManagementPage;