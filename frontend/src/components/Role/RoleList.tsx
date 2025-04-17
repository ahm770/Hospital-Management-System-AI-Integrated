// src/components/role/RoleList.tsx
'use client';

import React, { useState } from 'react';
import { useGetRolesQuery, Role } from '@/services/role/roleSliceAPI';
import { Table, Button, Space, Input } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import Loader from "@/components/Layout/Loader"

interface RoleListProps {
    onView?: (role: Role) => void;
    onEdit?: (role: Role) => void;
    onDelete?: (role: Role) => void;
}

const RoleList: React.FC<RoleListProps> = ({ onView, onEdit, onDelete }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');

    const { data: roleData, isLoading, isError: isGetRolesError, error: getRolesError } = useGetRolesQuery({
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
    });

    const totalRoleCount = roleData?.totalRoles || 0;
    const roles = roleData?.roles || [];

    const handleTableChange = (current: number, pageSize: number) => {
        setCurrentPage(current);
        setPageSize(pageSize);
    };

    const columns = [
        {
            title: '#',
            key: 'index',
            render: (text: string, record: Role, index: number) => {
                return (Number(currentPage) - 1) * Number(pageSize) + index + 1;
            },
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Permissions',
            dataIndex: 'permissions',
            key: 'permissions',
            render: (permissions: any[]) => (
                <span>{permissions?.map((perm) => perm.action).join(', ')}</span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: string, record: Role) => (
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
    if (isGetRolesError) return <p>Error fetching roles:  { (getRolesError as any)?.data?.message || "An unexpected error occurred."}</p>;

    return (
        <>
            <Input
                placeholder="Search roles..."
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
                dataSource={roles}
                rowKey="_id"
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalRoleCount,
                    showSizeChanger: true,
                    onChange: handleTableChange,
                }}
            />
        </>
    );
};

export default RoleList;