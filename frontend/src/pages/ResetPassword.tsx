import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/MyDeskHub 1.png";
import userIcon from "../assets/image 1.png";
import passwordIcon from "../assets/image 2.png";

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (successMessage || error) {
      const timeout = setTimeout(() => {
        setSuccessMessage("");
        setError("");
        if (successMessage) {
          navigate("/");
        }
      }, 2000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [successMessage, error, navigate]);

  const handleResetPassword = async () => {
    setError("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:5000/reset-password", {
        email,
        newPassword,
      });
      setSuccessMessage("Password changed successfully");
    } catch (error) {
      setError("Failed to reset password");
    }
  };

  return (
    <div className="outer-container">
      <div className="container">
        <div className="container__left">
          <h1 style={{ fontSize: '3rem' }}>Hello,</h1>
          <h2 style={{ fontSize: '2.5rem' }}>Welcome to</h2>
          <img className="logo" src={logo} alt="mydeskhub logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
          <span className="foto_title" style={{ fontSize: '1.5rem' }}>MyDeskHub</span>
        </div>
        <div className="container__right">
          <h1 className="title">Reset Password</h1>
          <form>
            <div className="input-group">
              <input
                className="input__group__text"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <img className="foto__user" src={userIcon} alt="user icon" />
            </div>
            <div className="input-group">
              <input
                className="input__group__text"
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <img className="foto__password" src={passwordIcon} alt="password icon" />
            </div>
            <div className="input-group">
              <input
                className="input__group__text"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <img className="foto__password" src={passwordIcon} alt="password icon" />
            </div>
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            <button type="button" onClick={handleResetPassword} className="reset-btn">
              Done
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;