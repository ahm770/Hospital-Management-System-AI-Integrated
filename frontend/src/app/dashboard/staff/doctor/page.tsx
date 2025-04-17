// src/app/dashboard/staff/doctor/page.tsx
'use client';

import React from 'react';
import { Typography, Card, Col, Row, Statistic, List, Avatar, Button } from 'antd';
import DoctorDashboardLayout from '@/components/Layout/DoctorDashboardLayout';
import { useAppSelector } from "@/store/store";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Loader from '@/components/Layout/Loader';
import { NotificationOutlined, FileTextOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';

//RTK Queries imports:
import { useGetMyNotificationsQuery, Notification } from '@/services/notification/notificationSliceAPI';
import { useGetAppointmentsQuery } from '@/services/appointment/appointmentSliceAPI';
import { useGetPatientsQuery } from '@/services/patient/patientSliceAPI';
import { formatDate } from '@/utils/dateUtils';

const { Title, Paragraph, Text } = Typography;

const DoctorDashboard = () => {
    const user = useAppSelector((state) => state.auth.user);
    const router = useRouter();

    //RTK Queries
    const { data: notificationsData, isLoading: isNotificationsLoading, isError: isNotificationsError, error: notificationsError } = useGetMyNotificationsQuery({ limit: 5 });
    const { data: appointmentsData, isLoading: isAppointmentsLoading, isError: isAppointmentsError, error: appointmentsError } = useGetAppointmentsQuery({ limit: 5 });
    const { data: patientsData, isLoading: isPatientsLoading, isError: isPatientsError, error: patientsError } = useGetPatientsQuery({});

    if (!user || user.userType !== "Staff" || user.role?.name?.toLowerCase() !== "doctor") {
        router.push('/auth'); // Redirect to login if unauthorized
        return null; // Or render an "Unauthorized" component
    }

    if (isNotificationsLoading || isAppointmentsLoading || isPatientsLoading) {
        return (
            <DoctorDashboardLayout>
                <Loader />
            </DoctorDashboardLayout>
        );
    }

    if (isNotificationsError || isAppointmentsError || isPatientsError) {
        let errorMessage = "Error loading data.";
        if (isNotificationsError) errorMessage += ` Notifications: ${(notificationsError as any)?.data?.message || "Unknown"}`;
        if (isAppointmentsError) errorMessage += ` Appointments: ${(appointmentsError as any)?.data?.message || "Unknown"}`;
        if (isPatientsError) errorMessage += ` Patients: ${(patientsError as any)?.data?.message || "Unknown"}`;
        return (
            <DoctorDashboardLayout>
                <Title level={4} type="danger">{errorMessage}</Title>
            </DoctorDashboardLayout>
        );
    }

    const totalUpcomingAppointments = appointmentsData?.appointments?.length || 0;
    const totalAssignedPatients = patientsData?.patients?.length || 0; // Assuming you have a way to filter for assigned patients

    return (
        <DoctorDashboardLayout>
            <Title level={3}>Doctor Dashboard</Title>
            <Paragraph>Welcome, Doctor! Manage patients, appointments, and medical records here.</Paragraph>

            <Row gutter={16}>
                <Col span={12}>
                    <Link href="/dashboard/staff/doctor/appointment">
                        <Card>
                            <Statistic
                                title="Upcoming Appointments"
                                value={totalUpcomingAppointments}
                                prefix={<CalendarOutlined />}
                            />
                        </Card>
                    </Link>
                </Col>
                <Col span={12}>
                    <Link href="/dashboard/staff/doctor/patient">
                        <Card>
                            <Statistic
                                title="Assigned Patients"
                                value={totalAssignedPatients}
                                prefix={<UserOutlined />}
                            />
                        </Card>
                    </Link>
                </Col>
            </Row>

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
                <Button type="link" href="/dashboard/staff/doctor/notification/my-notification">View All Notifications</Button>
            </Card>

        </DoctorDashboardLayout>
    );
};

export default DoctorDashboard;