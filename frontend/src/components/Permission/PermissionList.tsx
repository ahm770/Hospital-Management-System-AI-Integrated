// src/components/Permission/PermissionList.tsx
'use client';

import React, { useState } from 'react';
import { useGetPermissionsQuery, Permission } from '@/services/permission/permissionSliceAPI';
import { Table, Button, Space, Input } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import Loader from "@/components/Layout/Loader"

interface PermissionListProps {
    onView: (permission: Permission) => void;
    onEdit: (permission: Permission) => void;
    onDelete: (permission: Permission) => void; // Added onDelete prop
}

const PermissionList: React.FC<PermissionListProps> = ({ onView, onEdit, onDelete }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');

    const { data: permissionData, isLoading, isError: isGetPermissionsError, error: getPermissionsError } = useGetPermissionsQuery({
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
    });

    const totalPermissionCount = permissionData?.total || 0;
    const permissions = permissionData?.permissions || [];

    const handleTableChange = (current: number, pageSize: number) => {
        setCurrentPage(current);
        setPageSize(pageSize);
    };

    const columns = [
        {
            title: '#',
            key: 'index',
            render: (text: string, record: Permission, index: number) => {
                return (Number(currentPage) - 1) * Number(pageSize) + index + 1;
            },
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: string, record: Permission) => (
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
    ];

    if (isLoading) return <Loader />;
    if (isGetPermissionsError) return <p>Error fetching permissions:  { (getPermissionsError as any)?.data?.message || "An unexpected error occurred."}</p>;

    return (
        <>
            <Input
                placeholder="Search permissions..."
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                }}
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
                dataSource={permissions}
                rowKey="_id"
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalPermissionCount,
                    showSizeChanger: true,
                    onChange: handleTableChange
                }}
            />
        </>
    );
};

export default PermissionList;