import React, { useState, useEffect } from 'react';
import { fetchEmployeeName } from '../utils/api';
import foto from "../assets/MyDeskHub 1.png";

const Header: React.FC = () => {
  const [dateTime, setDateTime] = useState("");
  const [employeeInitials, setEmployeeInitials] = useState("");
  const [employeeDetails, setEmployeeDetails] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

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
    const getEmployeeDetails = async () => {
      const idEmployee = localStorage.getItem('idEmployee');
      if (idEmployee) {
        const details = await fetchEmployeeName(Number(idEmployee));
        setEmployeeDetails(details);
        setEmployeeInitials(details.initials);
      }
    };
    // getEmployeeName();
    getEmployeeDetails();
  }, []);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="header">
      <img className="header__logo" src={foto} alt="foto" />
      <span className="header__title">MyDeskHub</span>
      <div className="header__right">
        <span className="header__datetime">{dateTime}</span>
        <div className="circle" onClick={toggleDetails}>
          <span className="circle__text">{employeeInitials}</span>
        </div>
        {showDetails && employeeDetails && (
          <div className="employee-details">
            <div className="employee-details__header">
              {employeeDetails.firstName} {employeeDetails.lastName}
            </div>
            <div className="employee-details__body">
              <div><strong>Department:</strong> {employeeDetails.department}</div>
              {employeeDetails.role !== 'Manager' && (
                  <div><strong>Manager:</strong> {employeeDetails.manager}</div>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;