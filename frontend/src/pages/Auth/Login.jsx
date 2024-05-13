import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@chakra-ui/react";
import { ButtonPrimary} from "../../components/ButtonPrimary";
import { firebaseAuth, firebaseLogin } from "../../api/firebase";
import { authorize } from "../../api/auth";
import { useAuth } from "../../contexts/AuthProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const { authorized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authorized) navigate("/curator");
  // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setDisabled(!email.includes("@") || !email.includes(".") || password.length < 8);
  }, [email, password]);

  const login = () => {
    firebaseLogin(email, password).then(res => {
      if (!!!res) {
        setError(true);
      } else {
        firebaseAuth.onAuthStateChanged(user => {
          if (!!user) {
            fetchUserData(user.uid).then(data => {
              Cookies.set('refresh_token', data.refreshToken, { expires: 7, secure: true });
              authorize(false);
            });
          }
        });
      }
    });
  };

  const handleEnter = e => {
    if (e.key === "Enter" && !disabled) {
      login();
    }
  };

  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-gradient-to-br from-gradientStart via-gradientMiddle/[.8] to-gradientEnd/[.56] overflow-hidden h-screen">
      <div className="flex justify-center items-center h-screen">
        <div className="w-3/4 md:w-1/4 space-y-4 ">
          <p className="text-5xl font-bold text-white">login.</p>
          <Input placeholder="email" textColor="white" onChange={e => setEmail(e.target.value)} />
          <Input placeholder="password" type="password" textColor="white" onChange={e => setPassword(e.target.value)} onKeyDown={handleEnter} />
          <div className="flex w-full items-center justify-end">
            <ButtonPrimary text="continue" onClick={() => login()} disabled={disabled} />
          </div>
          {error && <p className="text-center md:text-start text-red-500">invalid credentials.</p>}
          <div className="text-center">
            <p className="text-white text-md md:text-xs">not a member yet? <span className="hover:underline hover:cursor-pointer" onClick={() => navigate("/signup")}>sign up.</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;