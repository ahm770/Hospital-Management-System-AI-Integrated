// src/app/auth/patient/login/page.tsx
'use client';
import PatientLoginForm from '@/components/Auth/PatientLoginForm';

import { Layout } from 'antd';

const { Content } = Layout;

const PatientLoginPage = () => (
    <Layout style={{ minHeight: '100vh' }}>
      
        <Content style={{ padding: '0 50px', marginTop: 64 }}>
            <PatientLoginForm />
        </Content>
     
    </Layout>
);

export default PatientLoginPage;