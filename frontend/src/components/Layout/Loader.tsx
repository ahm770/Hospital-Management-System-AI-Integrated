
import React from 'react';
import { Spin } from 'antd';

const Loader: React.FC = () => {
    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin size="large" tip="Loading ..." />
        </div>
    )
};

export default Loader;