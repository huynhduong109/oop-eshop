import React, { useState } from "react";
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { backend_url } from "../../../server";
import styles from "../../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";
import { useEffect } from "react";
import { addTocart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "../../Products/Ratings";

const ProductCard = ({ data, isEvent }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const discountPercentage = data.originalPrice
    ? ((data.originalPrice - data.discountPrice) / data.originalPrice) * 100
    : 0;

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = (id, nameShop) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    const isNameShop = cart && cart.find((j) => j.shop.name !== nameShop);

    if (isItemExists) {
      toast.error("Sản phẩm đã có trong giỏ hàng");
    } else {
      if (data.stock < 1) {
        toast.error("Sản phẩm hiện hết hàng!");
      } else {
        if (isNameShop) {
          toast.error(
            "Vui lòng thanh toán sản phẩm trong giỏ hàng trước khi thêm sản phẩm của cửa hàng khác"
          );
        } else {
          const cartData = { ...data, qty: 1 };
          dispatch(addTocart(cartData));
          toast.success("Thêm vào giỏ hàng thành công!");
        }
      }
    }
  };

  return (
    <>
      <div className="w-full h-[370px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer hover:border border-blue-500 hover:shadow-md transition-shadow">
        <div className="discount-percentage">
          {discountPercentage > 0 && (
            <span className="absolute top-0 left-0 bg-red-500 text-white px-2 py-1 rounded-tl-md">
              -{discountPercentage.toFixed(0)}%
            </span>
          )}
        </div>

        <div className="flex justify-end"></div>
        <Link
          to={`${
            isEvent === true
              ? `/product/${data._id}?isEvent=true`
              : `/product/${data._id}`
          }`}>
          <img
            src={`${backend_url}${data.images && data.images[0]}`}
            alt=""
            className="w-full h-[170px] object-contain"
          />
        </Link>
        <Link to={`/shop/preview/${data?.shop._id}`}>
          <h5 className={`${styles.shop_name}`}>{data.shop.name}</h5>
        </Link>
        <Link
          to={`${
            isEvent === true
              ? `/product/${data._id}?isEvent=true`
              : `/product/${data._id}`
          }`}>
          <h4 className="pb-3 font-[500]">
            {data.name.length > 40 ? data.name.slice(0, 40) + "..." : data.name}
          </h4>

          <div className="flex ">
            <Ratings className=" text-xs" rating={data?.ratings} />
            <span className="font-[400] text-[12px] text-[#68d284] ">
              {data?.sold_out} đã bán
            </span>
          </div>
          <div className="py-2 flex items-center justify-between">
            <div className="flex flex-col space-x-2 space-y-1">
              {" "}
              {/* Container div */}
              <div className="flex">
                <h5 className={`${styles.productDiscountPrice}`}>
                  {data.originalPrice === 0
                    ? data.originalPrice
                    : data.discountPrice
                    ? data.discountPrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }) + ""
                    : null}
                </h5>
                <h4 className={`${styles.price}`}>
                  {data.originalPrice
                    ? data.originalPrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }) + ""
                    : null}
                </h4>
              </div>
            </div>
          </div>
          <div>
            <h6 className="text-right text-xs text-gray-500 mb-0">
              {data.shop.address}
            </h6>
          </div>
        </Link>
        {/* side options */}
        <div>
          {click ? (
            <AiFillHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => removeFromWishlistHandler(data)}
              color={click ? "red" : "#333"}
              title="Xóa khỏi danh mục yêu thích"
            />
          ) : (
            <AiOutlineHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => addToWishlistHandler(data)}
              color={click ? "red" : "#333"}
              title="Thêm vào danh mục yêu thích"
            />
          )}
          <AiOutlineEye
            size={22}
            className="cursor-pointer absolute right-2 top-14"
            onClick={() => setOpen(!open)}
            color="#333"
            title="Xem nhanh"
          />
          <AiOutlineShoppingCart
            size={25}
            className="cursor-pointer absolute right-2 top-24"
            onClick={() => addToCartHandler(data._id, data.shop.name)}
            color="#444"
            title="Thêm vào giỏ hàng"
          />
          {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null}
        </div>
      </div>
    </>
  );
};

export default ProductCard;
