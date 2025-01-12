import React, { useState, useEffect } from "react";
import { fetchEmployeeName } from "../utils/api";
import { useNavigate } from "react-router-dom";

const HomePage2: React.FC = () => {
  const [path, setPath] = useState(0);
  const handlePath = (selectedPath: number, location: string) => {
    setPath(selectedPath);
    navigate(`/${location}`);
  };

  const handleNavigate = () => {
    navigate("/");
  };

  const navigate = useNavigate();
  const [employeeName, setEmployeeName] = useState("");

  useEffect(() => {
    const getEmployeeName = async () => {
      const idEmployee = localStorage.getItem("idEmployee");
      if (idEmployee) {
        const { firstName } = await fetchEmployeeName(Number(idEmployee));
        setEmployeeName(firstName);
      }
    };

    getEmployeeName();
  }, []);

  return (
    <>
      <div className="homepage2__total">
        <div className="homepage2">
          <div className="homepage2__text">
            Hello,{" "}
            <span>
              <b>{employeeName}</b>
            </span>
          </div>
          <div className="homepage2__information">
            You’re at Iuliu Maniu, 56
            <br></br>Today
          </div>
          <button
            onClick={() => handlePath(0, "bookdesk")}
            className="homepage2__button"
          >
            Change your status
          </button>
        </div>

        <div className="homepage3">
          <div className="homepage2__text">Desk</div>
          <div className="homepage3__information">
            1<br></br>Iuliu Maniu, 56
          </div>

          <button
            onClick={() => handlePath(0, "bookdesk")}
            className="homepage3__button"
          >
            Check in
          </button>
        </div>
      </div>
    </>
  );
};

export default HomePage2;
