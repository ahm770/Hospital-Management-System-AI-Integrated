// src/app/dashboard/staff/admin/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Card, Col, Row, Statistic, message, List, Avatar, Button } from 'antd';
import AdminDashboardLayout from '@/components/Layout/AdminDashboardLayout';
import { useAppSelector } from "@/store/store";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Loader from '@/components/Layout/Loader';
import { NotificationOutlined } from '@ant-design/icons';

//RTK Queries imports:
import { useGetStaffQuery } from '@/services/staff/staffSliceAPI';
import { useGetPatientsQuery } from '@/services/patient/patientSliceAPI';
import { useGetDepartmentsQuery } from '@/services/department/departmentSliceAPI';
import { useGetMyNotificationsQuery, Notification } from '@/services/notification/notificationSliceAPI';
import { formatDate } from '@/utils/dateUtils';

const { Title, Paragraph, Text } = Typography;

const AdminDashboard = () => {
    const user = useAppSelector((state) => state.auth.user);
    const router = useRouter();
    const [messageApi, contextHolder] = message.useMessage();

    //RTK Queries to fetch counts
    const { data: staffData, isLoading: isStaffLoading, isError: isStaffError, error: staffError } = useGetStaffQuery({});
    const { data: patientsData, isLoading: isPatientsLoading, isError: isPatientsError, error: patientsError } = useGetPatientsQuery({});
    const { data: departmentsData, isLoading: isDepartmentsLoading, isError: isDepartmentsError, error: departmentsError } = useGetDepartmentsQuery({});
    const { data: notificationsData, isLoading: isNotificationsLoading, isError: isNotificationsError, error: notificationsError } = useGetMyNotificationsQuery({ limit: 5 });

    useEffect(() => {
        if (!user || (user.userType !== "Staff" || user.role?.name?.toLowerCase() !== "admin")) {
            messageApi.error("You are not authorized to view this page.");
            router.push('/auth');
        }
    }, [user, router]);

    if (isStaffLoading || isPatientsLoading || isDepartmentsLoading || isNotificationsLoading) {
        return (
            <AdminDashboardLayout>
                {contextHolder}
                <Loader />
            </AdminDashboardLayout>
        );
    }

    if (isStaffError || isPatientsError || isDepartmentsError || isNotificationsError) {
        let errorMessage = "Error loading data.";
        if (isStaffError) errorMessage += ` Staff: ${ (staffError as any)?.data?.message || "Unknown"}`;
        if (isPatientsError) errorMessage += ` Patients: ${ (patientsError as any)?.data?.message || "Unknown"}`;
        if (isDepartmentsError) errorMessage += ` Departments: ${ (departmentsError as any)?.data?.message || "Unknown"}`;
        if (isNotificationsError) errorMessage += ` Notifications: ${ (notificationsError as any)?.data?.message || "Unknown"}`;

        return (
            <AdminDashboardLayout>
                {contextHolder}
                <Title level={4} type="danger">{errorMessage}</Title>
            </AdminDashboardLayout>
        );
    }

    const totalStaff = staffData?.totalStaff || 0;
    const totalPatients = patientsData?.totalPatients || 0;
    const totalDepartments = departmentsData?.totalDepartments || 0;

    return (
        <AdminDashboardLayout>
            {contextHolder}
            <Title level={3}>Admin Dashboard</Title>
            <Paragraph>Welcome, Admin! Here's an overview of the system:</Paragraph>

            <Row gutter={16}>
                <Col span={8}>
                    <Link href="/dashboard/staff/admin/staff">
                        <Card>
                            <Statistic
                                title="Total Staff"
                                value={totalStaff}
                            />
                        </Card>
                    </Link>
                </Col>
                <Col span={8}>
                    <Link href="/dashboard/staff/admin/patient">
                        <Card>
                            <Statistic
                                title="Total Patients"
                                value={totalPatients}
                            />
                        </Card>
                    </Link>
                </Col>
                <Col span={8}>
                    <Link href="/dashboard/staff/admin/department">
                        <Card>
                            <Statistic
                                title="Total Departments"
                                value={totalDepartments}
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
                    <Text type="danger">Error loading notifications:  { (notificationsError as any)?.data?.message || "An unexpected error occurred."}</Text>
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
                <Button type="link" href="/dashboard/staff/admin/notification/my-notification">View All Notifications</Button>
            </Card>
        </AdminDashboardLayout>
    );
};

export default AdminDashboard;