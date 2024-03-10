import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@chakra-ui/react";
import { ButtonPrimary} from "../../components/ButtonPrimary";
import { firebaseSignup } from "../../api/firebase";
import { authorize } from "../../api/auth";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [error, setError] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setDisabled(email.includes("@") && email.includes(".") && password.length >= 8 && password === confirmedPassword);
  }, [email, password, confirmedPassword]);

  const signup = () => {
    firebaseSignup(email, password).then(res => {
      if (!!!res) {
        setError(true);
      } else {
        authorize(true);
      }
    });
  };

  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-gradient-to-br from-gradientStart via-gradientMiddle/[.8] to-gradientEnd/[.56] overflow-hidden h-screen">
      <div className="flex justify-center items-center h-screen">
        <div className="w-1/4 space-y-4">
          <p className="text-5xl font-bold text-white">sign up.</p>
          <Input placeholder="email" textColor="white" onChange={e => setEmail(e.target.value)} />
          <div className="space-y-2">
            <Input placeholder="password" type="password" textColor="white" onChange={e => setPassword(e.target.value)} />
            <p className="text-white text-xs">must be at least 8 characters.</p>
          </div>
          <Input placeholder="confirm password" type="password" textColor="white" onChange={e => setConfirmedPassword(e.target.value)} />
          <div className="flex w-full items-center justify-end">
            <ButtonPrimary text="continue" onClick={() => signup()} disabled={disabled} />
          </div>
          {error && <p className="text-red-500">there was an issue signing you up.</p>}
          <div className="text-center">
            <p className="text-white text-xs">already a member? <span className="hover:underline hover:cursor-pointer" onClick={() => navigate("/login")}>login.</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;