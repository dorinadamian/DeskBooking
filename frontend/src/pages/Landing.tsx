import React, { useState } from "react";
import foto from "../assets/image 1.png";
import foto1 from "../assets/image 2.png";
import { useNavigate } from "react-router-dom";
import { login } from '../utils/api';

const Landing: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return email.includes("@myfirm.com");
  };

  const handleNavigate = async () => {
    if (!validateEmail(email)) {
      setEmailError("Invalid email address");
      return;
    }

    try {
      const { idEmployee } = await login(email, password);
      localStorage.setItem('idEmployee', idEmployee);
      navigate('/today');
    } catch (error) {
      setError((error as any).message);
    }
  };

  return (
    <>
      <div className="container">
        <div className="container__left">
          <h1>Hello, Welcome!</h1>
          <p>Don't have an account?</p>
          <button className="register-btn">Register</button>
        </div>
        <div className="container__right">
          <h1 className="title">Login</h1>
          <form>
            <div className="input-group">
              <input
                className="input__group__text"
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(""); // Clear email error on change
                  setError(""); // Clear general error on change
                }}
              />
              <img className="foto__user" src={foto} alt="foto" />
            </div>
            {emailError && <div className="error-message">{emailError}</div>}
            <div className="input-group">
              <input
                className="input__group__text"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(""); // Clear general error on change
                }}
              />
              <img className="foto__password" src={foto1} alt="foto" />
            </div>
          </form>
          {error && <div className="error-message">{error}</div>}
          <a href="#" className="forgot-password">
            Forgot password?
          </a>
          <button onClick={handleNavigate} className="login-btn">
            Login
          </button>
        </div>
      </div>
    </>
  );
};

export default Landing;
