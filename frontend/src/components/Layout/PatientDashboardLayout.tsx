// src/components/Layout/PatientDashboardLayout.tsx
import React, { ReactNode } from 'react';
import { Layout, Menu, Typography } from 'antd';
import {
    UserOutlined,
    NotificationOutlined,
    FileTextOutlined,
    CalendarOutlined,
    ProfileOutlined,
    KeyOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useAppSelector } from '@/store/store';
import { usePathname } from 'next/navigation';

const { Header, Content, Sider } = Layout;

interface PatientDashboardLayoutProps {
    children: ReactNode;
}

const PatientDashboardLayout: React.FC<PatientDashboardLayoutProps> = ({ children }) => {
    const user = useAppSelector((state) => state.auth.user);
    const pathname = usePathname();
    const selectedKey = () => {

        if (pathname === "/dashboard/patient/notification") {
            return '2';
        } else if (pathname === "/dashboard/patient/medical-record") {
            return '3';
        } else if (pathname === "/dashboard/patient/appointment") {
            return '4';
        }
         else if (pathname === '/auth/profile') {
             return '5';
         } else if (pathname === '/auth/password-reset') {
             return '6';
         }
        else {
            return '1'
        }
    }
    const menuItems = [
        {
            key: '1',
            icon: <UserOutlined />,
            label: <Link href="/dashboard/patient">Dashboard</Link>,
        },
        {
            key: '2',
            icon: <NotificationOutlined />,
            label: <Link href="/dashboard/patient/my-notification">Notifications</Link>,
        },
        {
            key: '3',
            icon: <FileTextOutlined />,
            label: <Link href="/dashboard/patient/medical-record">Medical Records</Link>,
        },
        {
            key: '4',
            icon: <CalendarOutlined />,
            label: <Link href="/dashboard/patient/appointment">Appointments</Link>,
        },
        {
            key: '5',
            icon: <UserOutlined />,
            label: <Link href="/auth/profile">Profile View</Link>,
        },
        {
            key: '6',
            icon: <UserOutlined />,
            label: <Link href="/auth/password-reset">Password Reset</Link>,
        },

    ];

    return (
        <Layout>
            <Header className="header" style={{ backgroundColor: '#fff' }}>
                <div className="logo" style={{ float: 'left', width: '120px', height: '31px', margin: '16px 24px 16px 0', background: 'rgba(255,255,255,.3)' }}>
                    <Typography.Title level={5} style={{ color: 'black' }}>Hospital MS</Typography.Title>
                </div>
                <Typography.Text style={{ float: 'right', color: 'black', margin: '24px' }}>Patient</Typography.Text>
            </Header>
            <Layout>
                <Sider width={200} className="site-layout-background" style={{ backgroundColor: '#fff' }}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1', 'sub2']}
                        style={{ height: '100%', borderRight: 0 }}
                        items={menuItems}
                        selectedKeys={[selectedKey()]}
                    />
                </Sider>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content
                        className="site-layout-background"
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                        }}
                    >
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default PatientDashboardLayout;