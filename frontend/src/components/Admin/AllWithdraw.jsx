import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../server";
import { Link } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import { BsPencil } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";
import { toast } from "react-toastify";

const AllWithdraw = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [withdrawData, setWithdrawData] = useState();
  const [withdrawStatus, setWithdrawStatus] = useState("Đang xử lý");

  useEffect(() => {
    axios
      .get(`${server}/withdraw/get-all-withdraw-request`, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data.withdraws);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  }, []);

  const columns = [
    { field: "id", headerName: "Mã yêu cầu", minWidth: 100, flex: 0.5 },
    {
      field: "name",
      headerName: "Tên cửa hàng",
      minWidth: 80,
      flex: 0.6,
    },
    {
      field: "bankName",
      headerName: "Tên ngân hàng",
      minWidth: 80,
      flex: 0.6,
    },
    {
      field: "bankNumber",
      headerName: "Số tài khoản",
      minWidth: 80,
      flex: 0.6,
    },
    {
      field: "bankHolderName",
      headerName: "Chủ tài khoản",
      minWidth: 80,
      flex: 0.6,
    },
    {
      field: "amount",
      headerName: "Số tiền rút",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "status",
      headerName: "Tình trạng",
      type: "text",
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: "createdAt",
      headerName: "Ngày gửi",
      type: "number",
      minWidth: 80,
      flex: 0.4,
    },
    {
      field: " ",
      headerName: "Cập nhật tình trạng",
      type: "number",
      minWidth: 130,
      flex: 0.6,
      renderCell: (params) => {
        return (
          <BsPencil
            size={20}
            className={`${
              params.row.status !== "Đang xử lý" ? "hidden" : ""
            } mr-5 cursor-pointer`}
            onClick={() => setOpen(true) || setWithdrawData(params.row)}
          />
        );
      },
    },
  ];

  const handleSubmit = async () => {
    const amount = parseInt(
      withdrawData?.amount.replace(/\./g, "").replace(" ₫", "")
    );
    await axios
      .put(
        `${server}/withdraw/update-withdraw-request/${withdrawData.id}`,
        {
          sellerId: withdrawData.shopId,
          amount: amount,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Cập nhật yêu cầu rút tiền thành công!");
        setData(res.data.withdraws);
        setOpen(false);
        window.location.reload();
      });
  };

  const row = [];

  data &&
    data.forEach((item) => {
      row.push({
        id: item._id,
        shopId: item.seller._id,
        name: item.seller.name,
        bankName: item.seller.withdrawMethod.bankName,
        bankNumber: item.seller.withdrawMethod.bankAccountNumber,
        bankHolderName: item.seller.withdrawMethod.bankHolderName,
        amount:
          item.amount.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }) + "",
        status: item.status,
        createdAt: new Date(item?.createdAt).toLocaleString("vi-VN", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }),
      });
    });
  return (
    <div className="w-full flex items-center pt-5 justify-center">
      <div className="w-[95%] bg-white">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </div>
      {open && (
        <div className="w-full fixed h-screen top-0 left-0 bg-[#00000031] z-[9999] flex items-center justify-center">
          <div className="w-[50%] min-h-[40vh] bg-white rounded shadow p-4">
            <div className="flex justify-end w-full">
              <RxCross1 size={25} onClick={() => setOpen(false)} />
            </div>
            <h1 className="text-[25px] text-center font-Poppins">
              Cập nhật tình trạng rút tiền
            </h1>
            <br />
            <select
              name=""
              id=""
              onChange={(e) => setWithdrawStatus(e.target.value)}
              className="w-[200px] h-[35px] border rounded">
              <option value={"Đang xử lý"}>{withdrawData.status}</option>
              <option value={"Thành công"}>Thành công</option>
            </select>
            {withdrawStatus === "Thành công" ? (
              <button
                type="submit"
                className={`block ${styles.button} text-white !h-[42px] mt-4 text-[18px]`}
                onClick={handleSubmit}>
                Cập nhật
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllWithdraw;
