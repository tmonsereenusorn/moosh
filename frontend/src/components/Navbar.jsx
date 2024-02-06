import React, { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { fetch_personal_info } from "../api/personal";
import { useAuth } from "../contexts/AuthProvider";

const NavBar = () => {
  const [userInfo, setUserInfo] = useState({});
  const { authorized, loading, setLoading } = useAuth();

  useEffect(() => {
    if (authorized) {
      setLoading(true);
      fetch_personal_info().then(res => {
        setUserInfo(res?.data);
        setLoading(false);
      });
    }
  }, [authorized, setLoading]);

  return (
    <div className="fixed flex top-0 left-0 w-full h-14 bg-[#5b5b5b]/[.1] border-b border-[#C7C7C7]/[.5] px-6 py-2 z-10">
      <Logo />
      <div className="w-full flex justify-end items-center">
        {authorized && !loading && (
          <p className="text-lg font-bold">hi, {userInfo.display_name}</p>
        )}
      </div>
    </div>
  )
};

export default NavBar;
