import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import Footer from '../../components/Layout/Footer'
import OrderDetails from "../../components/Shop/OrderDetails";
import Meta from '../../components/Layout/Meta';

const ShopOrderDetails = () => {
  return (
    <div>
      <Meta title="Shop Dashboard | Chi tiết đơn hàng" />
      <DashboardHeader />
      <OrderDetails />
      <Footer />
    </div>
  )
}

export default ShopOrderDetails