import React from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarMenuProps {
  openKeys?: string[];
  onOpenChange?: MenuProps['onOpenChange'];
  items: MenuProps['items'];
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  openKeys = [],
  onOpenChange,
  items,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get selected keys from current pathname
  const getSelectedKeys = () => {
    const currentPath = location.pathname.slice(1); // Remove leading slash
    const paths = currentPath.split('/');
    
    // If we're at root level, return dashboard as default
    if (currentPath === '') return ['dashboard'];
    
    // For nested routes, return both parent and child keys
    if (paths.length > 1) {
      return [currentPath, paths[0]];
    }
    
    return [currentPath];
  };

  // Handle menu click for navigation
  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(`/${key}`);
  };

  return (
    <div className="sidebar-menu">
      <Menu
        mode="inline"
        selectedKeys={getSelectedKeys()}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        onClick={handleMenuClick}
        items={items}
      />
    </div>
  );
};

export default SidebarMenu;