import React, { useEffect, useState, useRef } from "react";
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { MdBorderClear } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { Element, Link as ScrollLink } from "react-scroll";
import ChartComponentShop from "./ChartComponentShop";

const DashboardHero = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);
  const [valStartDay, setValStartDay] = useState("");
  const [valEndDay, setValEndDay] = useState("");
  const [statistic, setStatistic] = useState(false);

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch]);

  const availableBalance =
    seller?.availableBalance.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    }) + "";

  const handleStartDayChange = (e) => {
    setValStartDay(e.target.value);
  };
  const handleEndDayChange = (e) => {
    setValEndDay(e.target.value);
  };
  const handleStartDayClick = () => {
    setValEndDay("");
    setValStartDay("");
    setStatistic(false);
  };
  const handleStatistic = () => {
    setStatistic(true);
  };

  const getAllProducts = orders?.filter((item) => {
    const orderDate = new Date(item.createdAt.slice(0, 10));
    return (
      orderDate >= new Date(valStartDay) &&
      orderDate <= new Date(valEndDay) &&
      item.status === "Đã giao hàng"
    );
  });

  //chart (save in arr with 2 key day and price)
  const deliveredOrdersInfo = getAllProducts?.map((order) => {
    return {
      day: order.deliveredAt.slice(0, 10),
      total: order.totalPrice - order.totalPrice * 0.1,
    };
  });

  //
  const sumOder = getAllProducts?.reduce((total, item) => {
    return total + item.totalPrice;
  }, 0);
  const totalRevenue = sumOder - sumOder * 0.1;


  return (
    <div className="w-full p-8">
      <h3 className="text-[22px] font-Poppins pb-2">Tổng quan</h3>
      <div className="w-full block 800px:flex items-center justify-between">
        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect
              size={30}
              className="mr-2"
              fill="#00000085"
            />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}>
              Số dư <span className="text-[16px]">( - 10% phí dịch vụ)</span>
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
            {availableBalance}
          </h5>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <Link to="/dashboard-withdraw-money">
              <h5 className="pt-4 pl-[2] text-[#077f9c]">Rút tiền</h5>
            </Link>
            <ScrollLink
              style={{
                cursor: "pointer",
                lineHeight: "none",
                color: "#077fb6",
                paddingTop: "16px",
              }}
              to="target"
              smooth={true}
              duration={100}>
              Thống kê
            </ScrollLink>
          </div>
        </div>

        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <MdBorderClear size={30} className="mr-2" fill="#00000085" />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}>
              Đơn hàng
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
            {orders && orders.length}
          </h5>
          <Link to="/dashboard-orders">
            <h5 className="pt-4 pl-2 text-[#077f9c]">Xem đơn hàng</h5>
          </Link>
        </div>

        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect
              size={30}
              className="mr-2"
              fill="#00000085"
            />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}>
              Sản phẩm
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
            {products && products.length}
          </h5>
          <Link to="/dashboard-products">
            <h5 className="pt-4 pl-2 text-[#077f9c]">Xem sản phẩm</h5>
          </Link>
        </div>
      </div>
      <br />
      <div className="w-full min-h-[45vh] bg-white rounded">
        {/* Thống kê */}
        <Element
          name="target"
          style={{
            padding: "20px",
            background: "#ccc",
          }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}>
            <h1 style={{ fontSize: "20px", fontWeight: "700" }}>
              Thống kê doanh thu----
            </h1>
            <div>
              <label>Ngày bắt đầu: </label>
              <input
                style={{ border: "1px solid black" }}
                value={valStartDay}
                type="date"
                onChange={handleStartDayChange}></input>
              <label style={{ marginLeft: "50px" }}>Ngày kết thúc: </label>
              <input
                style={{ border: "1px solid black" }}
                className="border border-solid border-red-500"
                type="date"
                value={valEndDay}
                onChange={handleEndDayChange}></input>
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "700",
                padding: "50px",
                float: "right",
                display: "inline-block",
              }}>
              <span>Tổng doanh thu: </span>
              <span style={{ color: "#294fff" }}>
                {totalRevenue
                  ? totalRevenue?.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }) + ""
                  : "0 đ"}
              </span>
            </div>
          </div>
          {statistic ? (
            <button
              onClick={handleStartDayClick}
              style={{
                width: "100%",
                color: "#294fff",
                fontSize: "20px",
                display: "flex",
                justifyContent: "center",
              }}>
              Tiếp tục thống kê
            </button>
          ) : (
            <></>
          )}

          {valEndDay ? (
            <button
              onClick={handleStatistic}
              style={{
                color: "#294fff",
                fontSize: "20px",
                display: statistic ? "none" : "flex",
                justifyContent: "center",
                width: "100%",
              }}>
              Thống kê
            </button>
          ) : (
            <></>
          )}
        </Element>
        <div></div>
      </div>
      {statistic && deliveredOrdersInfo && (
        <ChartComponentShop
          arrData={deliveredOrdersInfo && deliveredOrdersInfo}
          name="doanh thu"></ChartComponentShop>
      )}
    </div>
  );
};

export default DashboardHero;
