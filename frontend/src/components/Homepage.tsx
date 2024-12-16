import React, { useState, useEffect } from "react";
import { fetchEmployeeName } from '../utils/api';
import foto from "../assets/image 7.png";
import foto1 from "../assets/calendar.png";
import { useNavigate } from "react-router-dom";

const Homepage: React.FC = () => {
  const [path, setPath] = useState(0);
  const handlePath = (selectedPath: number, location: string) => {
    setPath(selectedPath);
    navigate(`/${location}`);
  }

  const handleNavigate = () =>{
    navigate('/');
  }

  const navigate = useNavigate();
  const [dateTime, setDateTime] = useState("");
  const [employeeName, setEmployeeName] = useState("");

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

      const dayOfWeek = daysOfWeek[now.getDay()];
      const month = months[now.getMonth()];
      const day = now.getDate().toString().padStart(2, "0");
      const year = now.getFullYear();

      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");

      const formattedDateTime = `${hours}:${minutes}, ${dayOfWeek}/${day}/${month}/${year}`;
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
        const { firstName } = await fetchEmployeeName(Number(idEmployee));
        setEmployeeName(firstName);
      }
    };

    getEmployeeName();
  }, []);

  return (
    <>
      <div className="homepage__total">
        <div className="homepage">
          <div className="homepage__header">
            <img className="homepage__clock" src={foto} alt="clock" />
            <div className="homepage__datetime">{dateTime}</div>
          </div>
          <div className="homepage__text">
            Hello,{" "}
            <span>
              <b>{employeeName}</b>
            </span>
          </div>
          <div className="homepage__information">
            You are working remotely today.
          </div>
          <div onClick={() => handlePath(0, "bookdesk")} className="homepage__button">Change your status</div>
        </div>

        <img className="foto__calendar" src={foto1} alt="calendar"/>
        <div className="information">You have no bookings today.</div>
      </div>
    </>
  );
};

export default Homepage;