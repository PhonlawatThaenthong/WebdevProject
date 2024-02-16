import React from 'react';
import { Steps } from 'antd';
import '../App.css';

const Step= ({ current }) => (
    <Steps current={current} percent={60} items={[
        {
            title: 'ข้อมูลการชำระเงิน',
        },
        {
            title: 'อัพโหลดหลักฐานการชำระเงิน ',
        },
        {
            title: 'สำเร็จ',
        },
    ]} />
);

export default Step;
