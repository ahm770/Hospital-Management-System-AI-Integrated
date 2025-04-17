// src/app/dashboard/staff/doctor/medical-record/page.tsx
'use client';

import React, { useState } from 'react';
import { Typography, Modal, Button } from 'antd';
import DoctorDashboardLayout from '@/components/Layout/DoctorDashboardLayout';
import MedicalRecordList from '@/components/MedicalRecord/MedicalRecordList';
import MedicalRecordCreateForm from '@/components/MedicalRecord/MedicalRecordCreateForm';
import MedicalRecordEditForm from '@/components/MedicalRecord/MedicalRecordEditForm';
import MedicalRecordView from '@/components/MedicalRecord/MedicalRecordView';
import { MedicalRecord } from '@/services/medicalRecord/medicalRecordSliceAPI';


const { Title } = Typography;

const DoctorMedicalRecordManagementPage = () => {
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [selectedMedicalRecord, setSelectedMedicalRecord] = useState<MedicalRecord | null>(null);

    const handleCreate = () => {
        setIsCreateModalVisible(true);
    };

    const handleEdit = (record: MedicalRecord) => {
        setSelectedMedicalRecord(record);
        setIsEditModalVisible(true);
    };

    const handleView = (record: MedicalRecord) => {
        setSelectedMedicalRecord(record);
        setIsViewModalVisible(true);
    };
 
    const handleCreateSuccess = () => {
        setIsCreateModalVisible(false);
    };

    const handleEditSuccess = () => {
        setIsEditModalVisible(false);
        setSelectedMedicalRecord(null);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        setSelectedMedicalRecord(null);
    };

    return (
        <DoctorDashboardLayout >
            <Title level={3}>Medical Record Management</Title>
            <p>Manage medical records here.</p>

            <Button type="primary" onClick={handleCreate} style={{ marginBottom: 16 }}>
                Create Medical Record
            </Button>

            <MedicalRecordList onView={handleView} onEdit={handleEdit}  />

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
                onCancel={handleEditCancel}
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

             
        </DoctorDashboardLayout>
    );
};

export default DoctorMedicalRecordManagementPage;