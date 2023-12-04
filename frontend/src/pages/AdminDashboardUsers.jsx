import React from 'react'
import AdminHeader from '../components/Layout/AdminHeader'
import AdminSideBar from '../components/Admin/Layout/AdminSideBar'
import AllUsers from "../components/Admin/AllUsers";
import Meta from '../components/Layout/Meta';

const AdminDashboardUsers = () => {
  return (
    <div>
      <Meta title="Admin Dashboard | Người dùng" />
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={4} />
          </div>
          <AllUsers />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardUsers