// src/app/auth/page.tsx
'use client';

 
import { Layout, Typography, Button } from 'antd';
import Link from 'next/link';

const { Title } = Typography;
const { Content  } = Layout

const LoginPage = () => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
           
            <Content style={{ padding: '0 50px', marginTop: 64, textAlign: 'center' }}>
                <Title level={2}>Who Are You?</Title>
                <div style={{ marginTop: 32 }}>
                    <Link href="/auth/staff/login">
                        <Button type="primary" size="large" style={{ marginRight: 16 }}>
                            Staff  
                        </Button>
                    </Link>
                    <Link href="/auth/patient/login">
                        <Button type="primary" size="large">
                            Patient  
                        </Button>
                    </Link>
                </div>
            </Content>
           
        </Layout>
    );
};

export default LoginPage;