// src/app/dashboard/staff/super-admin/shift/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Button, Modal, message } from 'antd';
import NurseDashboardLayout from '@/components/Layout/NurseDashboardLayout';
import { useAppSelector } from "@/store/store";
import { useRouter } from 'next/navigation';
import MyShiftList from '@/components/Shift/MyShiftList';
import ShiftView from '@/components/Shift/ShiftView';
import { Shift } from '@/services/shift/shiftSliceAPI';

const { Title } = Typography;

const NurseShiftManagementPage = () => {
 
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
    const user = useAppSelector((state) => state.auth.user);
    const router = useRouter();

    useEffect(() => {
        if (!user || (user.userType !== "Staff" || user.role?.name?.toLowerCase() !== "nurse")) {
            messageApi.error("You are not authorized to view this page.");
            router.push('/auth');
        }
    }, [user, router]);
 
    const handleView = (shift: Shift) => {
        setSelectedShift(shift);
        setIsViewModalVisible(true);
    };

    return (
        <>
            {contextHolder}
            <NurseDashboardLayout >
                <Title level={3}>My Shifts </Title>

                <MyShiftList
                    onView={handleView}
                />
                 
                <Modal
                    title="View Shift"
                    open={isViewModalVisible}
                    onCancel={() => setIsViewModalVisible(false)}
                    footer={null}
                >
                    {selectedShift && (
                        <ShiftView shift={selectedShift} />
                    )}
                </Modal>
            </NurseDashboardLayout>
        </>
    );
};

export default NurseShiftManagementPage;