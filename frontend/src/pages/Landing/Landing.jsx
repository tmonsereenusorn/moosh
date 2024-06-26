import React from "react";
import { useNavigate } from "react-router-dom";
import { ButtonPrimary } from "../../components/ButtonPrimary";
import { useAuth } from "../../contexts/AuthProvider";

const Landing = () => {
  const { authorized } = useAuth();
  const navigate = useNavigate();

  const onStart = () => {
    if (authorized) {
      navigate("/curator");
    } else {
      navigate("/login");
    }
  };

  const handleTryItClick = () => {
    navigate("/try-it");
  };

  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-gradient-to-br from-gradientStart via-gradientMiddle/[.8] to-gradientEnd/[.56] overflow-hidden">
      <div className="w-screen flex items-center justify-center">
        <div className="w-full md:w-2/3 h-screen flex items-center justify-center">
          <div className="h-1/3 md:h-1/2 w-full flex flex-col md:flex-row items-center justify-between">
            <div className="h-full flex flex-col flex-start justify-center text-center md:text-start">
              <div className="text-primary font-bold text-8xl md:text-8xl mb-4 md:mb-8">moosh</div>
              <div className="text-surface font-bold text-2xl md:text-4xl py-1">playlist curator</div>
            </div>
            <div className="h-full flex flex-col flex-start justify-between mt-8 md:mt-0">
              <div className="hidden md:block md:flex-grow"></div>
              <div className="flex flex-col items-end justify-center">
                <ButtonPrimary
                  text={authorized ? "Go To Curator" : "Login"}
                  onClick={onStart}
                  size={"xl"}
                  width={250}
                />
                {!authorized && (
                  <p
                    className="text-md md:text-sm underline cursor-pointer mt-2 mr-1"
                    onClick={handleTryItClick}
                  >
                    ...or try it without an account!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
