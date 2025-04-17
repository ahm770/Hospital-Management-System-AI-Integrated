// src/components/Shift/ShiftList.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { useGetShiftsQuery, Shift } from '@/services/shift/shiftSliceAPI';
import { Table, Space, Input, Tag, Button, DatePicker, Select } from 'antd';
import { EyeOutlined, SearchOutlined, CloseOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Loader from "@/components/Layout/Loader";
import { useAppSelector } from '@/store/store';
import dayjs from 'dayjs';
import type { ColumnsType, TableProps } from 'antd/es/table';
import type { FilterValue, SorterResult, TableCurrentDataSource, TablePaginationConfig } from 'antd/es/table/interface';
import type { Dayjs } from 'dayjs';
import { useGetDepartmentsQuery, Department } from "@/services/department/departmentSliceAPI";

interface ShiftListProps {
    onView?: (shift: Shift) => void;
    onEdit?: (shift: Shift) => void;
    onDelete?: (shift: Shift) => void;
}

interface SorterValue {
    field: string | string[];
    order: 'ascend' | 'descend' | null;
}

const ShiftList: React.FC<ShiftListProps> = ({ onView, onEdit, onDelete }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<string | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>(undefined);
    const [filterDate, setFilterDate] = useState<string | undefined>(undefined);
    const [filterDepartment, setFilterDepartment] = useState<string | undefined>(undefined);

    const { data: departmentsData } = useGetDepartmentsQuery({});

    const { data: shiftData, isLoading, isError, error } = useGetShiftsQuery({
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
        date: filterDate,
        sortBy: sortBy,
        sortOrder: sortOrder,
        department: filterDepartment,
    });
console.log("shift data::", shiftData)
    const totalShiftCount = shiftData?.totalShifts || 0;

    const handleTableChange: TableProps<Shift>['onChange'] = (pagination, filters, sorter) => {
          const { current, pageSize: newPageSize } = pagination;
        setCurrentPage(current || 1);
        setPageSize(newPageSize || 5);

           if (sorter) {
               const currentSort = Array.isArray(sorter) ? sorter[0] : sorter;
               if (currentSort && currentSort.field && currentSort.order) {
                   setSortBy(currentSort.field.toString());
                   setSortOrder(currentSort.order === 'ascend' ? 'asc' : 'desc');
               } else {
                   setSortBy(undefined);
                   setSortOrder(undefined);
               }
           }
     };

    
      const handleDateChange = (date: Dayjs | null, dateString: string | string[]) => {
            const formattedDate = typeof dateString === 'string' ? dateString : dateString[0]; // Use the first selected date if it's an array
    
            setFilterDate(formattedDate || undefined); // Convert to YYYY-MM-DD format, set undefined if cleared
            setCurrentPage(1); // Reset page when filtering
        };

    const handleDepartmentChange = (value: string | undefined) => {
        setFilterDepartment(value); // Directly use department ID for filtering
        setCurrentPage(1); // Reset page when filtering
    };

    const columns: ColumnsType<Shift> = useMemo(() => [
        {
            title: '#',
            key: 'index',
            render: (text: string, record: Shift, index: number) => {
                return (Number(currentPage) - 1) * Number(pageSize) + index + 1;
            },
        },
        {
            title: 'Staff',
            dataIndex: 'staff',
            key: 'staff',
            render: (staff: { firstName: string; lastName: string } | null) => {
                if (staff) {
                    return `${staff.firstName} ${staff.lastName}`;
                } else {
                    return 'N/A'; // Or any other appropriate placeholder
                }
            },
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
            sorter: (a: Shift, b: Shift) => dayjs(a.date).unix() - dayjs(b.date).unix(),
             sortOrder: sortBy === 'date' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
            render: (date: string) => date ? dayjs(date).format('MMMM D, YYYY') : 'N/A',
        },
        {
            title: 'Start Time',
            dataIndex: 'startTime',
            key: 'startTime',
            render: (startTime: string) => startTime ? dayjs(startTime, 'HH:mm').format('h:mm A') : 'N/A',
        },
        {
            title: 'End Time',
            dataIndex: 'endTime',
            key: 'endTime',
            render: (endTime: string) => endTime ? dayjs(endTime, 'HH:mm').format('h:mm A') : 'N/A',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'default';
                if (status === 'scheduled') color = 'blue';
                if (status === 'completed') color = 'green';
                if (status === 'cancelled') color = 'red';
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: string, record: Shift) => (
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
    ], [currentPage, pageSize, onView, sortBy, sortOrder, onEdit, onDelete]);

    if (isLoading || !departmentsData) return <Loader />;
    if (isError) return  <p>Error fetching shifts: { (error as any)?.data?.message || "An unexpected error occurred."}</p>

    return (
        <>
            <Input
                placeholder="Search shifts..."
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
                            setCurrentPage(1);
                        }}
                    />
                ) : null}
            />
             <Space style={{ marginBottom: 16, display: 'block' }}>
            <DatePicker
                onChange={handleDateChange}
                style={{  display: 'block' }}
                format="YYYY-MM-DD" // Enforce YYYY-MM-DD format
                placeholder="Filter by Date"
            />

            <Select
                placeholder="Filter by Department"
                style={{  display: 'block' }}
                onChange={handleDepartmentChange}
                allowClear
            >
                {departmentsData?.departments?.map((department: Department) => (
                    <Select.Option key={department._id} value={department._id}>
                        {department.name}
                    </Select.Option>
                ))}
            </Select>
                 </Space>
            <Table
                columns={columns}
                dataSource={shiftData?.shifts}
                rowKey="_id"
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalShiftCount,
                    showSizeChanger: true,
                }}
                 onChange={handleTableChange}
            />
        </>
    );
};

export default ShiftList;