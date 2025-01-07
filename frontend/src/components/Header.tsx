import React, { useState, useEffect } from 'react';
import { fetchEmployeeName } from '../utils/api';
import foto from "../assets/MyDeskHub 1.png";

const Header: React.FC = () => {
  const [dateTime, setDateTime] = useState("");
  const [employeeInitials, setEmployeeInitials] = useState("");

    useEffect(() => {
      const updateDateTime = () => {
        const now = new Date();
  
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
  
        const month = months[now.getMonth()];
        const day = now.getDate().toString().padStart(2, "0");
        const year = now.getFullYear();
  
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
  
        const formattedDateTime = `${day} ${month} ${year} | ${hours}:${minutes}`;
        setDateTime(formattedDateTime);
      };
  
      updateDateTime();
      const interval = setInterval(updateDateTime, 1000);
  
      return () => clearInterval(interval);
    }, []);

  useEffect(() => {
    const getEmployeeName = async () => {
      const idEmployee = localStorage.getItem('idEmployee');
      if (idEmployee) {
        const {initials} = await fetchEmployeeName(Number(idEmployee));
        setEmployeeInitials(initials);
      }
    };

    getEmployeeName();
  }, []);

  return (
    <div className="header">
      <img className="header__logo" src={foto} alt="foto" />
      <span className="header__title">MyDeskHub</span>
      <div className="header__right">
        <span className="header__datetime">{dateTime}</span>
        <div className="circle">
          <span className="circle__text">{employeeInitials}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;