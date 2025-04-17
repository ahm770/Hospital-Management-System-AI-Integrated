// src/app/dashboard/staff/super-admin/notifications/page.tsx
'use client';

import React from 'react';
import { Typography } from 'antd';
import NurseDashboardLayout from '@/components/Layout/NurseDashboardLayout';
import MyNotificationList from '@/components/Notification/MyNotificationList';  

const { Title } = Typography;

const NurseMyNotificationsPage = () => {
    return (
        <NurseDashboardLayout >
            <Title level={3}>My Notifications</Title>
            <p>View your notifications here.</p>
            <MyNotificationList/>  
        </NurseDashboardLayout>
    );
};

export default NurseMyNotificationsPage;