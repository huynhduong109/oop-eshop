import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "../components/ForgotPassword/ForgotPassword";
import Meta from "../components/Layout/Meta";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated === true) {
      navigate("/");
    }
  }, []);
  return (
    <div>
      <Meta title="Quên mật khẩu" />
      <ForgotPassword />
    </div>
  );
};

export default ForgotPasswordPage;
