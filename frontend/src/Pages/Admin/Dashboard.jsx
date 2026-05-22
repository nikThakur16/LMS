import DashboardSideBar from '@/components/DashboardSideBar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div className='flex min-h-screen bg-[#09090b]'>
      <DashboardSideBar />
      <main className='flex-1 min-w-0 overflow-auto'>
        <Outlet />
      </main>
    </div>
  )
}

export default Dashboard
