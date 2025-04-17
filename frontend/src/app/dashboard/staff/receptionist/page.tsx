// src/app/dashboard/staff/receptionist/page.tsx
'use client';

import React from 'react';
import { Typography, Card, Col, Row, Statistic, List, Avatar, Button } from 'antd';
import ReceptionistDashboardLayout from '@/components/Layout/ReceptionistDashboardLayout';
import { useAppSelector } from "@/store/store";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Loader from '@/components/Layout/Loader';
import { NotificationOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';

//RTK Queries imports:
import { useGetMyNotificationsQuery, Notification } from '@/services/notification/notificationSliceAPI';
import { useGetPatientsQuery } from '@/services/patient/patientSliceAPI';
import { useGetAppointmentsQuery } from '@/services/appointment/appointmentSliceAPI'; // Corrected import
import { formatDate } from '@/utils/dateUtils';

const { Title, Paragraph, Text } = Typography;

const ReceptionistDashboard = () => {
    const user = useAppSelector((state) => state.auth.user);
    const router = useRouter();

    //RTK Queries
    const { data: notificationsData, isLoading: isNotificationsLoading, isError: isNotificationsError, error: notificationsError } = useGetMyNotificationsQuery({ limit: 5 });
    const { data: patientsData, isLoading: isPatientsLoading, isError: isPatientsError, error: patientsError } = useGetPatientsQuery({});
    const { data: appointmentsData, isLoading: isAppointmentsLoading, isError: isAppointmentsError, error: appointmentsError } = useGetAppointmentsQuery({}); // Fetch only 5 upcoming appointments

    if (!user || user.userType !== "Staff" || user.role?.name?.toLowerCase() !== "receptionist") {
        router.push('/auth'); // Redirect to login if unauthorized
        return null; // Or render an "Unauthorized" component
    }

    if (isNotificationsLoading || isPatientsLoading || isAppointmentsLoading) {
        return (
            <ReceptionistDashboardLayout>
                <Loader />
            </ReceptionistDashboardLayout>
        );
    }

    if (isNotificationsError || isPatientsError || isAppointmentsError) {
        let errorMessage = "Error loading data.";
        if (isNotificationsError) errorMessage += ` Notifications: ${(notificationsError as any)?.data?.message || "Unknown"}`;
        if (isPatientsError) errorMessage += ` Patients: ${(patientsError as any)?.data?.message || "Unknown"}`;
        if (isAppointmentsError) errorMessage += ` Appointments: ${(appointmentsError as any)?.data?.message || "Unknown"}`;
        return (
            <ReceptionistDashboardLayout>
                <Title level={4} type="danger">{errorMessage}</Title>
            </ReceptionistDashboardLayout>
        );
    }

    const totalPatients = patientsData?.totalPatients || 0;
    const upcomingAppointments = appointmentsData?.appointments?.length || 0;

    return (
        <ReceptionistDashboardLayout>
            <Title level={3}>Receptionist Dashboard</Title>
            <Paragraph>Welcome, Receptionist! Manage appointments, patient check-in, and billing here.</Paragraph>

            <Row gutter={16}>
                <Col span={12}>
                    <Link href="/dashboard/staff/receptionist/patient">
                        <Card>
                            <Statistic
                                title="Total Patients"
                                value={totalPatients}
                                prefix={<UserOutlined />}
                            />
                        </Card>
                    </Link>
                </Col>
                <Col span={12}>
                    <Link href="/dashboard/staff/receptionist/appointment">
                        <Card>
                            <Statistic
                                title="Upcoming Appointments"
                                value={upcomingAppointments}
                                prefix={<CalendarOutlined />}
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
                <Button type="link" href="/dashboard/staff/receptionist/notification/my-notification">View All Notifications</Button>
            </Card>

        </ReceptionistDashboardLayout>
    );
};

export default ReceptionistDashboard;