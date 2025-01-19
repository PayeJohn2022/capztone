import React from 'react'
import { Outlet } from 'react-router-dom';
import PediatricianSidebar from '../Sidebar/PediatricianSidebar';

const PediatricianLayout = () => {
  return <div>
    <div className="flex">
        <PediatricianSidebar />
        <div className="w-full ml-16 md:ml-56">
            <Outlet />
        </div>
    </div>
    </div>
  
};

export default PediatricianLayout;