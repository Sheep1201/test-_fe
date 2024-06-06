import React from 'react';
import { Spin } from 'antd';
import './Loading.css';

const Loading = ({ children, isPending, delay = 200}) => {
    return (
        <>
            <Spin spinning={isPending} delay={delay} className="custom-spin">
                {children}
            </Spin>
        </>
    );
};

export default Loading;