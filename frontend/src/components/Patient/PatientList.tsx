// src/components/Patient/PatientList.tsx
'use client';

import React, { useState } from 'react';
import { useGetPatientsQuery } from '@/services/patient/patientSliceAPI';
import { Table, Button, Space, Input } from 'antd';
import { Patient } from '@/services/patient/types';
import { EditOutlined, DeleteOutlined, SearchOutlined, CloseOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons';
import Loader from "@/components/Layout/Loader";

interface PatientListProps {
    onView?: (patient: Patient) => void;
    onEdit?: (patient: Patient) => void;
    onDelete?: (patient: Patient) => void; 
    onSummary?: (record: Patient) => void; 
}

const PatientList: React.FC<PatientListProps> = ({ onView, onEdit, onDelete, onSummary }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');

    const { data: patientData, isLoading, isError: isGetPatientsError, error: getPatientsError } = useGetPatientsQuery({
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
    });

    const totalPatientsCount = patientData?.totalPatients || 0;
    const patients = patientData?.patients || [];

    const handleTableChange = (current: number, pageSize: number) => {
        setCurrentPage(current);
        setPageSize(pageSize);
    };

    const columns = [
        {
            title: '#',
            key: 'index',
            render: (text: string, record: Patient, index: number) => {
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
            title: 'Action',
            key: 'action',
            render: (text: string, record: Patient) => (
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
                                    {onSummary && (
                                            <Button icon={<FileTextOutlined />} onClick={() => onSummary(record)}>
                                            AI summary Medical records
                                            </Button>
                                        )}
                                 </Space>
            ),
        },
    ];

    if (isLoading) return <Loader />
    if (isGetPatientsError) return <p>Error fetching patients:  { (getPatientsError as any)?.data?.message || "An unexpected error occurred."}</p>;

    return (
        <>
            <Input
                placeholder="Search patients..."
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
                dataSource={patients}
                rowKey="_id"
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalPatientsCount,
                    showSizeChanger: true,
                    onChange: handleTableChange,
                }}
            />
        </>
    );
};

export default PatientList;