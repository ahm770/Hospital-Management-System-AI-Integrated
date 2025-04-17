// src/components/Layout/DoctorDashboardLayout.tsx
import React, { ReactNode } from 'react';
import { Layout, Menu, Typography } from 'antd';
import {
    CalendarOutlined,
    FileTextOutlined,
    UserOutlined,
    NotificationOutlined,
    UnorderedListOutlined,
    ScheduleOutlined, 
    ProfileOutlined,
    KeyOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useAppSelector } from '@/store/store';
import { usePathname } from 'next/navigation';

const { Header, Content, Sider } = Layout;

interface DoctorDashboardLayoutProps {
    children: ReactNode;
}

const DoctorDashboardLayout: React.FC<DoctorDashboardLayoutProps> = ({ children}) => {
    const user = useAppSelector((state) => state.auth.user);
    const pathname = usePathname();
    const role = "Doctor";
    const dashboardRoute = "/dashboard/staff/doctor" 

    const getSelectedKey = () => {
        if (pathname === dashboardRoute) {
            return '1';
        } else if (pathname === `${dashboardRoute}/appointment`) {
            return '7';
        } else if (pathname === `${dashboardRoute}/medical-record`) {
            return '8';
        } else if (pathname === `${dashboardRoute}/patient`) {
            return '9';
        } else if (pathname === `${dashboardRoute}/task/my-task`) {
            return '10';
        } else if (pathname === `${dashboardRoute}/notification/my-notification`) {
            return '11';
        } else if (pathname === `${dashboardRoute}/shift/my-shift`) {  
            return '12';
        }
        else if (pathname === '/dashboard/staff/doctor/profileview') {  
             return '13';
         } else if (pathname === '/dashboard/staff/doctor/passwordreset') {  
            return '14';
         }
        else {
            return '1';
        }
    };

    const selectedKey = getSelectedKey();

    const menuItems = [
          {
            key: 'sub1',
            label: 'Management',
            children: [
                { key: '1', label: <Link href={dashboardRoute}>Dashboard</Link> },
                { key: '7', label: <Link href="/dashboard/staff/doctor/appointment">Appointments</Link>, icon: <CalendarOutlined /> },
                { key: '8', label: <Link href="/dashboard/staff/doctor/medical-record">Medical Records</Link>, icon: <FileTextOutlined /> },
                { key: '9', label: <Link href="/dashboard/staff/doctor/patient">Patients</Link>, icon: <UserOutlined /> },
            ],
        },

          {
            key: 'sub2',
            icon: <NotificationOutlined />,
            label: 'My Panel',
            children: [
                { key: '10', label: <Link href="/dashboard/staff/doctor/task/my-task">My Tasks</Link>, icon: <UnorderedListOutlined /> },
                { key: '11', label: <Link href="/dashboard/staff/doctor/notification/my-notification">Notifications</Link>, icon: <NotificationOutlined /> },
                 { key: '12', label: <Link href="/dashboard/staff/doctor/shift/my-shift">My Shifts</Link>, icon: <ScheduleOutlined /> },
            ],
        },
        {
            key: 'sub3',
            icon: <UserOutlined />,
            label: 'My Account',
            children: [
                { key: '13', label: <Link href="/auth/profile">Profile View</Link>, icon: <ProfileOutlined/>},
                { key: '14', label:  <Link href="/auth/password-reset">Password Reset</Link>, icon: <KeyOutlined/> },
            ],
        },

    ];

    return (
        <Layout>
            <Header className="header" style={{ backgroundColor: '#fff' }}>
                <div className="logo" style={{ float: 'left', width: '120px', height: '31px', margin: '16px 24px 16px 0', background: 'rgba(255,255,255,.3)' }}>
                    <Typography.Title level={5} style={{ color: 'black' }}>Hospital MS</Typography.Title>
                </div>
                <Typography.Text style={{ float: 'right', color: 'black', margin: '24px' }}>Role: {role}</Typography.Text>
            </Header>
            <Layout>
                <Sider width={200} className="site-layout-background" style={{ backgroundColor: '#fff' }}>
                    <Menu
                        mode="inline"
                        selectedKeys={[selectedKey]}
                        defaultOpenKeys={['sub1', 'sub2']}
                        style={{ height: '100%', borderRight: 0 }}
                        items={menuItems}
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

export default DoctorDashboardLayout;