import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllOrdersOfUser } from "../../redux/actions/order";
import styles from "../../styles/styles";
import { backend_url } from "../../server";

const TrackOrder = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch]);


  const data = orders && orders.find((item) => item._id === id);

  const orderSteps = [
    { status: "Đang xử lý", icon: "⭕" },
    { status: "Đơn hàng đã được giao cho đơn vị vận chuyển", icon: "♻️" },
    { status: "Đơn hàng đang được vận chuyển", icon: "🚚" },
    { status: "Đon hàng đã đến kho gần nhất", icon: "📬" },
    { status: "Đơn hàng đang trên đường giao đến", icon: "🚛" },
    { status: "Đã giao hàng", icon: "️🎯" },
  ];

  const refundSteps = [
    { status: "Đang xử lý hoàn trả", icon: "⭕" },
    { status: "Hoàn trả thành công", icon: "♻️" },
  ];

  // Lọc ra bước tiến trình mà đơn hàng đã đạt được
  const currentStatusIndex =
    data?.status === "Đang xử lý hoàn trả" ||
    data?.status === "Hoàn trả thành công"
      ? refundSteps.findIndex((step) => step.status === data?.status)
      : orderSteps.findIndex((step) => step.status === data?.status);

  return (
    <div className={`py-4 min-h-screen ${styles.section}`}>
      <div className="w-full flex items-center justify-between pt-6">
        <h5 className="text-[#00000084]">
          Mã đơn hàng: <span>#{data?._id?.slice(0, 8)}</span>
        </h5>
        <h5 className="text-[#00000084]">
          Ngày đặt:{" "}
          <span>
            {new Date(data?.createdAt).toLocaleString("vi-VN", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            })}
          </span>
        </h5>
      </div>

      {/* order items */}
      <br />
      <br />
      {data &&
        data?.cart.map((item, index) => {
          return (
            <div className="w-full flex items-start mb-5">
              <img
                src={`${backend_url}/${item.images[0]}`}
                alt=""
                className="w-[80x] h-[80px]"
              />
              <div className="w-full">
                <h5 className="pl-3 text-[20px]">{item.name}</h5>
                <h5 className="pl-3 text-[20px] text-[#00000091]">
                  {item.discountPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }) + ""}{" "}
                  x {item.qty}
                </h5>
              </div>
            </div>
          );
        })}

      <div className="border-t w-full text-right">
        <h5 className="pt-3 text-[18px]">
          Tổng tiền:{" "}
          <strong>
            {data?.totalPrice.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            }) + ""}
          </strong>
        </h5>
      </div>

      {/* Hiển thị tiến trình tình trạng đơn hàng */}
      <div className="w-full mt-6">
        <h1 className="pl-2 text-[25px]">
          <span role="img" aria-label="Tiến trình đơn hàng">
            🚚
          </span>{" "}
          Trạng thái đơn hàng:
        </h1>
        {/* Thêm danh sách mô tả trạng thái */}
        <ul className="list-none pl-8 pt-4 space-y-4">
          {data?.status === "Đang xử lý hoàn trả" ||
          data?.status === "Hoàn trả thành công"
            ? refundSteps.map((step, index) => (
                <li
                  key={index}
                  className={`flex items-center space-x-4 text-[#00000084] ${
                    index < currentStatusIndex
                      ? "text-[#000000] font-bold"
                      : index === currentStatusIndex
                      ? "text-[#00cc00] font-bold bg-gray-200 border border-gray-400"
                      : ""
                  }`}>
                  <div className="flex items-center">
                    <span className="text-[#000000] text-2xl mr-2">
                      {step.icon}
                    </span>
                    <span className="text-lg">{step.status}</span>
                  </div>
                  {index === currentStatusIndex && (
                    <span className="ml-auto text-[#00000084]">
                      {new Date(data?.deliveredAt).toLocaleString("vi-VN", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </span>
                  )}
                </li>
              ))
            : orderSteps.map((step, index) => (
                <li
                  key={index}
                  className={`flex items-center space-x-4 text-[#00000084] ${
                    index < currentStatusIndex
                      ? "text-[#000000] font-bold"
                      : index === currentStatusIndex
                      ? "text-[#00cc00] font-bold bg-gray-200 border border-gray-400"
                      : ""
                  }`}>
                  <div className="flex items-center">
                    <span className="text-[#000000] text-2xl mr-2">
                      {step.icon}
                    </span>
                    <span className="text-lg">{step.status}</span>
                  </div>
                  {index === currentStatusIndex && (
                    <span className="ml-auto text-[#00000084]">
                      {data?.status === "Đã giao hàng"
                        ? new Date(data?.deliveredAt).toLocaleString("vi-VN", {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          })
                        : new Date(data?.createdAt).toLocaleString("vi-VN", {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          })}
                    </span>
                  )}
                </li>
              ))}
        </ul>
      </div>
    </div>
  );
};

export default TrackOrder;
