// src/components/Layout/AdminDashboardLayout.tsx
import React, { ReactNode } from 'react';
import { Layout, Menu, Typography } from 'antd';
import {
    UserOutlined,
    LaptopOutlined,
    CalendarOutlined,
    FileTextOutlined,
    TeamOutlined,
    SolutionOutlined,
    ApartmentOutlined,
    SettingOutlined,
    KeyOutlined,
    ClockCircleOutlined, // Add calendar icon
    NotificationOutlined,
    UnorderedListOutlined,
    ProfileOutlined,
    ScheduleOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useAppSelector } from '@/store/store';
import { usePathname } from 'next/navigation';
// Add calendar icon

const { Header, Content, Sider } = Layout;

interface DashboardLayoutProps {
    children: ReactNode;
}

const AdminDashboardLayout: React.FC<DashboardLayoutProps> = ({ children}) => {
    const user = useAppSelector((state) => state.auth.user);
    const pathname = usePathname();
    const role= "Admin"
    const dashboardRoute = "/dashboard/staff/admin"


    const getSelectedKey = () => {
       if (pathname === dashboardRoute) {
            return '1';
        } else if (pathname === `${dashboardRoute}/patient`) {
            return '2';
        } else if (pathname === `${dashboardRoute}/staff`) {
            return '3';
        } else if (pathname === `${dashboardRoute}/department`) {
            return '4';
         } else if (pathname === `${dashboardRoute}/appointment`) {
            return '5';
        } else if (pathname === `${dashboardRoute}/medical-record`) {
            return '6';
        } else if (pathname === `${dashboardRoute}/shift`) {
            return '7'; // Shifts
        } else if (pathname === `${dashboardRoute}/task`) {  
            return '8';
        } else if (pathname === `${dashboardRoute}/task/my-task`) {  
            return '9';
        } else if (pathname === `${dashboardRoute}/notification/my-notification`) {  
            return '10';
        } else if (pathname === `${dashboardRoute}/shift/my-shift`) {
          return '11';
        }
        else if (pathname === '/dashboard/staff/admin/profileview') {  
            return '12';
        } else if (pathname === '/dashboard/staff/admin/passwordreset') {  
            return '13';
        }
        else {
            return '1';
        }
    };

    const selectedKey = getSelectedKey();

    const menuItems = [
         {
            key: 'sub1',
            icon: <UserOutlined />,
            label: 'Management',
            children: [
                { key: '1', label: <Link href={dashboardRoute}>Dashboard</Link> },
                { key: '2', label: <Link href="/dashboard/staff/admin/patient">Patients</Link>, icon: <SolutionOutlined /> },
                { key: '3', label: <Link href="/dashboard/staff/admin/staff">Staff</Link>, icon: <TeamOutlined /> },
                { key: '4', label: <Link href="/dashboard/staff/admin/department">Departments</Link>, icon: <ApartmentOutlined /> },
                { key: '5', label: <Link href="/dashboard/staff/admin/appointment">Appointments</Link>, icon: <CalendarOutlined /> },
                { key: '6', label: <Link href="/dashboard/staff/admin/medical-record">Medical Records</Link>, icon: <FileTextOutlined /> },
                { key: '7', label: <Link href="/dashboard/staff/admin/shift">Shifts</Link>, icon: <ClockCircleOutlined /> },
                { key: '8', label: <Link href="/dashboard/staff/admin/task">Tasks</Link>, icon: <UnorderedListOutlined /> },
            ],
        },

         {
            key: 'sub2',
            icon: <NotificationOutlined />,
            label: 'My Panel',
            children: [
                { key: '9', label: <Link href="/dashboard/staff/admin/task/my-task">My Tasks</Link>, icon: <UnorderedListOutlined /> },
                { key: '10', label: <Link href="/dashboard/staff/admin/notification/my-notification">Notifications</Link>, icon: <NotificationOutlined /> },
                { key: '11', label: <Link href="/dashboard/staff/admin/shift/my-shift">My Shifts</Link>, icon: <ScheduleOutlined/> },

            ],
        },
        {
            key: 'sub3',
            icon: <LaptopOutlined />,
            label: 'My Account',
            children: [
                { key: '12', label: <Link href="/auth/profile">Profile View</Link>, icon: <ProfileOutlined/>},
                { key: '13', label:  <Link href="/auth/password-reset">Password Reset</Link>, icon: <KeyOutlined/> },
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

export default AdminDashboardLayout;