import React from "react";
import foto from "../assets/image 1.png";
import foto1 from "../assets/image 2.png";
import { useNavigate } from "react-router-dom";

const Landing: React.FC = () => {

  const navigate = useNavigate();

  const handleNavigate = () =>{
    navigate('/today');
  }

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
              <input className="input__group__text" type="text" placeholder="Username" />
              <img className="foto__user" src={foto} alt="foto" />
            </div>
            <div className="input-group">
              <input className="input__group__text" type="password" placeholder="Password" />
              <img className="foto__password" src={foto1} alt="foto" />
            </div>
          </form>
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
