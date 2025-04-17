// src/components/Staff/StaffList.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { useGetStaffQuery } from '@/services/staff/staffSliceAPI';
import { Table, Button, Space, Input } from 'antd';
import { Staff } from '@/services/staff/types';
import { EditOutlined, EyeOutlined, SearchOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import Loader from "@/components/Layout/Loader"

interface StaffListProps {
    onView?: (staff: Staff) => void;
    onEdit?: (staff: Staff) => void;
    onDelete?: (staff: Staff) => void;
}

const StaffList: React.FC<StaffListProps> = ({ onView, onEdit, onDelete }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');

    const { data: staffData, isLoading, isError, error } = useGetStaffQuery({
        page: currentPage,
        limit: pageSize,
        search: searchTerm
    });

    const totalStaffCount = staffData?.totalStaff || 0;
    const staff = staffData?.staff || [];

    const handleTableChange = (current: number, pageSize: number) => {
        setCurrentPage(current);
        setPageSize(pageSize);
    };

    // Use useCallback to prevent unnecessary re-renders of the action column
    const columns = React.useMemo(
        () => [
            {
                title: '#',
                key: 'index',
                render: (text: string, record: Staff, index: number) => {
                    return (Number(currentPage) - 1) * Number(pageSize) + index + 1;
                },
            },
            {
                title: 'First Name',
                dataIndex: 'firstName',
                key: 'firstName',
            },
            {
                title: 'Last Name',
                dataIndex: 'lastName',
                key: 'lastName',
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
            },
            {
                title: 'Role',
                dataIndex: 'role',
                key: 'role',
                render: (role: { name: string }) => role?.name,
            },
            {
                title: 'Department',
                dataIndex: 'department',
                key: 'department',
                render: (department: { name: string }) => department?.name,
            },
            {
                title: 'Action',
                key: 'action',
                render: (text: string, record: Staff) => (
                    <Space size="middle">
                        {onView && (
                            <Button icon={<EyeOutlined />} onClick={() => onView(record)}>
                                View
                            </Button>
                        )}
                        {onEdit && (
                            <Button icon={<EditOutlined />} onClick={() => onEdit(record)}>
                                Edit
                            </Button>
                        )}
                        {onDelete && (
                            <Button danger icon={<DeleteOutlined />} onClick={() => onDelete(record)}>
                                Delete
                            </Button>
                        )}
                    </Space>
                ),
            },
        ],
        [currentPage, pageSize, onView, onEdit, onDelete] // Dependencies for the memo
    );

    if (isLoading) return <Loader />;
    if (isError) return <p>Error fetching staff: {(error as any)?.data?.message || "An unexpected error occurred."}</p>

    return (
        <>
            <Input
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: 16 }}
                prefix={<SearchOutlined />}
                suffix={searchTerm ? (
                    <CloseOutlined
                        onClick={() => {
                            setSearchTerm('');
                        }}
                    />
                ) : null}
            />
            <Table
                columns={columns}
                dataSource={staff}
                rowKey="_id"
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalStaffCount,
                    showSizeChanger: true,
                    onChange: handleTableChange,
                }}
            />
        </>
    );
};

export default StaffList;