import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { backend_url, server } from "../../server";
import axios from "axios";
import { AiFillFileExcel } from "react-icons/ai";
import * as XLSX from "xlsx";
import ChartComponentAdmin from "./ChartComponentAdmin";

import { useState } from "react";

const AllProducts = () => {
  const [valStartDay, setValStartDay] = useState("");
  const [valEndDay, setValEndDay] = useState("");
  const [statistic, setStatistic] = useState(false);
  const [data, setData] = useState([]);
  // const { products, isLoading } = useSelector((state) => state.products);
  // const dispatch = useDispatch();
  useEffect(() => {
    axios
      .get(`${server}/product/admin-all-products`, { withCredentials: true })
      .then((res) => {
        setData(res.data.products);
      });
  }, []);

  //export excel

  // Tạo dữ liệu cho danh sách đơn hàng với các cột sản phẩm động
  const allProducts = data?.map((allProduct) => {
    return {
      ["Mã sản phẩm"]: allProduct._id,
      ["Tên sản phẩm"]: allProduct.name,
      ["Loại sản phẩm"]: allProduct.category,
      ["Tên cửa hàng"]: allProduct.shop?.name,
      ["Giá gốc"]:
        allProduct.originalPrice.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }) + "",
      ["Giá khuyến mãi"]:
        allProduct.discountPrice.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }) + "",
      ["Lượt bán"]: allProduct.sold_out,
      ["Kho"]: allProduct.stock,
      ["Đánh giá"]: allProduct.ratings,
    };
  });

  // handle thống kê
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

  const handleExport = () => {
    const currentDate = new Date();
    const formattedDate = currentDate
      .toLocaleDateString("vi-VN")
      .replaceAll("/", "-"); // Chuyển ngày thành chuỗi có dạng MM-DD-YYYY

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(allProducts);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const fileName = `all-product-${formattedDate}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // handle choose day
  const getAllProducts = data?.filter((item) => {
    const orderDate = new Date(item.createdAt.slice(0, 10));
    return (
      orderDate >= new Date(valStartDay) && orderDate <= new Date(valEndDay)
    );
  });

  const totalAllProduct = getAllProducts?.length;
  //chart;
  const allProduct = getAllProducts?.map((product) => {
    return {
      day: product.createdAt.slice(0, 10),
      total: 1,
    };
  });

  const columns = [
    {
      field: "image",
      headerName: "Hình ảnh sản phẩm",
      minWidth: 150,
      flex: 0.7,
      sortable: false,
      renderCell: (params) => {
        const product = data.find((product) => product._id === params.id);
        const productImage = product.images[0];
        return (
          <img
            src={`${backend_url}/${productImage}`}
            alt="Product"
            style={{ width: "50px", height: "50px" }}
          />
        );
      },
    },
    { field: "id", headerName: "Mã sản phẩm", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Tên sản phẩm",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "shopName",
      headerName: "Tên cửa hàng",
      minWidth: 100,
      flex: 0.8,
    },
    {
      field: "price",
      headerName: "Giá",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "Stock",
      headerName: "Kho",
      type: "number",
      minWidth: 80,
      flex: 0.6,
    },

    {
      field: "sold",
      headerName: "Đã bán",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "Đánh giá",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/product/${params.id}`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];
  const row1 = [];

  data &&
    data.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price:
          item.discountPrice.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }) + "",
        Stock: item.stock,
        sold: item?.sold_out,
        shopName: item?.shop?.name,
      });
    });
  data &&
    data.forEach((item) => {
      row1.push({
        id: item._id,
        name: item.name,
        price:
          item.discountPrice.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }) + "",
        Stock: item.stock,
        sold: item?.sold_out,
        shopName: item?.shop?.name,
      });
    });

  return (
    <>
      <div className="w-full mx-8 pt-1 mt-10 bg-white">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={7}
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
              Thống kê sản phẩm ----
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
              <span>Tổng sản phẩm: </span>
              <span style={{ color: "#294fff" }}>{totalAllProduct}</span>
            </div>
          </>
        )}
        {statistic && (
          <ChartComponentAdmin
            arrData={allProduct && allProduct}
            name="sản phẩm"></ChartComponentAdmin>
        )}
      </div>
    </>
  );
};

export default AllProducts;
