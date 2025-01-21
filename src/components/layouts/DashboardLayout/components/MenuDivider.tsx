import React from 'react';
import { Divider, Typography } from 'antd';

interface MenuDividerProps {
  title?: string;
}

export const MenuDivider: React.FC<MenuDividerProps> = ({ title }) => {
  if (!title) return null;
  
  return (
    <Divider orientation="left" plain>
      <Typography.Text type="secondary" className="text-xs">
        {title}
      </Typography.Text>
    </Divider>
  );
};