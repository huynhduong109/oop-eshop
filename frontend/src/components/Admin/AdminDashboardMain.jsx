import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { MdBorderClear } from "react-icons/md";
import { Link } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import { backend_url } from "../../server";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../../redux/actions/order";
import Loader from "../Layout/Loader";
import { getAllSellers } from "../../redux/actions/sellers";
import { Element, Link as ScrollLink } from "react-scroll";
import ChartComponentAdmin from "./ChartComponentAdmin";

const AdminDashboardMain = () => {
  const [valStartDay, setValStartDay] = useState("");
  const [valEndDay, setValEndDay] = useState("");
  const [statistic, setStatistic] = useState(false);

  const dispatch = useDispatch();

  const { adminOrders, adminOrderLoading } = useSelector(
    (state) => state.order
  );
  const { sellers } = useSelector((state) => state.seller);
  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
    dispatch(getAllSellers());
  }, []);

  //Thống kê doanh thu

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
  const getAllProducts = adminOrders?.filter((item) => {
    const orderDate = new Date(item.deliveredAt?.slice(0, 10));
    return (
      orderDate >= new Date(valStartDay) &&
      orderDate <= new Date(valEndDay) &&
      item.status === "Đã giao hàng"
    );
  });

  //chart

  const deliveredOrdersInfo = getAllProducts?.map((order) => {
    return {
      day: order.deliveredAt.slice(0, 10),
      total: order.totalPrice,
    };
  });

  const arrProductDelivered = adminOrders?.filter((item) => {
    return item.status === "Đã giao hàng";
  });


  const sumOder = getAllProducts?.reduce((total, item) => {
    return total + item.totalPrice;
  }, 0);

  const totalOrder = getAllProducts?.length;
  const totalRevenue = sumOder * 0.1;

  // tiền kiếm được
  const adminEarning =
    arrProductDelivered &&
    arrProductDelivered.reduce((acc, item) => acc + item.totalPrice * 0.1, 0);

  const adminBalance =
    adminEarning?.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    }) + "";

  const columns = [
    {
      field: "image",
      headerName: "Hình ảnh đơn hàng",
      minWidth: 150,
      flex: 0.7,
      sortable: false,
      renderCell: (params) => {
        const order = adminOrders.find((order) => order._id === params.id);
        const firstProductImage = order?.cart[0]?.images[0];
        return (
          <img
            src={`${backend_url}/${firstProductImage}`}
            alt="Product"
            style={{ width: "50px", height: "50px" }}
          />
        );
      },
    },
    { field: "id", headerName: "Mã đơn hàng", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Tình trạng",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Đã giao hàng"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "ShopName",
      headerName: "Tên của hàng",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: "itemsQty",
      headerName: "Số lượng",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Tổng tiền",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "createdAt",
      headerName: "Ngày đặt",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
  ];

  const row = [];

  adminOrders &&
    adminOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item?.cart?.reduce((acc, item) => acc + item.qty, 0),
        total:
          item?.totalPrice?.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }) + "",
        status: item?.status,
        createdAt: new Date(item?.createdAt).toLocaleString("vi-VN", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        }),
        ShopName: item?.cart?.[0]?.shop?.name,
      });
    });

  return (
    <>
      {adminOrderLoading ? (
        <Loader />
      ) : (
        <div className="w-full p-4">
          {/* <ChartComponent day={2}></ChartComponent> */}
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
                  Tổng tiền kiếm được
                </h3>
              </div>
              <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
                {adminBalance}
              </h5>
              <ScrollLink
                className="cursor-pointer"
                to="target"
                smooth={true}
                duration={100}>
                <h5 className="pt-4 pl-2 text-[#077f9c]"> Thống kê</h5>
              </ScrollLink>
            </div>

            <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
              <div className="flex items-center">
                <MdBorderClear size={30} className="mr-2" fill="#00000085" />
                <h3
                  className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}>
                  Tất cả người bán
                </h3>
              </div>
              <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
                {sellers && sellers.length}
              </h5>
              <Link to="/admin-sellers">
                <h5 className="pt-4 pl-2 text-[#077f9c]">Xem ds người bán</h5>
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
                  Đơn hàng
                </h3>
              </div>
              <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
                {adminOrders && adminOrders.length}
              </h5>
              <Link to="/admin-orders">
                <h5 className="pt-4 pl-2 text-[#077f9c]">Xem đơn hàng</h5>
              </Link>
            </div>
          </div>
          <br />
          <h3 className="text-[22px] font-Poppins pb-2">Đơn hàng gần nhất</h3>
          <div className="w-full min-h-[45vh] bg-white rounded">
            <DataGrid
              rows={row} // Sử dụng danh sách đã sắp xếp
              columns={columns}
              pageSize={5}
              disableSelectionOnClick
              autoHeight
            />
            {/* Thống kê */}
            <Element
              name="target"
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "20px",
                background: "#ccc",
                flexDirection: "column",
              }}>
              <div style={{ display: "flex", justifyContent: "space-evenly" }}>
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
              </div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  padding: "20px",
                  display: "inline-block",
                  display: "flex",
                  justifyContent: "space-between",
                }}>
                <div>
                  <span>Tổng đơn hàng: </span>
                  <span style={{ color: "#294fff" }}>{totalOrder}</span>
                </div>
                <div>
                  <span>Tổng doanh thu: </span>
                  <span style={{ color: "#294fff" }}>
                    {sumOder?.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }) + ""}
                  </span>
                </div>
                <div>
                  <span>Tổng tiền kiếm được: </span>
                  <span style={{ color: "#294fff" }}>
                    {totalRevenue?.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }) + ""}
                  </span>
                </div>
              </div>
              {statistic ? (
                <button
                  onClick={handleStartDayClick}
                  style={{
                    color: "#294fff",
                    fontSize: "20px",
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
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
          </div>
          {statistic && (
            <ChartComponentAdmin
              arrData={deliveredOrdersInfo && deliveredOrdersInfo}
              name="doanh thu"></ChartComponentAdmin>
          )}
        </div>
      )}
    </>
  );
};
export default AdminDashboardMain;
