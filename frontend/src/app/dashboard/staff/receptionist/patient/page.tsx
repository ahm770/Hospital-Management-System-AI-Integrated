// src/app/dashboard/staff/admin/patient/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Button, Modal, message } from 'antd';
import ReceptionistDashboardLayout from '@/components/Layout/ReceptionistDashboardLayout';
import { useAppSelector } from "@/store/store";
import { useRouter } from 'next/navigation';

// Import Patient Components
import PatientList from '@/components/Patient/PatientList';
import PatientCreateForm from '@/components/Patient/PatientCreateForm';
import PatientEditForm from '@/components/Patient/PatientEditForm';
import PatientView from '@/components/Patient/PatientView';  
import { Patient } from '@/services/patient/types';

const { Title } = Typography;

const ReceptionistPatientManagementPage = () => {
    const [isPatientCreateModalVisible, setIsPatientCreateModalVisible] = useState(false);
    const [isPatientEditModalVisible, setIsPatientEditModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    const user = useAppSelector((state) => state.auth.user);
    const router = useRouter();

    useEffect(() => {
        if (!user || (user.userType !== "Staff" || user.role?.name?.toLowerCase() !== "receptionist")) {
            messageApi.error("You are not authorized to view this page.");
            router.push('/auth');
        }
    }, [user, router]);

    const showPatientCreateModal = () => {
        setIsPatientCreateModalVisible(true);
    };

    const handlePatientCreateSuccess = () => {
        setIsPatientCreateModalVisible(false);
    };

    const handlePatientEdit = (patient: Patient) => {
        setSelectedPatient(patient);
        setIsPatientEditModalVisible(true);
    };

    const handleView = (patient: Patient) => {
        setSelectedPatient(patient);
        setIsViewModalVisible(true);
    };

    const handlePatientEditSuccess = () => {
        setIsPatientEditModalVisible(false);
        setSelectedPatient(null);
    };

    const handlePatientEditCancel = () => {
        setIsPatientEditModalVisible(false);
        setSelectedPatient(null);
    };

    return (
        <>
            {contextHolder}
            <ReceptionistDashboardLayout >
                <Title level={3}>Patient Management</Title>
                <p>Manage patients here.</p>

                <Button type="primary" onClick={showPatientCreateModal} style={{ marginBottom: 16 }}>
                    Create Patient
                </Button>
                <PatientList
                    onEdit={handlePatientEdit}
                    onView={handleView}
                     
                />
                <Modal
                    title="Create Patient"
                    open={isPatientCreateModalVisible}
                    onCancel={() => setIsPatientCreateModalVisible(false)}
                    footer={null}
                >
                    <PatientCreateForm onSuccess={handlePatientCreateSuccess} />
                </Modal>
                <Modal
                    title="Edit Patient"
                    open={isPatientEditModalVisible}
                    onCancel={handlePatientEditCancel}
                    footer={null}
                >
                    {selectedPatient && (
                        <PatientEditForm
                            patient={selectedPatient}
                            onSuccess={handlePatientEditSuccess}
                            onCancel={handlePatientEditCancel}
                        />
                    )}
                </Modal>
                <Modal
                    title="View Patient"
                    open={isViewModalVisible}
                    onCancel={() => setIsViewModalVisible(false)}
                    footer={null}
                >
                    {selectedPatient && (
                        <PatientView patient={selectedPatient} />
                    )}
                </Modal>
              
            </ReceptionistDashboardLayout>
        </>
    );
};

export default ReceptionistPatientManagementPage;