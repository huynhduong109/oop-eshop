import React, { useEffect, useState } from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import { DataGrid } from "@material-ui/data-grid";
import { useDispatch, useSelector } from "react-redux";
import { backend_url } from "../server";
import { getAllOrdersOfAdmin } from "../redux/actions/order";
import { AiFillFileExcel } from "react-icons/ai";
import * as XLSX from "xlsx";
import ChartComponentAdmin from "../components/Admin/ChartComponentAdmin";
import Meta from "../components/Layout/Meta";

const AdminDashboardOrders = () => {
  const dispatch = useDispatch();
  const [valStartDay, setValStartDay] = useState("");
  const [valEndDay, setValEndDay] = useState("");
  const [statistic, setStatistic] = useState(false);

  const { adminOrders, adminOrderLoading } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
  }, []);
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
  const allOrders = adminOrders?.map((allOrder) => {
    const productColumns = generateProductColumns(allOrder);
    return {
      ["Mã đơn hàng"]: allOrder._id,
      ["Tình trạng"]: allOrder.status,
      ["Tên cửa hàng"]: allOrder.cart?.[0]?.shop?.name,
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

  const getAllOrders = adminOrders?.filter((item) => {
    const orderDate = new Date(item.createdAt.slice(0, 10));
    return (
      orderDate >= new Date(valStartDay) && orderDate <= new Date(valEndDay)
    );
  });
  //chart;
  const deliveredOrdersInfo = getAllOrders?.map((order) => {
    return {
      day: order.createdAt.slice(0, 10),
      total: 1,
    };
  });


  const totalAdminOrders = getAllOrders?.length;

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
  const row1 = [];

  adminOrders &&
    adminOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item?.cart?.reduce((acc, item) => acc + item.qty, 0),
        total:
          item?.totalPrice.toLocaleString("vi-VN", {
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
  adminOrders &&
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
    <div>
      <Meta title="Admin Dashboard | Đơn hàng" />
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={2} />
          </div>

          <div className="w-full min-h-[45vh] pt-5 rounded flex  justify-center">
            <div className="w-[97%] flex flex-col justify-center">
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
                <AiFillFileExcel className="mr-2" />{" "}
                {/* Thêm biểu tượng Excel */}
                Export Excel
              </button>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "20px",
                  background: "#ccc",
                }}>
                <h1 style={{ fontSize: "20px", fontWeight: "700" }}>
                  Thống kê đơn hàng ----
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
                  {/* <button onClick={handleSubmit}>Thống kê</button> */}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingBottom: "30px",
                  background: "#ccc",
                }}>
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
                    pageSize={5}
                    disableSelectionOnClick
                    autoHeight
                  />
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      padding: "50px",
                      paddingLeft: "75%",
                    }}>
                    <span>Tổng đơn hàng: </span>
                    <span style={{ color: "#294fff" }}>{totalAdminOrders}</span>
                  </div>
                </>
              )}
              {statistic && (
                <ChartComponentAdmin
                  arrData={deliveredOrdersInfo && deliveredOrdersInfo}
                  name="đơn hàng"></ChartComponentAdmin>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardOrders;