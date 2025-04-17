// src/components/Task/MyTaskList.tsx
'use client';

import React, { useState } from 'react';
import { useGetMyTasksQuery, Task } from '@/services/task/taskSliceAPI';
import { Table, Space, Button, Input, Select, Tag } from 'antd';
import { EditOutlined, EyeOutlined, SearchOutlined, CloseOutlined, CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import Loader from '@/components/Layout/Loader';
import { useAppSelector } from '@/store/store';
import { useRouter } from 'next/navigation';
import type { TableProps } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs'; // Import dayjs for date formatting

interface MyTaskListProps {
    onView?: (task: Task) => void;
    onEdit?: (task: Task) => void;
    onDelete?: (task: Task) => void;
    onComplete?: (task: Task) => void;
}

interface SorterValue {
    field: string | string[];
    order: 'ascend' | 'descend' | null;
}

const MyTaskList: React.FC<MyTaskListProps> = ({ onView, onEdit, onDelete, onComplete }) => {
    const user = useAppSelector((state) => state.auth.user);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<"pending" | "in_progress" | "completed" | undefined>(undefined);
    const [sortBy, setSortBy] = useState<string | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>(undefined);
    const router = useRouter();

    const { data: taskData, isLoading, isError, error } = useGetMyTasksQuery({
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
        status: statusFilter,
        sortBy: sortBy,
        sortOrder: sortOrder,
    });

    const totalTaskCount = taskData?.totalTasks || 0;

    const handleTableChange: TableProps<Task>['onChange'] = (pagination, filters, sorter) => {
        const { current, pageSize: newPageSize } = pagination ;
        setCurrentPage(current || 1);
        setPageSize(newPageSize || 5);

        if (sorter) {
            const currentSort = sorter as any;
            if (currentSort.field && currentSort.order) {
                setSortBy(currentSort.field.toString());
                setSortOrder(currentSort.order === 'ascend' ? 'asc' : 'desc');
            } else {
                setSortBy(undefined);
                setSortOrder(undefined);
            }
        }
    };

    const columns: ColumnsType<Task> = [
        {
            title: '#',
            key: 'index',
            render: (text: any, record: Task, index: number) => {
                return (Number(currentPage) - 1) * Number(pageSize) + index + 1;
            },
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: (a:any, b:any) => a.title.localeCompare(b.title),
            sortOrder: sortBy === 'title' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
            sortOrder: sortBy === 'createdAt' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
            render: (dateString: string) => dayjs(dateString).format('MMMM D, YYYY h:mm A'),  // Format the date
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: any, record: Task) => (
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
                   {onComplete && record.status !== 'completed' && !(user && record.createdBy && user._id === record.createdBy._id) && (
                    <Button icon={<CheckOutlined />} onClick={() => onComplete(record)}>
                        Complete
                    </Button>
                )}
                </Space>
            ),
        },
    ];

    // Add loading and error state
    if (isLoading) return <Loader />;
    if (isError) return <p>Error fetching tasks: {(error as any)?.data?.message || "An unexpected error occurred."}</p>;

    return (
        <>
            <Input
                placeholder="Search tasks..."
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
            <Select
                placeholder="Filter by Status"
                value={statusFilter}
                onChange={(value) => {
                    setStatusFilter(value);
                    setCurrentPage(1);
                }}
                allowClear
                style={{ marginBottom: 16, display: 'block' }}
            >
                <Select.Option value="pending">Pending</Select.Option>
                <Select.Option value="in_progress">In Progress</Select.Option>
                <Select.Option value="completed">Completed</Select.Option>
            </Select>
            <Table
                columns={columns}
                dataSource={taskData?.tasks}
                rowKey="_id"
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalTaskCount,
                    showSizeChanger: true,
                }}
                onChange={handleTableChange}
            />
        </>
    );
};

export default MyTaskList;