import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllUsers } from "../../redux/actions/user";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineDelete } from "react-icons/ai";
import { Button } from "@material-ui/core";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { backend_url, server } from "../../server";
import { toast } from "react-toastify";
import ChartComponentAdmin from "./ChartComponentAdmin";

const AllUsers = () => {
  const [valStartDay, setValStartDay] = useState("");
  const [valEndDay, setValEndDay] = useState("");
  const [statistic, setStatistic] = useState(false);
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/user/delete-user/${id}`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
      });

    dispatch(getAllUsers());
  };
  //thống kê người dùng
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

  const getAllUser = users?.filter((item) => {
    const orderDate = new Date(item.createdAt.slice(0, 10));
    return (
      orderDate >= new Date(valStartDay) &&
      orderDate <= new Date(valEndDay) &&
      item.role === "user"
    );
  });
  //chart;
  const deliveredOrdersInfo = getAllUser?.map((order) => {
    return {
      day: order.createdAt.slice(0, 10),
      total: 1,
    };
  });
  const totalUsers = getAllUser?.length;
  const columns = [
    {
      field: "image",
      headerName: "Ảnh đại diện",
      minWidth: 150,
      flex: 0.7,
      sortable: false,
      renderCell: (params) => {
        const user = users.find((user) => user._id === params.id);
        const userAvartar = user?.avatar; // Đặt tên hình ảnh seller tương ứng tại đây
        return (
          <img
            src={`${backend_url}/${userAvartar}`}
            alt="Seller"
            style={{ width: "50px", height: "50px" }}
          />
        );
      },
    },
    { field: "id", headerName: "Mã người dùng", minWidth: 150, flex: 0.7 },

    {
      field: "name",
      headerName: "Tên",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "email",
      headerName: "Email",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "role",
      headerName: "Vai trò",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "joinedAt",
      headerName: "Ngày tham gia",
      type: "text",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "Xóa người dùng",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => setUserId(params.id) || setOpen(true)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];
  const row1 = [];
  users &&
    users.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        email: item.email,
        role: item.role,
        joinedAt: new Date(item?.createdAt).toLocaleString("vi-VN", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }),
      });
    });
  getAllUser &&
    getAllUser.forEach((item) => {
      row1.push({
        id: item._id,
        name: item.name,
        email: item.email,
        role: item.role,
        joinedAt: new Date(item?.createdAt).toLocaleString("vi-VN", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }),
      });
    });

  return (
    <div className="w-full flex justify-center pt-5">
      <div className="w-[97%]">
        <h3 className="text-[22px] font-Poppins pb-2">Danh sách người dùng</h3>
        <div className="w-full min-h-[45vh] bg-white rounded">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={5}
            disableSelectionOnClick
            autoHeight
          />
          {/* Thống kê */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "20px",
              background: "#ccc",
            }}>
            <h1 style={{ fontSize: "20px", fontWeight: "700" }}>
              Thống kê người dùng ----
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
          {statistic && (
            <DataGrid
              rows={row1}
              columns={columns}
              pageSize={5}
              disableSelectionOnClick
              autoHeight
            />
          )}
          {statistic && (
            <div
              style={{
                fontSize: "20px",
                fontWeight: "700",
                padding: "50px",
                float: "right",
              }}>
              <span>Tổng số lượng người dùng: </span>
              <span style={{ color: "#294fff" }}>{totalUsers}</span>
            </div>
          )}
          {statistic && (
            <ChartComponentAdmin
              arrData={deliveredOrdersInfo && deliveredOrdersInfo}
              name="người dùng"></ChartComponentAdmin>
          )}
        </div>
        {open && (
          <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
            <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded shadow p-5">
              <div className="w-full flex justify-end cursor-pointer">
                <RxCross1 size={25} onClick={() => setOpen(false)} />
              </div>
              <h3 className="text-[25px] text-center py-5 font-Poppins text-[#000000cb]">
                Bạn có chắc muốn xóa người dùng này?
              </h3>
              <div className="w-full flex items-center justify-center">
                <div
                  className={`${styles.button} text-white text-[18px] !h-[42px] mr-4`}
                  onClick={() => setOpen(false)}>
                  Không
                </div>
                <div
                  className={`${styles.button} text-white text-[18px] !h-[42px] ml-4`}
                  onClick={() => setOpen(false) || handleDelete(userId)}>
                  Có
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;