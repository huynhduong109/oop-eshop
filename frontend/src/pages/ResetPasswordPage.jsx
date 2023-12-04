import axios from "axios";
import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../server";
import { toast } from "react-toastify";
import styles from "../styles/styles";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Meta from "../components/Layout/Meta";


const ResetPasswordPage = () => {
  const { id } = useParams();
  const [error] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleConfirm, setVisibleConfirm] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const passwordChangeHandler = async (e) => {
    e.preventDefault();

    await axios
      .put(
        `${server}/user/reset-password-user`,
        { id, newPassword, confirmPassword },
        { withCredentials: true }
      )
      .then(() => {
        setConfirmPassword("");
        setNewPassword("");
        toast.success("Cập nhật thành công");
        // Chuyển hướng đến trang đăng nhập
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };


  return (

    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Meta title="Tạo Mật Khẩu Mới" />
      {error ? (
        <p>Mã thông báo của bạn đã hết hạn!</p>
      ) : (
        <div className="w-full px-5">
          <h1 className="block text-[25px] text-center font-[600] text-[#000000ba] pb-2">
            Tạo mật khẩu mới
          </h1>
          <div className="w-full">
            <form
              aria-required
              onSubmit={passwordChangeHandler}
              className="flex flex-col items-center">
              <div className=" w-[100%] 800px:w-[50%] mt-2 ">
                <label className="block pb-2">Nhập mật khẩu mới</label>
                <div className="relative">
                  <input
                    type={visible ? "text" : "password"}
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  {visible ? (
                    <AiOutlineEye
                      className="absolute"
                      style={{ top: "4px", right: "45px" }}
                      size={25}
                      onClick={() => setVisible(false)}
                    />
                  ) : (
                    <AiOutlineEyeInvisible
                      className="absolute"
                      style={{ top: "4px", right: "45px" }}
                      size={25}
                      onClick={() => setVisible(true)}
                    />
                  )}
                </div>
              </div>
              <div className=" w-[100%] 800px:w-[50%] mt-2 relative">
                <label className="block pb-2">Xác nhận lại mật khẩu</label>
                <div className="relative">
                  <input
                    type={visibleConfirm ? "text" : "password"}
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {visibleConfirm ? (
                    <AiOutlineEye
                      className="absolute"
                      style={{ top: "4px", right: "45px" }}
                      size={25}
                      onClick={() => setVisibleConfirm(false)}
                    />
                  ) : (
                    <AiOutlineEyeInvisible
                      className="absolute"
                      style={{ top: "4px", right: "45px" }}
                      size={25}
                      onClick={() => setVisibleConfirm(true)}
                    />
                  )}
                </div>
                <input
                  className={`w-[95%] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer`}
                  required
                  value="Tạo"
                  type="submit"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPasswordPage;
