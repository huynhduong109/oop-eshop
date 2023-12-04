import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";

const BestDeals = () => {
  const [data, setData] = useState([]);
  const { allProducts } = useSelector((state) => state.products);

  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      // Tính toán phần trăm giảm giá và thêm nó vào mỗi sản phẩm
      const productsWithDiscountPercentage = allProducts.map((product) => {
        if (product.originalPrice > 0 && product.discountPrice > 0) {
          const discountPercentage =
            ((product.originalPrice - product.discountPrice) /
              product.originalPrice) *
            100;
          return { ...product, discountPercentage };
        }
        return { ...product, discountPercentage: 0 };
      });

      // Sắp xếp sản phẩm theo phần trăm giảm giá từ cao đến thấp
      const sortedData = productsWithDiscountPercentage.sort(
        (a, b) => b.discountPercentage - a.discountPercentage
      );

      // Lấy ra 5 sản phẩm có phần trăm giảm giá cao nhất
      const firstFive = sortedData.slice(0, 5);

      setData(firstFive);
    }
  }, [allProducts]);

  return (
    <div>
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
          <h1>Ưu đãi tốt nhất</h1>
        </div>
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
          {data && data.length !== 0 && (
            <>
              {data.map((i, index) => (
                <ProductCard data={i} key={index} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BestDeals;
