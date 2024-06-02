import React from "react";
import logo from "../assets/logo.png";
import profileImg from "../assets/profile.png";

const Navbar = () => {
  return (
    <nav className="bg-white py-2 ring-1 ring-slate-900/5 relative">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-20 flexBetween">
        <div>
          <img src={logo} alt="logo" height={75} width={75} />
        </div>
        <div className="hidden sm:flex text-black text-3xl px-6 py-6 mb-2 tracking-widest line-clamp-1 max-xs:bold-18 max-xs:py-2 max-xs:px-1">
          CartNet - Admin Panel
        </div>
        <div>
          <img
            src={profileImg}
            alt="profile"
            height={75}
            width={75}
            className="rounded-full"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
