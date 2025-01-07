import React, { useState, useEffect } from "react";
import { fetchEmployeeName } from '../utils/api';
import foto1 from "../assets/a.png";
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
          <div className="homepage__text">
            Hello,{" "}
            <span>
              <b>{employeeName}</b>
            </span>
          </div>
          <div className="homepage__information">
            You are working remotely today.
          </div>
          <div className="homepage__changeStatus"> Isn't it right?</div>
          <button onClick={() => handlePath(0, "bookdesk")} className="homepage__button">Change your status</button>
        </div>

        <img className="foto__calendar" src={foto1} alt="calendar"/>
        <div className="information">You have no bookings today.</div>
      </div>
    </>
  );
};

export default Homepage;