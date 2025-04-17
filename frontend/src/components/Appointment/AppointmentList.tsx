// src/components/Appointment/AppointmentList.tsx
'use client';

import React, { useState } from 'react';
import { useGetAppointmentsQuery } from '@/services/appointment/appointmentSliceAPI';
import { Table, Button, Space, Input } from 'antd';
import { Appointment } from '@/services/appointment/appointmentSliceAPI';
import { EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined, CloseOutlined } from '@ant-design/icons';
import Loader from "@/components/Layout/Loader"
import dayjs from 'dayjs'; 
import logger from "@/utils/logger"

interface AppointmentListProps {
    onView?: (appointment: Appointment) => void;
    onEdit?: (appointment: Appointment) => void;
    onDelete?: (appointment: Appointment) => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ onEdit, onView, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const { data: appointmentData, isLoading, isError, error } = useGetAppointmentsQuery({
        page: currentPage,
        limit: pageSize,
        search: searchTerm
    });
    logger.silly("appointmentlist::", appointmentData)

    const totalAppointmentCount = appointmentData?.totalAppointments || 0;

    const handleTableChange = (current:number, pageSize:number) => {
        setCurrentPage(current);
        setPageSize(pageSize);
   };

    const columns = [
        {
            title: 'Patient',
            dataIndex: 'patient',
            key: 'patient',
            render: (patient: { firstName: string; lastName: string }) => `${patient.firstName} ${patient.lastName}`,
        },
        {
            title: 'Doctor',
            dataIndex: 'doctor',
            key: 'doctor',
            render: (doctor: { firstName: string; lastName: string }) => `${doctor.firstName} ${doctor.lastName}`,
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
            render: (department: { name: string }) => department.name,
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date: string) => date ? dayjs(date).format('MMMM D, YYYY') : 'N/A', // Format the date
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: string, record: Appointment) => (
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
    if (isError) return <p>Error fetching appointments:  { (error as any)?.data?.message || "An unexpected error occurred."}</p>;

    return (
        <>
             <Input
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on new search
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
                dataSource={appointmentData?.appointments}
                rowKey="_id"
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalAppointmentCount,
                    showSizeChanger: true,
                    onChange: handleTableChange,
                }}
            />
        </>
    );
};

export default AppointmentList;