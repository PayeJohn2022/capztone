import React from 'react'
import { Outlet } from 'react-router-dom';
import GuardianSidebar from '../Sidebar/GuardianSidebar';

const GuardianLayout = () => {
  return <div>
    <div className="flex">
        <GuardianSidebar />
        <div className="w-full ml-16 md:ml-56">
            <Outlet />
        </div>
    </div>
    </div>
  
};

export default GuardianLayout;