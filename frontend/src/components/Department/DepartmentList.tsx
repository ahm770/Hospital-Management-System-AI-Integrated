// src/components/Department/DepartmentList.tsx
'use client';

import React, { useState } from 'react';
import { useGetDepartmentsQuery } from '@/services/department/departmentSliceAPI';
import { Table, Button, Space, Input } from 'antd';
import { Department } from '@/services/department/departmentSliceAPI';
import { EditOutlined, DeleteOutlined, SearchOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import Loader from "@/components/Layout/Loader"

interface DepartmentListProps {
    onView?: (department: Department) => void;
    onEdit?: (department: Department) => void;
    onDelete?: (department: Department) => void;
}

const DepartmentList: React.FC<DepartmentListProps> = ({ onEdit, onView, onDelete }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');

    const { data: departmentData, isLoading, isError: isGetDepartmentsError, error: getDepartmentsError } = useGetDepartmentsQuery({
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
    });

    const totalDepartmentsCount = departmentData?.totalDepartments || 0;
    const departments = departmentData?.departments || [];

    const handleTableChange = (current: number, pageSize: number) => {
        setCurrentPage(current);
        setPageSize(pageSize);
    };

    const columns = [
        {
            title: '#',
            key: 'index',
            render: (text: string, record: Department, index: number) => {
                return (Number(currentPage) - 1) * Number(pageSize) + index + 1;
            },
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: string, record: Department) => (
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
    if (isGetDepartmentsError) return  <p>Error fetching departments: { (getDepartmentsError as any)?.data?.message || "An unexpected error occurred."}</p>

    return (
        <>
            <Input
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                }}
                style={{ marginBottom: 16 }}
                prefix={<SearchOutlined />}
                suffix={searchTerm ? (
                    <CloseOutlined
                        onClick={(e) => {
                            e.preventDefault();
                            setSearchTerm('');
                            setCurrentPage(1);
                        }}
                    />
                ) : null}
            />
            <Table
                columns={columns}
                dataSource={departments}
                rowKey="_id"
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalDepartmentsCount,
                    showSizeChanger: true,
                    onChange: handleTableChange,
                }}
            />
        </>
    );
};

export default DepartmentList;