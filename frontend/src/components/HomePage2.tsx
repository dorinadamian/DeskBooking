import React, { useState, useEffect } from "react";
import { fetchEmployeeName } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { fetchBookingsByEmployee } from "../utils/api";

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
  const [employeeName, setEmployeeName] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [deskNumber, setDeskNumber] = useState('');

  useEffect(() => {
    const getEmployeeName = async () => {
      const idEmployee = localStorage.getItem('idEmployee');
      if (idEmployee) {
        const { firstName } = await fetchEmployeeName(Number(idEmployee));
        setEmployeeName(firstName);
      }
    };

    const getBookings = async () => {
      const idEmployee = localStorage.getItem('idEmployee');
      if (idEmployee) {
        const bookings = await fetchBookingsByEmployee(Number(idEmployee));
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const today = `${day}/${month}/${year}`;
        const currentTime = now.getHours() * 60 + now.getMinutes();

        const todayBookings = bookings
          .filter((booking: any) => booking.date === today)
          .sort((a: any, b: any) => {
            const [aStartHour, aStartMinute] = a.from.split(':').map(Number);
            const [bStartHour, bStartMinute] = b.from.split(':').map(Number);
            return (aStartHour * 60 + aStartMinute) - (bStartHour * 60 + bStartMinute);
          });

        const validBooking = todayBookings.find((booking: any) => {
          const [endHour, endMinute] = booking.to.split(':').map(Number);
          const bookingEndTime = endHour * 60 + endMinute;
          return bookingEndTime > currentTime;
        });

        if (validBooking) {
          setLocation(validBooking.location);
          setStartTime(validBooking.from);
          setEndTime(validBooking.to);
          setDeskNumber(validBooking.desk);
        } else {
          navigate('/today');
        }
      }
    };

    getEmployeeName();
    getBookings();
  }, [navigate]);

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
            You’re at {location} today
          </div>
          <div className="homepage2__changeStatus">
            Isn't that right?
          </div>
          <button
            onClick={() => handlePath(0, "bookdesk")}
            className="homepage2__button"
          >
            Change your status
          </button>
        </div>

        <div className="homepage3">
          <div className="homepage2__text"><b>Desk {deskNumber}</b></div>
          <div className="homepage3__information">
            {startTime} - {endTime}
          </div>
          <div className="homepage3__checkin">You must check in to confirm the booking</div>
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
