// src/app/dashboard/Patient/medical-record/page.tsx
'use client';

import React, { useState } from 'react';
import { Typography, Modal } from 'antd';
import PatientDashboardLayout from '@/components/Layout/PatientDashboardLayout';
import MedicalRecordList from '@/components/MedicalRecord/MedicalRecordList';
import MedicalRecordView from '@/components/MedicalRecord/MedicalRecordView';
import { MedicalRecord } from '@/services/medicalRecord/medicalRecordSliceAPI';

const { Title } = Typography;

const PatientMedicalRecordManagementPage = () => {
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [selectedMedicalRecord, setSelectedMedicalRecord] = useState<MedicalRecord | null>(null);

    

    const handleView = (record: MedicalRecord) => {
        setSelectedMedicalRecord(record);
        setIsViewModalVisible(true);
    };


    return (
        <PatientDashboardLayout >
            <Title level={3}>Medical Record Management</Title>
            <p>Manage medical records here.</p>

            <MedicalRecordList onView={handleView}   />
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
        </PatientDashboardLayout>
    );
};

export default PatientMedicalRecordManagementPage;