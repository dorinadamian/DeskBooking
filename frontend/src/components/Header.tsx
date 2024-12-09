import React, { useState, useEffect } from 'react';
import foto from "../assets/MyDeskHub 1.png";

const Header: React.FC = () => {
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
   
    const updateDateTime = () => {
      const now = new Date();
      const formattedDateTime = now.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, 
      }).replace(",", " |");
      setDateTime(formattedDateTime);
    };

    updateDateTime(); 
    const interval = setInterval(updateDateTime, 1000); 

    return () => clearInterval(interval); 
  }, []);

  return (
    <div className="header">
      <img className="header__logo" src={foto} alt="foto" />
      <span className="header__title">MyDeskHub</span>
      <span className="header__name">Hi, Diana*</span>
      <span className="header__datetime">{dateTime}</span>
      <span>cerculet</span>
    </div>
  );
};

export default Header;
