// src/app/dashboard/staff/super-admin/permission/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Button, Modal, message } from 'antd';
import SuperAdminDashboardLayout from '@/components/Layout/SuperAdminDashboardLayout';
import { useAppSelector } from "@/store/store";
import { useRouter } from 'next/navigation';

import PermissionList from '@/components/Permission/PermissionList';
import PermissionCreateForm from '@/components/Permission/PermissionCreateForm';
import PermissionEditForm from '@/components/Permission/PermissionEditForm';
import PermissionView from '@/components/Permission/PermissionView';
import PermissionDelete from '@/components/Permission/PermissionDelete';
import { Permission } from '@/services/permission/permissionSliceAPI';

const { Title } = Typography;

const SuperAdminPermissionManagementPage = () => {
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);

    const user = useAppSelector((state) => state.auth.user);
    const router = useRouter();

    useEffect(() => {
        if (!user || (user.userType !== "Staff" ||  user.role?.name?.toLowerCase() !== "super admin")) {
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

    const handleEdit = (permission: Permission) => {
        setSelectedPermission(permission);
        setIsEditModalVisible(true);
    };

    const handleView = (permission: Permission) => {
        setSelectedPermission(permission);
        setIsViewModalVisible(true);
    };

    const handleEditSuccess = () => {
        setIsEditModalVisible(false);
        setSelectedPermission(null);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        setSelectedPermission(null);
    };

    const handleCancelDelete = () => {
        setIsDeleteModalVisible(false);
        setSelectedPermission(null);
    };

    const handleDeleteSuccess = () => {
        setIsDeleteModalVisible(false);
        setSelectedPermission(null);
    };

    const handleDelete = (permission: Permission) => {
        setSelectedPermission(permission);
        setIsDeleteModalVisible(true);
    };

    return (
        <>
            {contextHolder}
            <SuperAdminDashboardLayout >
                <Title level={3}>Permission Management</Title>
                <p>Manage permissions here.</p>

                <Button type="primary" onClick={showCreateModal} style={{ marginBottom: 16 }}>
                    Create Permission
                </Button>
                <PermissionList
                    onEdit={handleEdit}
                    onView={handleView}
                    onDelete={handleDelete} 
                />
                <Modal
                    title="Create Permission"
                    open={isCreateModalVisible}
                    onCancel={() => setIsCreateModalVisible(false)}
                    footer={null}
                >
                    <PermissionCreateForm onSuccess={handleCreateSuccess} />
                </Modal>
                <Modal
                    title="Edit Permission"
                    open={isEditModalVisible}
                    onCancel={() => setIsEditModalVisible(false)}
                    footer={null}
                >
                    {selectedPermission && (
                        <PermissionEditForm
                            permission={selectedPermission}
                            onSuccess={handleEditSuccess}
                            onCancel={handleEditCancel}
                        />
                    )}
                </Modal>

                <Modal
                    title="View Permission"
                    open={isViewModalVisible}
                    onCancel={() => setIsViewModalVisible(false)}
                    footer={null}
                >
                    {selectedPermission && (
                        <PermissionView permission={selectedPermission} />
                    )}
                </Modal>
                <Modal
                    title="Delete Permission"
                    onCancel={handleCancelDelete}
                    open={isDeleteModalVisible}
                    footer={null}
                >
                    {selectedPermission && (
                        <PermissionDelete
                            permission={selectedPermission}
                            onSuccess={handleDeleteSuccess}
                            onCancel={handleCancelDelete}
                        />
                    )}
                </Modal>
            </SuperAdminDashboardLayout>
        </>
    );
};

export default SuperAdminPermissionManagementPage;