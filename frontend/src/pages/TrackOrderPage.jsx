import React from 'react'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import TrackOrder from "../components/Profile/TrackOrder";
import Meta from "../components/Layout/Meta";

const TrackOrderPage = () => {
  return (
    <div>
      <Meta title="Theo dõi đơn hàng" />
        <Header />
        <TrackOrder />
        <Footer />
    </div>
  )
}

export default TrackOrderPage