import React from 'react';

import CollapsibleSidebarMenu from '../menu/collapsibleSidebar';
import { MenuItem } from '../menu/sidebarmenu';
import Breadcrumb from '../shared/breadcrumbList';


interface HeaderProps {
  menuItemsTop: MenuItem[];
  menuItemsBottom: MenuItem[];
  activeMenu: string;
  breadcrumbItems: BreadcrumbMenuItem[];
  searchPlaceholder?: string;
}

interface BreadcrumbMenuItem {
  label: string;
  link: string;
}

const Header: React.FC<HeaderProps> = ({
  menuItemsTop,
  menuItemsBottom,
  activeMenu,
  breadcrumbItems,
}) => {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center  py-6 gap-4 border-b bg-background px-4 sm:border-0 sm:px-10 ml-14">
      {/* Sidebar Menu */}
      <CollapsibleSidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active={activeMenu}
      />

      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbItems} />


      {/* Profile Dropdown */}
      {/* <DropdownProfile /> */}
    </header>
  );
};

export default Header;

