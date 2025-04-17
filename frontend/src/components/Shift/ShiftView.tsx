// src/components/Shift/ShiftView.tsx
import React from 'react';
import { Typography, Descriptions } from 'antd';
import { Shift } from '@/services/shift/shiftSliceAPI';
import dayjs from 'dayjs';

interface ShiftViewProps {
    shift: Shift;
}

const ShiftView: React.FC<ShiftViewProps> = ({ shift }) => {
    const formattedDate = shift.date ? dayjs(shift.date).format('MMMM D, YYYY') : 'N/A';
    const formattedStartTime = shift.startTime ? dayjs(shift.startTime, 'HH:mm').format('h:mm A') : 'N/A';
    const formattedEndTime = shift.endTime ? dayjs(shift.endTime, 'HH:mm').format('h:mm A') : 'N/A';

    return (
        <div>
            <Typography.Title level={4}>Shift Details</Typography.Title>
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Staff">
                    {shift.staff.firstName} {shift.staff.lastName}
                </Descriptions.Item>
                <Descriptions.Item label="Department">{shift.department.name}</Descriptions.Item>
                <Descriptions.Item label="Date">{formattedDate}</Descriptions.Item>
                <Descriptions.Item label="Start Time">{formattedStartTime}</Descriptions.Item>
                <Descriptions.Item label="End Time">{formattedEndTime}</Descriptions.Item>
                <Descriptions.Item label="Type">{shift.type}</Descriptions.Item>
                <Descriptions.Item label="Status">{shift.status}</Descriptions.Item>
            </Descriptions>
        </div>
    );
};

export default ShiftView;