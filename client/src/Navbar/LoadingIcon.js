import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
const LoadingIcon = () => (
  <Spin
    indicator={
      <LoadingOutlined
        style={{
          fontSize: 75,
        }}
        spin
      />
    }
  />
);
export default LoadingIcon;