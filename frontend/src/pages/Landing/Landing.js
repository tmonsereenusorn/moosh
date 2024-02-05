import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonPrimary } from "../../components/ButtonPrimary";
import { authorize } from "../../api/auth";
import Cookies from "js-cookie";

const Landing = ({ auth }) => {
  const navigate = useNavigate();

  const enter = () => {
    const authorized = !!Cookies.get("token");
    console.log("here " + authorized);
    if (authorized) {
      console.log("redirecting...");
      navigate("/curator");
    }
  };

  useEffect(() => {
    enter();
  });

  const onLogin = () => {
    authorize(true);
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gradientStart via-gradientMiddle/[.8] to-gradientEnd/[.56] overflow-hidden h-screen">
      <div className="w-screen flex items-center justify-center">
        <div className="w-2/3 h-screen flex items-center justify-center">
          <div className="h-1/2 w-full flex flex-row items-center justify-between">
            <div className="h-full flex flex-col flex-start justify-center">
              <div className="text-red-400 font-bold text-8xl mb-8">moosh</div>
              <div>
                <div className="text-[#4B4B4B] font-bold text-4xl py-1">
                  playlist curator
                </div>
                <div className="text-[#4B4B4B] font-bold text-4xl py-1">
                  music librarian
                </div>
                <div className="text-[#4B4B4B] font-bold text-4xl py-1">
                  spotify librarian
                </div>
              </div>
            </div>
            <div className="h-full flex flex-col flex-start justify-between">
              <div className="text-xl">Make me a playlist</div>
              <ButtonPrimary text={"Get Started"} onClick={() => onLogin()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
