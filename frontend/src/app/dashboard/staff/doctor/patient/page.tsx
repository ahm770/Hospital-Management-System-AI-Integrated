// src/app/dashboard/staff/doctor/patient/page.tsx 
'use client';

import React, { useState } from 'react';
import { Typography, Modal } from 'antd';
import DoctorDashboardLayout from '@/components/Layout/DoctorDashboardLayout'; 
import PatientList from '@/components/Patient/PatientList';
import PatientView from '@/components/Patient/PatientView';  
import { Patient } from '@/services/patient/types';
import ViewMedicalSummary from '@/components/MedicalRecord/ViewMedicalSummary';

const { Title } = Typography;

const DoctorPatientManagementPage = () => {   
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [isViewSummaryModalVisible, setIsViewSummaryModalVisible] = useState(false);

    const handleView = (patient: Patient) => {
        setSelectedPatient(patient);
        setIsViewModalVisible(true);
    };
    const handleViewSummary = (patient: Patient) => {
        setSelectedPatient(patient);
        setIsViewSummaryModalVisible(true);
    };
    const handleSummaryCancel = () => {
        setIsViewSummaryModalVisible(false);
        setSelectedPatient(null);
    };

    return (
        <>
            <DoctorDashboardLayout  > {/*Changed Layout*/}
                <Title level={3}>Patient Management</Title>
                <p>View patients your assigned patients here.</p>

                <PatientList
                    onView={handleView} onSummary={handleViewSummary}
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
                <Modal
                title="View Medical Record Summary"
                open={isViewSummaryModalVisible}
                onCancel={handleSummaryCancel}
                footer={null}
              >
                  {selectedPatient && (
                      <ViewMedicalSummary  patient={selectedPatient} />
                  )}
              </Modal>

            </DoctorDashboardLayout>
        </>
    );
};

export default DoctorPatientManagementPage;