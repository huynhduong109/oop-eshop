import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteEvent, getAllEventsShop } from "../../redux/actions/event";
import { backend_url } from "../../server";
import Loader from "../Layout/Loader";

const AllEvents = () => {
  const { events, isLoading } = useSelector((state) => state.events);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllEventsShop(seller._id));
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteEvent(id));
    window.location.reload();
  };

  const columns = [
    {
      field: "image",
      headerName: "Hình ảnh sản phẩm", 
      minWidth: 100, 
      flex: 0.7, 
      sortable: false,
      renderCell: (params) => {
        const event = events.find((event) => event._id === params.id);
        const ProductImage = event.images[0];
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
      headerName: "Giá ",
      minWidth: 100,
      flex: 0.7,
    },

    {
      field: "begin",
      headerName: "Ngày bắt đầu",
      type: "text",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "end",
      headerName: "Ngày kết thúc",
      type: "text",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "Stock",
      headerName: "Kho",
      type: "text",
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: "sold",
      headerName: "Đã bán",
      type: "text",
      minWidth: 80,
      flex: 0.7,
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
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

  events &&
    events.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price:
          item.discountPrice.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }) + "",
        begin: new Date(item?.start_Date).toLocaleString("vi-VN", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }),
        end: new Date(item?.Finish_Date).toLocaleString("vi-VN", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }),
        Stock: item.stock,
        sold: item.sold_out,
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
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      )}
    </>
  );
};

export default AllEvents;
