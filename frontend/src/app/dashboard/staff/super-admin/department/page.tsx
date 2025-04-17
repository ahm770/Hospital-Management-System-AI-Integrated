// src/app/dashboard/staff/super-admin/department/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Button, Modal, message } from 'antd';
import SuperAdminDashboardLayout from '@/components/Layout/SuperAdminDashboardLayout';
import { useAppSelector } from "@/store/store";
import { useRouter } from 'next/navigation';
import DepartmentList from '@/components/Department/DepartmentList';
import DepartmentCreateForm from '@/components/Department/DepartmentCreateForm';
import DepartmentEditForm from '@/components/Department/DepartmentEditForm';
import DepartmentView from '@/components/Department/DepartmentView';
import DepartmentDelete from '@/components/Department/DepartmentDelete';
import { Department } from '@/services/department/departmentSliceAPI';

const { Title } = Typography;

const SuperAdminDepartmentManagementPage = () => {
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

    const user = useAppSelector((state) => state.auth.user);
    const router = useRouter();

    useEffect(() => {
        if (!user || (user.userType !== "Staff" ||   user.role?.name?.toLowerCase() !== "super admin")) {
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

    const handleEdit = (department: Department) => {
        setSelectedDepartment(department);
        setIsEditModalVisible(true);
    };

    const handleView = (department: Department) => {
        setSelectedDepartment(department);
        setIsViewModalVisible(true);
    };

    const handleEditSuccess = () => {
        setIsEditModalVisible(false);
        setSelectedDepartment(null);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        setSelectedDepartment(null);
    };

    const handleCancelDelete = () => {
        setIsDeleteModalVisible(false);
        setSelectedDepartment(null);
    };

    const handleDeleteSuccess = () => {
        setIsDeleteModalVisible(false);
        setSelectedDepartment(null);
    };

    const handleDelete = (department: Department) => {
        setSelectedDepartment(department);
        setIsDeleteModalVisible(true);
    };

    return (
        <>
            {contextHolder}
            <SuperAdminDashboardLayout >
                <Title level={3}>Department Management</Title>
                <p>Manage departments here.</p>

                <Button type="primary" onClick={showCreateModal} style={{ marginBottom: 16 }}>
                    Create Department
                </Button>
                <DepartmentList
                    onEdit={handleEdit}
                    onView={handleView}
                    onDelete={handleDelete} // Pass the handleDelete function
                />
                <Modal
                    title="Create Department"
                    open={isCreateModalVisible}
                    onCancel={() => setIsCreateModalVisible(false)}
                    footer={null}
                >
                    <DepartmentCreateForm onSuccess={handleCreateSuccess} />
                </Modal>
                <Modal
                    title="Edit Department"
                    open={isEditModalVisible}
                    onCancel={() => setIsEditModalVisible(false)}
                    footer={null}
                >
                    {selectedDepartment && (
                        <DepartmentEditForm
                            department={selectedDepartment}
                            onSuccess={handleEditSuccess}
                            onCancel={handleEditCancel}
                        />
                    )}
                </Modal>

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
                <Modal
                    title="Delete Department"
                    onCancel={handleCancelDelete}
                    open={isDeleteModalVisible}
                    footer={null}
                >
                    {selectedDepartment && (
                        <DepartmentDelete
                            department={selectedDepartment}
                            onSuccess={handleDeleteSuccess}
                            onCancel={handleCancelDelete}
                        />
                    )}
                </Modal>
            </SuperAdminDashboardLayout>
        </>
    );
};

export default SuperAdminDepartmentManagementPage;