// src/components/Layout/Header.tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Layout, Typography, Button, Space, Avatar, Dropdown, Menu, Badge, message } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useRouter } from 'next/navigation';
import { UserOutlined, BellOutlined } from '@ant-design/icons';
import { useLogoutMutation } from '@/services/auth/authSliceAPI';
import { persistor } from '@/store/store';
import { logout } from '@/services/auth/authSlice';
import Link from 'next/link';
import { useGetMyNotificationsQuery  } from '@/services/notification/notificationSliceAPI';
import type {  Notification as NotificationType } from '@/services/notification/notificationSliceAPI'; // Import API Notification Type
import { getSocket } from '@/services/socket/socket';

const { Header } = Layout;
const { Title, Text } = Typography;

const AppHeader: React.FC = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const user = useAppSelector((state) => state.auth.user);
    const token = useAppSelector((state) => state.auth.token);
    const [logoutMutation, { isLoading }] = useLogoutMutation();
    const [messageApi, contextHolder] = message.useMessage();

    const [notifications, setNotifications] = useState<NotificationType[]>([]); // State to hold notifications
    const [unreadCount, setUnreadCount] = useState(0);

    //RTK Query Call:
    const { data: notificationsData, isLoading: isNotificationsLoading, isError: isNotificationsError, refetch } = useGetMyNotificationsQuery({
        read:false
    });

    const showNotification = (notification: NotificationType) => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'granted') {
                new window.Notification(notification.message, { // Correct to Window.Notification
                    body: `Type: ${notification.type}, Priority: ${notification.priority}`,
                    icon: '/icon.png', // Optional: Replace with your icon URL
                });
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        new window.Notification(notification.message, {
                            body: `Type: ${notification.type}, Priority: ${notification.priority}`,
                            icon: '/icon.png',
                        });
                    }
                });
            }
        }
    };

    const setupSocket = useCallback(() => {
        if (user && token) {
            const socket = getSocket();

            socket.auth = (cb: any) => {
                cb({ token: token });
            };

            socket.connect();

            const handleNewNotification = (notification: NotificationType) => {
                setNotifications((prevNotifications) => [notification, ...prevNotifications]);
                showNotification(notification);
                refetch(); // Refresh the notifications list from the API
            };

            const handleNotificationCount = (data: { count: number }) => {
                console.log("the count ::", data.count);
                setUnreadCount(data.count);
            };

            socket.on("connect", () => {
                console.log("socket is connected!");
                refetch()
            });

            socket.on('newNotification', handleNewNotification);
            socket.on("notificationCount", handleNotificationCount);

            socket.on('disconnect', () => {
                console.log('Socket disconnected');
            });

            return () => {
                socket.off('connect');
                socket.off('newNotification', handleNewNotification);
                socket.off('notificationCount', handleNotificationCount);
                socket.off('disconnect');
                socket.disconnect();
            };
        }
        return () => {};
    }, [user, refetch, token, setNotifications]);

    useEffect(() => {
        let cleanup = () => {};
        if (user && token) {
            cleanup = setupSocket();
        }

        return () => {
            cleanup();
        };
    }, [user, token, setupSocket]);

     useEffect(() => {
         if (notificationsData?.notifications) {
             setNotifications(notificationsData.notifications);
         }
     }, [notificationsData]);

    useEffect(() => {
         if (notifications) {
             const count = notifications.length;
             setUnreadCount(count);
         }
     }, [notifications]);

    const handleLogout = async () => {
        try {
            try {
                await logoutMutation().unwrap();
            } catch (e) {
                console.log("no logout function", e)
            }
            dispatch(logout());
            persistor.purge();
            window.location.href = '/auth'; // Full page reload
        } catch (error: any) {
            console.error('Logout failed:', error.data.message || error.error);
        }
    };

    const getNotificationLink = () => {
        if (user?.userType?.toLowerCase() === 'patient') {
            return `/dashboard/patient/my-notification`;
        } else if (user?.userType?.toLowerCase() === 'staff' && user.role?.name) {
            return `/dashboard/staff/${user.role.name.toLowerCase()}/notification/my-notification`;
        } else {
            return '/auth';  
        }
    };
    const menuItems = [
        {
            key: 'logout',
            label: 'Logout',
            onClick: handleLogout,
            loading: isLoading ? true : undefined, //Conditional rendering for the menu items
        },
    ];

    const menu = { items: menuItems };

    return (
        <Header style={{
            backgroundColor: '#fff',
            padding: '0 50px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '64px',
            boxShadow: '0 2px 4px 0 rgba(0,0,0,0.1)',
        }}>
            {contextHolder}
            <div>
                <Title level={3} style={{ color: '#1890ff', margin: 0, float: 'left', marginRight: '20px' }}>
                    Hospital Managememt System
                </Title>

            </div>
            {user ? (
               <Space align="center">
               <Link href={getNotificationLink()}>
                    <Badge count={unreadCount}>
                        <Avatar icon={<BellOutlined />} style={{ cursor: 'pointer' }} />
                    </Badge>
               </Link>
               <Text>
                   {user.firstName} {user.lastName} ({user.userType})
               </Text>
               <Dropdown menu={menu} placement="bottomRight" arrow>
                   <a onClick={e => e.preventDefault()}>
                       <Avatar icon={<UserOutlined />} />
                   </a>
               </Dropdown>
              
           </Space>
            ) : (
                <Link href="/auth">
                    <Button type="primary">
                        Login
                    </Button>
                </Link>
            )}
        </Header>
    );
};

export default AppHeader;