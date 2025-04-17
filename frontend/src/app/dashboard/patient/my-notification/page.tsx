// src/app/dashboard/staff/super-admin/notifications/page.tsx
'use client';

import React from 'react';
import { Typography } from 'antd';
import PatientDashboardLayout from '@/components/Layout/PatientDashboardLayout';
import MyNotificationList from '@/components/Notification/MyNotificationList'; // Import the MyNotificationList component

const { Title } = Typography;

const PatientMyNotificationsPage = () => {
    return (
        <PatientDashboardLayout  >
            <Title level={3}>My Notifications</Title>
            <p>View your notifications here.</p>
            <MyNotificationList/>  {/* Use the MyNotificationList component */}
        </PatientDashboardLayout>
    );
};

export default PatientMyNotificationsPage;