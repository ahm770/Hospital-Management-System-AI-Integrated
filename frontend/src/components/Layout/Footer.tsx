// src/components/Layout/Footer.tsx
'use client'

import React from 'react';
import { Layout, Typography } from 'antd';

const { Footer  } = Layout;
const { Text } = Typography;

const AppFooter: React.FC = () => {
    return (
        <Footer style={{
            textAlign: 'center',
            backgroundColor: '#fafafa',
            padding: '24px 50px',
        }}>
            <Text>© {new Date().getFullYear()} Hospital System. All rights reserved.</Text>
        </Footer>
    );
};

export default AppFooter;