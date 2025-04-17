// src/app/dashboard/staff/nurse/page.tsx
'use client';

import React from 'react';
import { Typography, Card, Col, Row, Statistic, List, Avatar, Button } from 'antd';
import NurseDashboardLayout from '@/components/Layout/NurseDashboardLayout';
import { useAppSelector } from "@/store/store";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Loader from '@/components/Layout/Loader';
import { NotificationOutlined, FileTextOutlined, UserOutlined } from '@ant-design/icons';

//RTK Queries imports:
import { useGetMyNotificationsQuery, Notification } from '@/services/notification/notificationSliceAPI';
import { useGetMyTasksQuery } from '@/services/task/taskSliceAPI';
import { formatDate } from '@/utils/dateUtils';

const { Title, Paragraph, Text } = Typography;

const NurseDashboard = () => {
    const user = useAppSelector((state) => state.auth.user);
    const router = useRouter();

    //RTK Queries
    const { data: notificationsData, isLoading: isNotificationsLoading, isError: isNotificationsError, error: notificationsError } = useGetMyNotificationsQuery({ limit: 5 });
     const { data: tasksData, isLoading: isTasksLoading, isError: isTasksError, error: tasksError } = useGetMyTasksQuery({ limit: 5 }); // Limiting to 5 tasks for dashboard

    if (!user || user.userType !== "Staff" || user.role?.name?.toLowerCase() !== "nurse") {
        router.push('/auth'); // Redirect to login if unauthorized
        return null; // Or render an "Unauthorized" component
    }

    if (isNotificationsLoading || isTasksLoading) {
        return (
            <NurseDashboardLayout>
                <Loader />
            </NurseDashboardLayout>
        );
    }

    if (isNotificationsError || isTasksError) {
        let errorMessage = "Error loading data.";
        if (isNotificationsError) errorMessage += ` Notifications: ${(notificationsError as any)?.data?.message || "Unknown"}`;
        if (isTasksError) errorMessage += ` Tasks: ${(tasksError as any)?.data?.message || "Unknown"}`;
        return (
            <NurseDashboardLayout>
                <Title level={4} type="danger">{errorMessage}</Title>
            </NurseDashboardLayout>
        );
    }

    const totalPendingTasks = tasksData?.tasks?.filter(task => task.status === 'pending' || task.status === "in_progress").length || 0;

    return (
        <NurseDashboardLayout>
            <Title level={3}>Nurse Dashboard</Title>
            <Paragraph>Welcome, Nurse! Manage patient care, medications, and vitals here.</Paragraph>

            <Row gutter={16}>
         
                <Col span={12}>
                    <Link href="/dashboard/staff/nurse/task/my-task">
                        <Card>
                            <Statistic
                                title="Pending / In progress Tasks"
                                value={totalPendingTasks}
                                prefix={<FileTextOutlined />}
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
                <Button type="link" href="/dashboard/staff/nurse/notification/my-notification">View All Notifications</Button>
            </Card>

        </NurseDashboardLayout>
    );
};

export default NurseDashboard;