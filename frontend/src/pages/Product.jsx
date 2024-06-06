import React, { useEffect, useState } from "react";
import ProductHd from "../components/ProductHd";
import { useParams } from "react-router-dom";
import ProductDisplay from "../components/ProductDisplay";
import ProductDescription from "../components/ProductDescription";
import PopularProducts from "../components/PopularProducts";

const Product = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://cartnet-ecommerce.onrender.com/products/${productId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Product not found!</div>;
  }

  return (
    <section>
      <div>
        <ProductHd product={product} />
        <ProductDisplay product={product} />
        <ProductDescription />
        <PopularProducts />
      </div>
    </section>
  );
};

export default Product;
