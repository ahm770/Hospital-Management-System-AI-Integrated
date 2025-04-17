// src/components/Admin/StaffView.tsx
import React from 'react';
import { Typography, Descriptions } from 'antd';
import { Staff } from '@/services/staff/types';
import dayjs from 'dayjs';

interface StaffViewProps {
    staff: Staff;
}

const StaffView: React.FC<StaffViewProps> = ({ staff }) => {
     const formattedDob = staff.dob ? dayjs(staff.dob).format('MMMM D, YYYY') : 'N/A';
    return (
        <div>
            <Typography.Title level={4}>Staff Details</Typography.Title>
            <Descriptions bordered column={1}>
                <Descriptions.Item label="ID">{staff._id}</Descriptions.Item>
                <Descriptions.Item label="First Name">{staff.firstName}</Descriptions.Item>
                <Descriptions.Item label="Last Name">{staff.lastName}</Descriptions.Item>
                <Descriptions.Item label="Email">{staff.email}</Descriptions.Item>
                <Descriptions.Item label="Phone">{staff.phone}</Descriptions.Item>
                <Descriptions.Item label="Date of Birth">{formattedDob}</Descriptions.Item>
                <Descriptions.Item label="Address">{staff.address}</Descriptions.Item>
                <Descriptions.Item label="Gender">{staff.gender}</Descriptions.Item>
                <Descriptions.Item label="Role">{staff.role?.name}</Descriptions.Item>
                <Descriptions.Item label="Department">{staff.department?.name}</Descriptions.Item>
            </Descriptions>
        </div>
    );
};

export default StaffView;