import React from 'react'
import DashboardHeader from '../dashboard/_components/DashboardHeader';

import SideBar from '../dashboard/_components/SideBar'

function CourseViewLayout({children}) {
  return (
    <div>
      <div className='md:w-64 hidden md:block fixed'>
        <SideBar />
      </div>
      <div className='md:ml-64'>
        <DashboardHeader />
        <div className="mx-10 md:mx-36 lg:px-60 mt-10">{children}</div>
      </div>
    </div>
  );
}

export default CourseViewLayout