import React from "react";
import { Link } from "react-router-dom";
import logo from "../../Assests/Image/FourD.png";

const AdminHeader = () => {
  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      <div>
        <Link to="/admin/dashboard">
          <img
            style={{ width: "265px", height: "80px", objectFit: "cover" }}
            src={logo}
            alt=""
          />
        </Link>
      </div>
    </div>
  );
};

export default AdminHeader;
