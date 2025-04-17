// src/components/Layout/SuperAdminDashboardLayout.tsx
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
    ClockCircleOutlined,
    NotificationOutlined,
    UnorderedListOutlined, // Add the list icon for tasks
    ScheduleOutlined,
    ProfileOutlined, //Imported the profile outline to be use for MyAccount
} from '@ant-design/icons';
import Link from 'next/link';
import { useAppSelector } from '@/store/store';
import { usePathname } from 'next/navigation';

const { Header, Content, Sider } = Layout;

interface DashboardLayoutProps {
    children: ReactNode;
}

const SuperAdminDashboardLayout: React.FC<DashboardLayoutProps> = ({ children}) => {
    const user = useAppSelector((state) => state.auth.user);
    const pathname = usePathname();
    const role= "Super Admin"
    const dashboardRoute = "/dashboard/staff/super-admin"
    const getSelectedKey = () => {
        if (pathname === dashboardRoute) {
            return '1';
        } else if (pathname === '/dashboard/staff/super-admin/patient') {
            return '2';
        } else if (pathname === '/dashboard/staff/super-admin/staff') {
            return '3';
        } else if (pathname === '/dashboard/staff/super-admin/department') {
            return '4';
        } else if (pathname === '/dashboard/staff/super-admin/role') {
            return '5';
        } else if (pathname === '/dashboard/staff/super-admin/permission') {
            return '6';
        } else if (pathname === '/dashboard/staff/super-admin/appointment') {
            return '7';
        } else if (pathname === '/dashboard/staff/super-admin/medical-record') {
            return '8';
        } else if (pathname === '/dashboard/staff/super-admin/shift') {
            return '9';
        } else if (pathname === '/dashboard/staff/super-admin/task') {
            return '10';  
        }  else if (pathname === '/dashboard/staff/super-admin/task/my-task') {  
            return '11';
        } else if (pathname === '/dashboard/staff/super-admin/notification/my-notification') { 
            return '12';
        } else if (pathname === '/dashboard/staff/super-admin/shift/my-shift') {  
            return '13';
        }
        else if (pathname === '/dashboard/staff/super-admin/profileview') {  
             return '14';
         } else if (pathname === '/dashboard/staff/super-admin/passwordreset') {  
             return '15';
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
                { key: '2', label: <Link href="/dashboard/staff/super-admin/patient">Patients</Link>, icon: <SolutionOutlined /> },
                { key: '3', label: <Link href="/dashboard/staff/super-admin/staff">Staff</Link>, icon: <TeamOutlined /> },
                { key: '4', label: <Link href="/dashboard/staff/super-admin/department">Departments</Link>, icon: <ApartmentOutlined /> },
                { key: '5', label: <Link href="/dashboard/staff/super-admin/role">Roles</Link>, icon: <SettingOutlined /> },
                { key: '6', label: <Link href="/dashboard/staff/super-admin/permission">Permissions</Link>, icon: <KeyOutlined /> },
                { key: '7', label: <Link href="/dashboard/staff/super-admin/appointment">Appointments</Link>, icon: <CalendarOutlined /> },
                { key: '8', label: <Link href="/dashboard/staff/super-admin/medical-record">Medical Records</Link>, icon: <FileTextOutlined /> },
                { key: '9', label: <Link href="/dashboard/staff/super-admin/shift">Shifts</Link>, icon: <ClockCircleOutlined /> },
                { key: '10', label: <Link href="/dashboard/staff/super-admin/task">Tasks</Link>, icon: <UnorderedListOutlined /> },
            ],
        },

        {
            key: 'sub2',
            icon: <NotificationOutlined />,
            label: 'My Panel',
            children: [
                { key: '11', label: <Link href="/dashboard/staff/super-admin/task/my-task">My Tasks</Link>, icon: <UnorderedListOutlined /> },
                { key: '12', label: <Link href="/dashboard/staff/super-admin/notification/my-notification">Notifications</Link>, icon: <NotificationOutlined /> },
                 { key: '13', label: <Link href="/dashboard/staff/super-admin/shift/my-shift">My Shifts</Link>, icon: <ScheduleOutlined /> },
            ],
        },
        {
            key: 'sub3',
            icon: <LaptopOutlined />,
            label: 'My Account',
            children: [
                { key: '14', label: <Link href="/auth/profile">Profile View</Link>, icon: <ProfileOutlined/>},
                { key: '15', label:  <Link href="/auth/password-reset">Password Reset</Link>, icon: <KeyOutlined/> },
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

export default SuperAdminDashboardLayout;