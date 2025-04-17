// src/app/auth/staff/login/page.tsx
'use client';
import StaffLoginForm from '@/components/Auth/StaffLoginForm';
import { Layout } from 'antd';

const { Content } = Layout;

const StaffLoginPage = () => (
    <Layout style={{ minHeight: '100vh' }}>
      
        <Content style={{ padding: '0 50px', marginTop: 64 }}>
            <StaffLoginForm />
        </Content>
       
    </Layout>
);

export default StaffLoginPage;