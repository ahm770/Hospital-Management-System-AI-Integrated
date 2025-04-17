// src/app/dashboard/staff/nurse/medical-record/page.tsx
'use client';

import React, { useState } from 'react';
import { Typography, Modal } from 'antd';
import NurseDashboardLayout from '@/components/Layout/NurseDashboardLayout';
import MedicalRecordList from '@/components/MedicalRecord/MedicalRecordList';
import MedicalRecordEditForm from '@/components/MedicalRecord/MedicalRecordEditForm';
import MedicalRecordView from '@/components/MedicalRecord/MedicalRecordView';
import { MedicalRecord } from '@/services/medicalRecord/medicalRecordSliceAPI';

const { Title } = Typography;

const NurseMedicalRecordManagementPage = () => {
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [selectedMedicalRecord, setSelectedMedicalRecord] = useState<MedicalRecord | null>(null);

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

    return (
        <NurseDashboardLayout >
            <Title level={3}>Medical Record Management</Title>
            <p>Manage medical records here.</p>

            <MedicalRecordList onView={handleView} onEdit={handleEdit}  />

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
        </NurseDashboardLayout>
    );
};

export default NurseMedicalRecordManagementPage;