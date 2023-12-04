import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { BsPencil } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { backend_url, server } from "../../server";
import { getAllProductsShop } from "../../redux/actions/product";
import { deleteProduct, updateProduct } from "../../redux/actions/product";
import Loader from "../Layout/Loader";
import { categoriesData } from "../../static/data";
import { AiFillFileExcel } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import ChartComponentShop from "./ChartComponentShop";
import { toast } from "react-toastify";
import axios from "axios";


const AllProducts = () => {
  const [open, setOpen] = useState(false);
  const [valStartDay, setValStartDay] = useState("");
  const { success, error } = useSelector((state) => state.products);
  const [valEndDay, setValEndDay] = useState("");
  const [statistic, setStatistic] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { products, isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [originalPrice, setOriginalPrice] = useState();
  const [discountPrice, setDiscountPrice] = useState();
  const [stock, setStock] = useState();
  const navigate = useNavigate();
  

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success && selectedProduct) {
      setOpen(false);
      toast.success("Cập nhật sản phẩm thành công!");
      navigate("/dashboard-products");
    }
  }, [dispatch, error, success, selectedProduct]);

  useEffect(() => {
    if (selectedProduct) {
      setName(selectedProduct.name);
      setDescription(selectedProduct.description);
      setCategory(selectedProduct.category);
      setOriginalPrice(selectedProduct.originalPrice);
      setDiscountPrice(selectedProduct.discountPrice);
      setStock(selectedProduct.stock);
    }
  }, [selectedProduct]);

  const handleOpenUpdateWindow = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const id = selectedProduct._id;

    dispatch(updateProduct(id, name,description,category, originalPrice, discountPrice, stock ));
  };


  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
    window.location.reload();
  };

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

  const allProducts = products?.map((allProduct) => {
    return {
      ["Mã sản phẩm"]: allProduct._id,
      ["Tên sản phẩm"]: allProduct.name,
      ["Loại sản phẩm"]: allProduct.category,
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

  const getAllProducts = products?.filter((item) => {
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
      minWidth: 80,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => {
        const product = products.find((product) => product._id === params.id);
        const ProductImage = product.images[0];
        return (
          <img
            src={`${backend_url}/${ProductImage}`}
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
      flex: 0.5,
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
      flex: 0.6,
      minWidth: 80,
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
    {
      field: "Update",
      flex: 0.6,
      minWidth: 80,
      headerName: "Chỉnh sửa",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        const product = products.find((product) => product._id === params.id);
        return (
          <>
            <Button onClick={() => handleOpenUpdateWindow(product)}>
              <BsPencil size={20} />
            </Button>
          </>
        );
      },
    },
    {
      field: "Delete",
      flex: 0.4,
      minWidth: 50,
      headerName: "Xóa",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];
  const row1 = [];

  products &&
    products.forEach((item) => {
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
      });
    });
  products &&
    getAllProducts.forEach((item) => {
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
          {/* Thống kê */}
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
          {open && (
            <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000] flex items-center justify-center">
              <div className="w-[90%] 800px:w-[40%] h-[100%] bg-white rounded-md shadow p-4 overflow-y-auto">
                <div className="w-full flex justify-end">
                  <RxCross1
                    size={30}
                    className="cursor-pointer"
                    onClick={() => setOpen(false)}
                  />
                </div>
                <h5 className="text-[30px] font-Poppins text-center">
                  Chỉnh sửa sản phẩm
                </h5>
                <form onSubmit={handleUpdate} aria-required={true}>
                  <br />
                  <div>
                    <label className="pb-2">
                      Tên sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={name}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">
                      Mô tả sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      cols="30"
                      required
                      rows="8"
                      type="text"
                      name="description"
                      value={description}
                      className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setDescription(e.target.value)}></textarea>
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">Loại sản phẩm <span className="text-red-500">*</span></label>
                    <select
                      className="w-full mt-2 border h-[35px] rounded-[5px]"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}>
                      <option value="Chọn loại sản phẩm">Chọn loại sản phẩm</option>
                      {categoriesData &&
                        categoriesData.map((i) => (
                          <option value={i.title} key={i.title}>
                            {i.title}
                          </option>
                        ))}
                    </select>
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">Giá gốc <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={originalPrice}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setOriginalPrice(e.target.value)}
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">Giá khuyến mãi <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      name="discountPrice"
                      value={discountPrice}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setDiscountPrice(e.target.value)}
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">Kho <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      name="stock"
                      value={stock}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </div>
                  <br />
                  <br />
                  <div>
                    <input
                      type="submit"
                      value="Xác nhận"
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border cursor-pointer border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </form>
              </div>
            </div>
          )}
          {statistic && (
            <ChartComponentShop
              arrData={allProduct && allProduct}
              name="sản phẩm"></ChartComponentShop>
          )}
        </div>
      )}
    </>
  );
};

export default AllProducts;
