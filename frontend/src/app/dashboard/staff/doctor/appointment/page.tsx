// src/app/dashboard/staff/doctor/appointment/page.tsx
'use client';

import React, { useState } from 'react';
import { Typography, Modal } from 'antd';
import DoctorDashboardLayout from '@/components/Layout/DoctorDashboardLayout';
import AppointmentList from '@/components/Appointment/AppointmentList';
import AppointmentEditForm from '@/components/Appointment/AppointmentEditForm';
import AppointmentView from '@/components/Appointment/AppointmentView';
import { Appointment } from '@/services/appointment/appointmentSliceAPI';

const { Title } = Typography;

const DoctorAppointmentManagementPage = () => {
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    const handleEdit = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setIsEditModalVisible(true);
    };

    const handleView = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setIsViewModalVisible(true);
    };

    const handleEditSuccess = () => {
        setIsEditModalVisible(false);
        setSelectedAppointment(null);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        setSelectedAppointment(null);
    };

    return (
        <DoctorDashboardLayout >
            <Title level={3}>Appointment Management</Title>
            <p>View and Update your appointments here.</p>

            <AppointmentList
                onView={handleView}
                onEdit={handleEdit}
            />

            <Modal
                title="Edit Appointment"
                open={isEditModalVisible}
                onCancel={handleEditCancel}
                footer={null}
            >
                {selectedAppointment && (
                    <AppointmentEditForm
                        appointment={selectedAppointment}
                        onSuccess={handleEditSuccess}
                        onCancel={handleEditCancel}
                    />
                )}
            </Modal>
            <Modal
                title="View Appointment"
                open={isViewModalVisible}
                onCancel={() => setIsViewModalVisible(false)}
                footer={null}
            >
                {selectedAppointment && (
                    <AppointmentView appointment={selectedAppointment} />
                )}
            </Modal>

        </DoctorDashboardLayout>
    );
};

export default DoctorAppointmentManagementPage;