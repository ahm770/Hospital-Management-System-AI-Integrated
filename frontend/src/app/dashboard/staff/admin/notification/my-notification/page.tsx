// src/app/dashboard/staff/super-admin/notifications/page.tsx
'use client';

import React from 'react';
import { Typography } from 'antd';
import AdminDashboardLayout from '@/components/Layout/AdminDashboardLayout';
import MyNotificationList from '@/components/Notification/MyNotificationList'; // Import the MyNotificationList component

const { Title } = Typography;

const AdminMyNotificationsPage = () => {
    return (
        <AdminDashboardLayout  >
            <Title level={3}>My Notifications</Title>
            <p>View your notifications here.</p>
            <MyNotificationList/>  {/* Use the MyNotificationList component */}
        </AdminDashboardLayout>
    );
};

export default AdminMyNotificationsPage;