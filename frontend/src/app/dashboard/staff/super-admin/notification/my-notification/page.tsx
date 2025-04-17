// src/app/dashboard/staff/super-admin/notifications/page.tsx
'use client';

import React from 'react';
import { Typography } from 'antd';
import SuperAdminDashboardLayout from '@/components/Layout/SuperAdminDashboardLayout';
import MyNotificationList from '@/components/Notification/MyNotificationList'; // Import the MyNotificationList component

const { Title } = Typography;

const SuperAdminMyNotificationsPage = () => {
    return (
        <SuperAdminDashboardLayout >
            <Title level={3}>My Notifications</Title>
            <p>View your notifications here.</p>
            <MyNotificationList/>  {/* Use the MyNotificationList component */}
        </SuperAdminDashboardLayout>
    );
};

export default SuperAdminMyNotificationsPage;