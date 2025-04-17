// src/app/dashboard/staff/super-admin/notifications/page.tsx
'use client';

import React from 'react';
import { Typography } from 'antd';
import DoctorDashboardLayout from '@/components/Layout/DoctorDashboardLayout';
import MyNotificationList from '@/components/Notification/MyNotificationList'; // Import the MyNotificationList component

const { Title } = Typography;

const DoctorMyNotificationsPage = () => {
    return (
        <DoctorDashboardLayout >
            <Title level={3}>My Notifications</Title>
            <p>View your notifications here.</p>
            <MyNotificationList/>  
        </DoctorDashboardLayout>
    );
};

export default DoctorMyNotificationsPage;