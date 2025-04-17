// src/app/dashboard/staff/super-admin/medical-record/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Button, Modal, message } from 'antd';
import SuperAdminDashboardLayout from '@/components/Layout/SuperAdminDashboardLayout';
import { useAppSelector } from "@/store/store";
import { useRouter } from 'next/navigation';

// Import Medical Record Components
import MedicalRecordList from '@/components/MedicalRecord/MedicalRecordList';
import MedicalRecordCreateForm from '@/components/MedicalRecord/MedicalRecordCreateForm';
import MedicalRecordEditForm from '@/components/MedicalRecord/MedicalRecordEditForm';
import MedicalRecordView from '@/components/MedicalRecord/MedicalRecordView';   
import MedicalRecordDelete from '@/components/MedicalRecord/MedicalRecordDelete';
import { MedicalRecord } from '@/services/medicalRecord/medicalRecordSliceAPI';

const { Title } = Typography;

const SuperAdminMedicalRecordManagementPage = () => {
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);  
    const [messageApi, contextHolder] = message.useMessage();

    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [selectedMedicalRecord, setSelectedMedicalRecord] = useState<MedicalRecord | null>(null);

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

    const handleEdit = (record: MedicalRecord) => {
        setSelectedMedicalRecord(record);
        setIsEditModalVisible(true);
    };

      const handleView = (record: MedicalRecord) => {
        setSelectedMedicalRecord(record);
        setIsViewModalVisible(true);
    };

    const handleEditSuccess = () => {
        setIsEditModalVisible(false);
        setSelectedMedicalRecord(null);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        setSelectedMedicalRecord(null);
    };

    const handleCancelDelete = () => {
        setIsDeleteModalVisible(false);
        setSelectedMedicalRecord(null);
    };

    const handleDeleteSuccess = () => {
        setIsDeleteModalVisible(false);
        setSelectedMedicalRecord(null);
    };

    const handleDelete = (record: MedicalRecord) => {
        setSelectedMedicalRecord(record);
        setIsDeleteModalVisible(true);
    };

    return (
        <>
            {contextHolder}
            <SuperAdminDashboardLayout >
                <Title level={3}>Medical Record Management</Title>
                <p>Manage Medical Records here.</p>

                
                <MedicalRecordList onEdit={handleEdit} onView={handleView} onDelete={handleDelete}/>
                <Modal
                    title="Create Medical Record"
                    open={isCreateModalVisible}
                    onCancel={() => setIsCreateModalVisible(false)}
                    footer={null}
                >
                    <MedicalRecordCreateForm onSuccess={handleCreateSuccess} />
                </Modal>
                <Modal
                    title="Edit Medical Record"
                    open={isEditModalVisible}
                    onCancel={() => setIsEditModalVisible(false)}
                    footer={null}
                >
                    {selectedMedicalRecord && (
                        <MedicalRecordEditForm
                            record={selectedMedicalRecord}
                            onSuccess={handleEditSuccess}
                            onCancel={handleEditCancel}
                        />
                    )}
                </Modal>
                <Modal
                    title="View Medical Record"
                    open={isViewModalVisible}
                    onCancel={() => setIsViewModalVisible(false)}
                    footer={null}
                >
                    {selectedMedicalRecord && (
                        <MedicalRecordView record={selectedMedicalRecord} />
                    )}
                </Modal>
                 <Modal
                    title="Delete Medical Record"
                    onCancel={handleCancelDelete}
                    open={isDeleteModalVisible}
                    footer={null}
                >
                    {selectedMedicalRecord && (
                        <MedicalRecordDelete
                            record={selectedMedicalRecord}
                            onSuccess={handleDeleteSuccess}
                            onCancel={handleCancelDelete}
                        />
                    )}
                </Modal>
            </SuperAdminDashboardLayout>
        </>
    );
};

export default SuperAdminMedicalRecordManagementPage;