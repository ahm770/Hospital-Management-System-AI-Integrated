// src/app/dashboard/staff/super-admin/role/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Button, Modal, message } from 'antd';
import SuperAdminDashboardLayout from '@/components/Layout/SuperAdminDashboardLayout';
import { useAppSelector } from "@/store/store";
import { useRouter } from 'next/navigation';

import RoleList from '@/components/Role/RoleList';
import RoleCreateForm from '@/components/Role/RoleCreateForm';
import RoleEditForm from '@/components/Role/RoleEditForm';
import RoleView from '@/components/Role/RoleView';
import RoleDelete from '@/components/Role/RoleDelete';
import { Role } from '@/services/role/roleSliceAPI';

const { Title } = Typography;

const SuperAdminRoleManagementPage = () => {
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    const user = useAppSelector((state) => state.auth.user);
    const router = useRouter();

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

    const handleEdit = (role: Role) => {
        setSelectedRole(role);
        setIsEditModalVisible(true);
    };

    const handleView = (role: Role) => {
        setSelectedRole(role);
        setIsViewModalVisible(true);
    };

    const handleEditSuccess = () => {
        setIsEditModalVisible(false);
        setSelectedRole(null);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        setSelectedRole(null);
    };

    const handleCancelDelete = () => {
        setIsDeleteModalVisible(false);
        setSelectedRole(null);
    };

    const handleDeleteSuccess = () => {
        setIsDeleteModalVisible(false);
        setSelectedRole(null);
    };

    const handleDelete = (role: Role) => {
        setSelectedRole(role);
        setIsDeleteModalVisible(true);
    };

    return (
        <>
            {contextHolder}
            <SuperAdminDashboardLayout >
                <Title level={3}>Role Management</Title>
                <p>Manage roles here.</p>

                <Button type="primary" onClick={showCreateModal} style={{ marginBottom: 16 }}>
                    Create Role
                </Button>
                <RoleList
                    onEdit={handleEdit}
                    onView={handleView}
                    onDelete={handleDelete}
                />
                <Modal
                    title="Create Role"
                    open={isCreateModalVisible}
                    onCancel={() => setIsCreateModalVisible(false)}
                    footer={null}
                >
                    <RoleCreateForm onSuccess={handleCreateSuccess} />
                </Modal>
                <Modal
                    title="Edit Role"
                    open={isEditModalVisible}
                    onCancel={() => setIsEditModalVisible(false)}
                    footer={null}
                >
                    {selectedRole && (
                        <RoleEditForm
                            role={selectedRole}
                            onSuccess={handleEditSuccess}
                            onCancel={handleEditCancel}
                        />
                    )}
                </Modal>

                <Modal
                    title="View Role"
                    open={isViewModalVisible}
                    onCancel={() => setIsViewModalVisible(false)}
                    footer={null}
                >
                    {selectedRole && (
                        <RoleView role={selectedRole} />
                    )}
                </Modal>
                <Modal
                    title="Delete Role"
                    onCancel={handleCancelDelete}
                    open={isDeleteModalVisible}
                    footer={null}
                >
                    {selectedRole && (
                        <RoleDelete
                            role={selectedRole}
                            onSuccess={handleDeleteSuccess}
                            onCancel={handleCancelDelete}
                        />
                    )}
                </Modal>
            </SuperAdminDashboardLayout>
        </>
    );
};

export default SuperAdminRoleManagementPage;