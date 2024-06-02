import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineProduct } from "react-icons/ai";
import { IoIosList } from "react-icons/io";

const SideBar = () => {
  return (
    <div className="py-7 flex justify-center gap-x-2 gap-y-5 w-full bg-white sm:gap-x-4 lg:flex-col lg:pt-20 lg:max-w-60 lg:h-screen lg:justify-start lg:pl-6">
      <Link to={"/"}>
        <button className="flexCenter gap-2 rounded-md bg-primary h-12 w-36 xs:w-44 medium-14 xs:medium-16">
          {/* <img src={listProduct} alt="" height={50} width={50} /> */}
          <IoIosList style={{ height: "30px", width: "30px" }} />
          <span>All Products</span>
        </button>
      </Link>
      <Link to={"./addproduct"}>
        <button className="flexCenter gap-2 rounded-md bg-primary h-12 w-36 xs:w-44 medium-14 xs:medium-16">
          {/* <img src={addProduct} alt="" height={50} width={50} /> */}
          <AiOutlineProduct style={{ height: "30px", width: "30px" }} />
          <span>Add Product</span>
        </button>
      </Link>
    </div>
  );
};

export default SideBar;
