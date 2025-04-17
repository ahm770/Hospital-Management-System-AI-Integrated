// src/components/MedicalRecord/MedicalRecordList.tsx
'use client';

import React, { useState } from 'react';
import { useGetMedicalRecordsQuery } from '@/services/medicalRecord/medicalRecordSliceAPI';
import { Table, Button, Space, Input } from 'antd';
import { MedicalRecord } from '@/services/medicalRecord/medicalRecordSliceAPI';
import { EditOutlined, DeleteOutlined, SearchOutlined, CloseOutlined, EyeOutlined, FileTextOutlined  } from '@ant-design/icons';
import Loader from "@/components/Layout/Loader"
import dayjs from 'dayjs'; 

interface MedicalRecordListProps {
    onView?: (record: MedicalRecord) => void;
    onEdit?: (record: MedicalRecord) => void;
    onDelete?: (record: MedicalRecord) => void;  
    onSummary?: (record: MedicalRecord) => void; 
}

const MedicalRecordList: React.FC<MedicalRecordListProps> = ({ onEdit, onView, onDelete, onSummary }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const { data: medicalRecordData, isLoading, isError: isGetMedicalRecordsError, error: getMedicalRecordsError } = useGetMedicalRecordsQuery({
        page: currentPage,
        limit: pageSize,
        search: searchTerm, 
    });

    const totalMedicalRecordsCount = medicalRecordData?.totalRecords || 0;
    const medicalRecords = medicalRecordData?.records || [];

    const handleTableChange = (current:number, pageSize:number) => {
        setCurrentPage(current);
        setPageSize(pageSize);
    };

    const columns = [
        {
            title: '#',
            key: 'index',
            render: (text: string, record: MedicalRecord, index: number) => {
                return (Number(currentPage) - 1) * Number(pageSize) + index + 1;
            },
        },
        {
            title: 'Patient',
            dataIndex: 'patient',
            key: 'patient',
            render: (patient: { firstName: string; lastName: string } | null | undefined) => {
                if (patient && patient.firstName && patient.lastName) {
                    return `${patient.firstName} ${patient.lastName}`;
                } else {
                    return 'N/A';  
                }
            },
        },
        {
            title: 'Doctor',
            dataIndex: 'doctor',
            key: 'doctor',
            render: (doctor: { firstName: string; lastName: string } | null | undefined) => {
                if (doctor && doctor.firstName && doctor.lastName) {
                    return `${doctor.firstName} ${doctor.lastName}`;
                } else {
                    return 'N/A'; // Or another suitable placeholder
                }
            },
        },
        {
            title: 'Diagnosis',
            dataIndex: 'diagnosis',
            key: 'diagnosis',
        },
        {
            title: 'Treatment',
            dataIndex: 'treatment',
            key: 'treatment',
        },
        {
            title: 'Visit Date',
            dataIndex: 'visitDate',
            key: 'visitDate',
                    render: (visitDate: string) => visitDate ? dayjs(visitDate).format('MMMM D, YYYY') : 'N/A', // Format the date
            
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: string, record: MedicalRecord) => (
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
                                       <Button danger icon={<FileTextOutlined />} onClick={() => onSummary(record)}>
                                           AI summary
                                       </Button>
                                   )}
                               </Space>
            ),
        },
    ];

    if (isLoading) return <Loader />;
    if (isGetMedicalRecordsError) return <p>Error fetching medical records: { (getMedicalRecordsError as any)?.data?.message || "An unexpected error occurred."}</p>;

    return (
        <>
             <Input
                placeholder="Search medical records..."
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
                dataSource={medicalRecords}
                rowKey="_id"
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalMedicalRecordsCount,
                    showSizeChanger: true,
                    onChange: handleTableChange,
                }}
            />
        </>
    );
};

export default MedicalRecordList;