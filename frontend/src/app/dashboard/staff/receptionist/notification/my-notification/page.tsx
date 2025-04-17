// src/app/dashboard/staff/super-admin/notifications/page.tsx
'use client';

import React from 'react';
import { Typography } from 'antd';
import ReceptionistDashboardLayout from '@/components/Layout/ReceptionistDashboardLayout';
import MyNotificationList from '@/components/Notification/MyNotificationList';  

const { Title } = Typography;

const ReceptionistMyNotificationsPage = () => {
    return (
        <ReceptionistDashboardLayout >
            <Title level={3}>My Notifications</Title>
            <p>View your notifications here.</p>
            <MyNotificationList/>  
        </ReceptionistDashboardLayout>
    );
};

export default ReceptionistMyNotificationsPage;