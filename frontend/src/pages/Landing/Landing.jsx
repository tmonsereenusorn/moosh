import React from "react";
import { useNavigate } from "react-router-dom";
import { ButtonPrimary } from "../../components/ButtonPrimary";
import { authorize } from "../../api/auth";
import { useAuth } from "../../contexts/AuthProvider";

const Landing = () => {
  const navigate = useNavigate();
  const { authorized } = useAuth();

  const onStart = () => {
    if (authorized) {
      navigate("/curator");
    } else {
      authorize(true);
    }
  };

  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-gradient-to-br from-gradientStart via-gradientMiddle/[.8] to-gradientEnd/[.56] overflow-hidden h-screen">
      <div className="w-screen flex items-center justify-center">
        <div className="w-2/3 h-screen flex items-center justify-center">
          <div className="h-1/2 w-full flex flex-row items-center justify-between">
            <div className="h-full flex flex-col flex-start justify-center">
              <div className="text-primary font-bold text-8xl mb-8">moosh</div>
              <div>
                <div className="text-surface font-bold text-4xl py-1">
                  playlist curator
                </div>
                <div className="text-surface font-bold text-4xl py-1">
                  music analyst
                </div>
                <div className="text-surface font-bold text-4xl py-1">
                  spotify librarian
                </div>
              </div>
            </div>
            <div className="h-full flex flex-col flex-start justify-between">
              <div className="text-xl"></div>
              <ButtonPrimary
                text={authorized ? "Go To Curator" : "Get Started"}
                onClick={() => onStart()}
                size={"xl"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
