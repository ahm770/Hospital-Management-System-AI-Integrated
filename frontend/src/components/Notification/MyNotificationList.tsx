// src/components/Notification/MyNotificationList.tsx
'use client';

import React, { useState } from 'react';
import { useGetMyNotificationsQuery, Notification } from '@/services/notification/notificationSliceAPI';
import { useMarkMyNotificationAsReadMutation, useMarkAllMyNotificationsAsReadMutation } from '@/services/notification/notificationSliceAPI';
import { Table, Input, Space, Button, Tag, Select, message } from 'antd';
import { CheckOutlined, SearchOutlined, CloseOutlined } from '@ant-design/icons';
import Loader from '@/components/Layout/Loader';
import { useAppSelector } from '@/store/store';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import type {  TableProps, TablePaginationConfig } from 'antd';
import { ColumnsType } from 'antd/es/table';
import logger from '@/utils/logger';

interface MyNotificationListProps {
    onView?: (notification: Notification) => void;
    onEdit?: (notification: Notification) => void;
    onDelete?: (notification: Notification) => void;
}

interface SorterValue {
    field: string | string[];
    order: 'ascend' | 'descend' | null;
}

const MyNotificationList: React.FC<MyNotificationListProps> = ({ onView, onEdit, onDelete }) => {
    const user = useAppSelector((state) => state.auth.user);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
    const [priorityFilter, setPriorityFilter] = useState<string | undefined>(undefined);
    const [sortBy, setSortBy] = useState<string | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>(undefined);
    const [readFilter, setReadFilter] = useState<boolean | undefined>(undefined);
    const [selectedNotificationId,setSelectedNotificationId] =  useState<string | null>(null)
    const [markNotificationAsRead, { isLoading: isMarkingRead }] = useMarkMyNotificationAsReadMutation();
    const [markAllNotificationsAsRead, { isLoading: isMarkingAllRead }] = useMarkAllMyNotificationsAsReadMutation(); 
    const [messageApi, contextHolder] = message.useMessage();

    const { data: notificationData, isLoading, isError, error } = useGetMyNotificationsQuery({
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
        type: typeFilter,
        priority: priorityFilter,
        sortBy: sortBy,
        sortOrder: sortOrder,
        read: readFilter,
    });

    const totalNotificationCount = notificationData?.totalNotifications || 0;

  const handleTableChange = (pagination: TablePaginationConfig, filters: any, sorter: any) => {
        const { current, pageSize: newPageSize } = pagination;
        setCurrentPage(current || 1);
        setPageSize(newPageSize || 5);

        if (sorter) {
            const currentSort = sorter as SorterValue;
            if (currentSort.field && currentSort.order) {
                setSortBy(currentSort.field.toString());
                setSortOrder(currentSort.order === 'ascend' ? 'asc' : 'desc');
            } else {
                setSortBy(undefined);
                setSortOrder(undefined);
            }
        }
    };

    const handleMarkAsRead = async (id: string) => {
        setSelectedNotificationId(id);
        try {
            await markNotificationAsRead(id).unwrap();
            console.log(`Notification ${id} marked as read.`);
        } catch (error: any) {
            logger.error(`Error marking notification as read:`, error);
            const errorMessage = `Failed to update medical record: ${error?.data.message || 'Unknown error'}`;
            messageApi.error(errorMessage);
        }   finally {
            setSelectedNotificationId(null);  
        }
    };

     const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead().unwrap();
            console.log('All notifications marked as read.');
        } catch (error: any) {
            logger.error(`Error marking notification as read:`, error);
            const errorMessage = `Failed to update medical record: ${error?.data.message || 'Unknown error'}`;
            messageApi.error(errorMessage);
           
        }
    };

    const columns: ColumnsType<Notification> = [
        {
            title: '#',
            key: 'index',
            render: (text: any, record: Notification, index: number) => {
                return (Number(currentPage) - 1) * Number(pageSize) + index + 1;
            },
        },
        {
            title: 'Message',
            dataIndex: 'message',
            key: 'message',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
                render: (priority: string) => (
                    <Tag color={priority === 'urgent' ? 'red' : priority === 'warning' ? 'yellow' : 'blue'}>
                        {priority.toUpperCase()}
                    </Tag>
                ),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
            sortOrder: sortBy === 'createdAt' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
            render: (dateString: string) => dayjs(dateString).format('MMMM D, YYYY h:mm A'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: string, record: Notification) => (
                 <Space size="middle">
                   <Button
                        icon={<CheckOutlined />}
                        onClick={() => handleMarkAsRead(record._id)}
                        loading={isMarkingRead && selectedNotificationId === record._id}
                        disabled={record.isRead}
                    >
                        Mark as Read
                    </Button>
                </Space>
            ),
        },
    ];

    if (isLoading) return <Loader />;
    if (isError) return <p>Error fetching notifications: {(error as any)?.data?.message || "An unexpected error occurred."}</p>;

    return (
        <>
            {contextHolder}
            <Input
                placeholder="Search notifications..."
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

            {/* Filters */}
            <Space style={{ marginBottom: 16 }}>
                <Select
                    placeholder="Filter by Type"
                    style={{ width: 150 }}
                    onChange={(value) => { setTypeFilter(value); setCurrentPage(1); }}
                    allowClear
                >
                    <Select.Option value="appointment">Appointment</Select.Option>
                    <Select.Option value="medical_record">Medical Record</Select.Option>
                    <Select.Option value="reminder">Reminder</Select.Option>
                    <Select.Option value="system">System</Select.Option>
                    <Select.Option value="shift">Shift</Select.Option>
                </Select>
                <Select
                    placeholder="Filter by Priority"
                    style={{ width: 150 }}
                    onChange={(value) => { setPriorityFilter(value); setCurrentPage(1); }}
                    allowClear
                >
                    <Select.Option value="urgent">Urgent</Select.Option>
                    <Select.Option value="warning">Warning</Select.Option>
                    <Select.Option value="info">Info</Select.Option>
                </Select>
                 <Select
                        placeholder="Filter by Read Status"
                        style={{ width: 150 }}
                        onChange={(value) => {
                            setReadFilter(value === "true" ? true : value === "false" ? false : undefined);
                            setCurrentPage(1);
                        }}
                        allowClear
                    >
                        <Select.Option value="true">Read</Select.Option>
                        <Select.Option value="false">Unread</Select.Option>
                    </Select>
                  
                  <Button
                      type="primary"
                      onClick={handleMarkAllAsRead}
                      loading={isMarkingAllRead}
                      disabled={!notificationData?.notifications || notificationData.notifications.every(n => n.isRead)}
                  >
                      Mark All as Read
                  </Button>
            </Space>
            <Table
                columns={columns}
                dataSource={notificationData?.notifications}
                rowKey="_id"
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalNotificationCount,
                    showSizeChanger: true,
                  
                }}
                  onChange={handleTableChange}
            />
        </>
    );
};

export default MyNotificationList;