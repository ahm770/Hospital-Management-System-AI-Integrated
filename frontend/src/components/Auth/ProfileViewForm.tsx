// src/components/Auth/ProfileViewForm.tsx
"use client";

import React, { useEffect } from 'react';
import { useGetProfileQuery } from '@/services/auth/authSliceAPI';
import { Typography, Descriptions, Avatar, Space, Card } from 'antd'; // Added Card
import { UserOutlined } from '@ant-design/icons';
import { Staff, Patient } from '@/services/auth/types';
import Loader from '@/components/Layout/Loader';
import logger from '@/utils/logger';
const { Title, Text } = Typography;

interface ProfileViewFormProps { }

const ProfileViewForm: React.FC<ProfileViewFormProps> = () => {
    const { data: user, isLoading, isError, error } = useGetProfileQuery();
    logger.silly("user::", user)
    if (isLoading) return <Loader />;
    if (isError) return <p>Error fetching profile: {(error as any)?.data?.message || "An unexpected error occurred."}</p>;

    if (!user) {
        return <p>No profile information available.</p>;
    }

    return (
        <Card
            title={<Title level={3} style={{ textAlign: 'center', margin: 0 }}>My Profile</Title>}
            style={{ maxWidth: 600, margin: 'auto' }}  
        >
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Space align="center">
                    <Avatar size={80} icon={<UserOutlined />} />
                </Space>
            </div>
            <Descriptions bordered column={1}>
                <Descriptions.Item label="First Name"><Text>{user.firstName}</Text></Descriptions.Item>
                <Descriptions.Item label="Last Name"><Text>{user.lastName}</Text></Descriptions.Item>
                <Descriptions.Item label="Email"><Text>{user.email}</Text></Descriptions.Item>
                <Descriptions.Item label="Phone"><Text>{user.phone}</Text></Descriptions.Item>
                <Descriptions.Item label="Address"><Text>{user.address}</Text></Descriptions.Item>
                <Descriptions.Item label="Gender"><Text>{user.gender}</Text></Descriptions.Item>

                {/* Conditionally render Staff-specific information */}
                {user.userType === "Staff" && (
                    <>
                        <Descriptions.Item label="Role"><Text>{(user as Staff).role?.name || 'N/A'}</Text></Descriptions.Item>
                        <Descriptions.Item label="Department"><Text>{(user as Staff).department?.name || 'N/A'}</Text></Descriptions.Item>
                    </>
                )}
               
            </Descriptions>
        </Card>
    );
};

export default ProfileViewForm;