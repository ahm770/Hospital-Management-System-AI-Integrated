// src/app/dashboard/staff/Nurse/patient/page.tsx 
'use client';

import React, { useState } from 'react';
import { Typography, Modal } from 'antd';
import NurseDashboardLayout from '@/components/Layout/NurseDashboardLayout'; 
import PatientList from '@/components/Patient/PatientList';
import PatientView from '@/components/Patient/PatientView';  
import { Patient } from '@/services/patient/types';

const { Title } = Typography;

const NursePatientManagementPage = () => {   
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    const handleView = (patient: Patient) => {
        setSelectedPatient(patient);
        setIsViewModalVisible(true);
    };

    return (
        <>
            <NurseDashboardLayout  > {/*Changed Layout*/}
                <Title level={3}>Patient Management</Title>
                <p>View patients here.</p>

                <PatientList
                    onView={handleView}
                />
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

            </NurseDashboardLayout>
        </>
    );
};

export default NursePatientManagementPage;