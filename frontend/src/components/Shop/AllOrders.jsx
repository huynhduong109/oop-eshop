import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { backend_url } from "../../server";
import Loader from "../Layout/Loader";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { AiOutlineArrowRight } from "react-icons/ai";
import { AiFillFileExcel } from "react-icons/ai";
import "../CSS/AllOrder.css";
import * as XLSX from "xlsx";
import ChartComponentShop from "./ChartComponentShop";

const AllOrders = () => {
  const [valStartDay, setValStartDay] = useState("");
  const [valEndDay, setValEndDay] = useState("");
  const [statistic, setStatistic] = useState(false);

  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const clearRef = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch]);
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
  //export excel

  const generateProductColumns = (allOrder) => {
    const productColumns = {};
    allOrder.cart.forEach((product, index) => {
      // Tên cột sẽ là "Sản phẩm 1", "Sản phẩm 2", "Sản phẩm 3", ...
      productColumns[`Sản phẩm ${index + 1}`] = product.name;
    });
    return productColumns;
  };

  // Tạo dữ liệu cho danh sách đơn hàng với các cột sản phẩm động
  const allOrders = orders?.map((allOrder) => {
    const productColumns = generateProductColumns(allOrder);
    return {
      ["Mã đơn hàng"]: allOrder._id,
      ["Tình trạng"]: allOrder.status,
      ["Số lượng"]: allOrder.cart.length,
      ["Tổng tiền"]:
        allOrder.totalPrice.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }) + "",
      ...productColumns, // Sử dụng toàn bộ các cột sản phẩm ở đây
    };
  });

  const handleExport = () => {
    const currentDate = new Date();
    const formattedDate = currentDate
      .toLocaleDateString("vi-VN")
      .replaceAll("/", "-"); // Chuyển ngày thành chuỗi có dạng MM-DD-YYYY

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(allOrders);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const fileName = `all-order-${formattedDate}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const getAllOrders = orders?.filter((item) => {
    const orderDate = new Date(item.createdAt.slice(0, 10));
    return (
      orderDate >= new Date(valStartDay) && orderDate <= new Date(valEndDay)
    );
  });

  const totalOrders = getAllOrders?.length;
  //chart;
  const deliveredOrdersInfo = getAllOrders?.map((order) => {
    return {
      day: order.createdAt.slice(0, 10),
      total: 1,
    };
  });

  const columns = [
    {
      field: "image",
      headerName: "Hình ảnh đơn hàng",
      minWidth: 150,
      flex: 0.7,
      sortable: false,
      renderCell: (params) => {
        const order = orders.find((order) => order._id === params.id);
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
      field: "created",
      headerName: "Ngày đặt",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];
  const row1 = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total:
          item.totalPrice.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }) + "",
        status: item.status,
        created: new Date(item?.createdAt).toLocaleString("vi-VN", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        }),
      });
    });
  orders &&
    getAllOrders.forEach((item) => {
      row1.push({
        id: item._id,
        itemsQty: item.cart.length,
        total:
          item.totalPrice.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }) + "",
        status: item.status,
        created: new Date(item?.createdAt).toLocaleString("vi-VN", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        }),
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={4}
            disableSelectionOnClick
            autoHeight
          />
          <button
            onClick={handleExport}
            className="text-green-500 px-4 py-2 rounded-lg hover:text-red-500 flex items-center ml-auto">
            <AiFillFileExcel className="mr-2" /> {/* Thêm biểu tượng Excel */}
            Export Excel
          </button>
          <div
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
                Thống kê đơn hàng ----
              </h1>
              <div>
                <label>Ngày bắt đầu: </label>
                <input
                  style={{ border: "1px solid black" }}
                  value={valStartDay}
                  ref={clearRef}
                  type="date"
                  onChange={handleStartDayChange}></input>
                <label style={{ marginLeft: "50px" }}>Ngày kết thúc: </label>
                <input
                  style={{ border: "1px solid black" }}
                  className="border border-solid border-red-500"
                  type="date"
                  value={valEndDay}
                  ref={clearRef}
                  onChange={handleEndDayChange}></input>
                {/* <button onClick={handleSubmit}>Thống kê</button> */}
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
          </div>

          {row1 && statistic && (
            <>
              <DataGrid
                rows={row1}
                columns={columns}
                pageSize={4}
                disableSelectionOnClick
                autoHeight
              />
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  padding: "50px",
                  float: "right",
                }}>
                <span>Tổng đơn hàng: </span>
                <span style={{ color: "#294fff" }}>{totalOrders}</span>
              </div>
            </>
          )}
          {statistic && (
            <ChartComponentShop
              arrData={deliveredOrdersInfo && deliveredOrdersInfo}
              name=" đơn hàng"></ChartComponentShop>
          )}
        </div>
      )}
    </>
  );
};

export default AllOrders;