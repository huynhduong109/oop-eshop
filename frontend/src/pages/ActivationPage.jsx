import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../server";
import Meta from "../components/Layout/Meta";

const ActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (activation_token) {
      const sendRequest = async () => {
        await axios
          .post(`${server}/user/activation`, {
            activation_token,
          })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            setError(true);
          });
      };
      sendRequest();
    }
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Meta title="Kích hoạt tài khoản người dùng" />
      {error ? (
        <p>Mã thông báo của bạn đã hết hạn!</p>
      ) : (
        <p>Tài khoản của bạn đã được tạo thành công!</p>
      )}
    </div>
  );
};

export default ActivationPage;
