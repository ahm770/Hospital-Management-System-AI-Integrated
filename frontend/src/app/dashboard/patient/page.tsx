// src/app/dashboard/patient/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Card, List, Avatar, Button, message } from 'antd';
import {
    UserOutlined,
    CalendarOutlined,
    FileTextOutlined,
    NotificationOutlined
} from '@ant-design/icons';
import DashboardLayout from '@/components/Layout/PatientDashboardLayout'; // Assuming you have a custom layout
import { useAppSelector } from "@/store/store";
import { useRouter } from 'next/navigation';
import { formatDate } from '@/utils/dateUtils';

//RTK Query imports:
import { useGetMyNotificationsQuery, Notification } from '@/services/notification/notificationSliceAPI';
import { useGetMedicalRecordsQuery, MedicalRecord } from '@/services/medicalRecord/medicalRecordSliceAPI'; // Assuming you have a MedicalRecord type
import { useGetAppointmentsQuery, Appointment } from '@/services/appointment/appointmentSliceAPI';

const { Title, Text } = Typography;

const PatientDashboard = () => {
    const user = useAppSelector((state) => state.auth.user);
    const router = useRouter();
    const [messageApi, contextHolder] = message.useMessage();

    // RTK Query calls:
    const { data: notificationsData, isLoading: isNotificationsLoading, isError: isNotificationsError, error: notificationsError } = useGetMyNotificationsQuery({});
    const { data: medicalRecordsData, isLoading: isMedicalRecordsLoading, isError: isMedicalRecordsError, error: medicalRecordsError } = useGetMedicalRecordsQuery({limit:5}); // Adjust limit as needed, added a limit
    const { data: appointmentsData, isLoading: isAppointmentsLoading, isError: isAppointmentsError, error: appointmentsError } = useGetAppointmentsQuery({limit:5}); // Adjust limit as needed, added a limit

     useEffect(() => {
        if (!user || user.userType !== "Patient") {
            messageApi.error("You are not authorized to view this page.");
            router.push('/auth'); // Redirect to login or unauthorized page
        }
    }, [user, router]);

    if (!user || user.userType !== "Patient") {
        return null; // Or an unauthorized component
    }

    return (
        <>
            {contextHolder}
            <DashboardLayout>
                <Title level={3}>Patient Dashboard</Title>
                <Text>Welcome, {user.firstName} {user.lastName}!</Text>

                <Card
                    title={<><NotificationOutlined /> Recent Notifications</>}
                    style={{ marginTop: 16 }}
                    loading={isNotificationsLoading}
                >
                    {isNotificationsError ? (
                        <Text type="danger">Error loading notifications: { (notificationsError as any)?.data?.message || "An unexpected error occurred."}</Text>
                    ) : (
                        <List
                            itemLayout="horizontal"
                            dataSource={notificationsData?.notifications || []}
                            renderItem={(item: Notification) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar icon={<NotificationOutlined />} />}
                                        title={<Text>{item.message}</Text>}
                                        description={<Text type="secondary">{formatDate(item.createdAt)}</Text>}
                                    />
                                </List.Item>
                            )}
                        />
                    )}
                    <Button type="link" href="/dashboard/patient/my-notification">View All Notifications</Button>
                </Card>

                <Card
                    title={<><FileTextOutlined /> Medical Records</>}
                    style={{ marginTop: 16 }}
                    loading={isMedicalRecordsLoading}
                >
                    {isMedicalRecordsError ? (
                        <Text type="danger">Error loading medical records:  { (medicalRecordsError as any)?.data?.message || "An unexpected error occurred."}</Text>
                    ) : (
                        <List
                            itemLayout="horizontal"
                            dataSource={medicalRecordsData?.records || []}
                            renderItem={(item: MedicalRecord) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar icon={<FileTextOutlined />} />}
                                        title={<Text>Visit Date: {formatDate(item.visitDate)}</Text>}
                                        description={<Text>{item.diagnosis}</Text>}
                                    />
                                </List.Item>
                            )}
                        />
                    )}
                    <Button type="link" href="/dashboard/patient/medical-record">View All Medical Records</Button>
                </Card>

                <Card
                    title={<><CalendarOutlined /> Upcoming Appointments</>}
                    style={{ marginTop: 16 }}
                    loading={isAppointmentsLoading}
                >
                    {isAppointmentsError ? (
                        <Text type="danger">Error loading appointments: { (appointmentsError as any)?.data?.message || "An unexpected error occurred."}</Text>
                    ) : (
                        <List
                            itemLayout="horizontal"
                            dataSource={appointmentsData?.appointments || []}
                            renderItem={(item: Appointment) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar icon={<CalendarOutlined />} />}
                                        title={<Text>Date: {formatDate(item.date)}</Text>}
                                        description={<Text>Doctor: {item.doctor.firstName} {item.doctor.lastName}</Text>}
                                    />
                                </List.Item>
                            )}
                        />
                    )}
                    <Button type="link" href="/dashboard/patient/appointment">View All Appointments</Button>
                </Card>
            </DashboardLayout>
        </>
    );
};

export default PatientDashboard;