import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  fetchDesksByLocation,
  fetchReservations,
  fetchLocationId,
} from "../utils/api";
import axios from 'axios';

const ChooseDesk: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    selectedDate,
    selectedTime,
    selectedCountry,
    selectedCity,
    userFirstName,
    userLastName,
  } = location.state || {};
  const [desks, setDesks] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [deskId, setDeskId] = useState<any[]>([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [madeReservation, setMadeReservation] = useState(false);
  const [hoverInfo, setHoverInfo] = useState<{
    visible: boolean;
    content: any;
    x: number;
    y: number;
  }>({ visible: false, content: "", x: 0, y: 0 });
  const [modalInfo, setModalInfo] = useState<{
    visible: boolean;
    desk: any | null;
  }>({ visible: false, desk: null });

  const handlePath = () => {
    navigate("/bookdesk");
  };

  const handleDotClick = (desk: any) => {
    setModalInfo({ visible: true, desk });
    setShowSuccessPopup(false);
  };

  const handleBookDesk = async () => {
    const idEmployee = localStorage.getItem("idEmployee");
    
    if (modalInfo.desk) {
      const newReservation = {
        "employee": idEmployee,
        "desk": modalInfo.desk.idDesk,
        "bookingDate": selectedDate,
        "startTime": selectedTime.from,
        "endTime": selectedTime.to
      };

      try {
        const response = await axios.post('http://localhost:5000/bookings', newReservation);
        const updatedReservations = [...reservations, newReservation];
        setReservations(updatedReservations);
        setModalInfo({ visible: false, desk: null });
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 2000);
        navigate('/booking');
      } catch (error) {
        console.error('Error booking desk:', error);
      }
    }
  };

  const handleMouseOver = (reservation: any, event: React.MouseEvent) => {
    const { firstName, lastName, bookingDate, startTime, endTime } =
      reservation;
    const content = (
      <div className="hover-content">
        <div className="hover-header">
          {firstName} {lastName}
        </div>
        <div className="hover-divider"></div>
        <div className="hover-details">
          <div>Date: {bookingDate}</div>
          <div>
            Time slot: {startTime} - {endTime}
          </div>
        </div>
      </div>
    );
    setHoverInfo({
      visible: true,
      content,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleMouseOut = () => {
    setHoverInfo({ visible: false, content: "", x: 0, y: 0 });
  };

  useEffect(() => {
    const fetchDesks = async () => {
      if (selectedCountry && selectedCity) {
        const locationId = await fetchLocationId(
          selectedCountry,
          selectedCity
        );
        if (locationId) {
          const desks = await fetchDesksByLocation(locationId);
          setDesks(desks);
        }
      }
    };

    const fetchReservationsData = async () => {
      if (selectedCountry && selectedCity && selectedDate && selectedTime) {
        const locationId = await fetchLocationId(
          selectedCountry,
          selectedCity
        );
        if (locationId) {
          const reservations = await fetchReservations(
            selectedDate,
            selectedTime.from,
            selectedTime.to,
            locationId
          );
          setReservations(reservations);
        }
      }
    };

    fetchDesks();
    fetchReservationsData();
  }, [selectedCountry, selectedCity, selectedDate, selectedTime]);

  const deskGroups = [];
  for (let i = 0; i < desks.length; i += 10) {
    deskGroups.push(desks.slice(i, i + 10));
  }

  return (
    <div className="chooseDesk">
      <div className="arrow__chooseDesk">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#1f4593"
        >
          <path d="M354-270 144-480l210-210 51 51-123 123h534v72H282l123 123-51 51Z" />
        </svg>
        <div onClick={() => handlePath()} className="title">
          Edit search
        </div>
      </div>
      <div className="chooseDesk__title">Choose a desk</div>
      <div className="chooseDesk__information">
        {deskGroups.map((group, groupIndex) => (
          <div className="office-desk" key={groupIndex}>
            {[...Array(5)].map((_, rowIndex) => (
              <div key={rowIndex} className="desk-row">
                {[...Array(2)].map((_, colIndex) => {
                  const deskIndex = rowIndex + colIndex * 5;
                  const desk = group[deskIndex];
                  const reservation = reservations.find(
                    (res) => res.deskNumber === desk.deskNumber
                  );
                  return (
                    <div key={colIndex} className="desk-cell">
                      {desk && (
                        <>
                          <div
                            className="dot"
                            style={{
                              backgroundColor: reservation
                                ? "#788EB9"
                                : "green",
                            }}
                            onClick={() => !reservation && handleDotClick(desk)}
                          >
                            
                            {reservation &&
                              reservation.firstName &&
                              reservation.lastName && (
                                <span
                                  className="initials"
                                  onMouseOver={(event) =>
                                    handleMouseOver(reservation, event)
                                  }
                                  onMouseOut={handleMouseOut}
                                >
                                  {reservation.firstName.charAt(0)}
                                  {reservation.lastName.charAt(0)}
                                </span>
                              )}
                          </div>
                          <span className="desk-number">{desk.deskNumber}</span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>

      {hoverInfo.visible && (
        <div
          className="hover-box"
          style={{
            top: hoverInfo.y,
            left: hoverInfo.x,
          }}
        >
          {hoverInfo.content}
        </div>
      )}
      {modalInfo.visible && modalInfo.desk && (
        <div className="modal">
          <div
            className="modal-overlay"
            onClick={() => setModalInfo({ visible: false, desk: null })}
          ></div>
          <div className="modal-content">
            <div>Desk {modalInfo.desk.deskNumber} is free. You can book it.</div>
            <button className="book-button" onClick={handleBookDesk}>
              BOOK
            </button>
            <button
              className="book-button1"
              onClick={() => setModalInfo({ visible: false, desk: null })}
            >
              CANCEL
            </button>
          </div>
        </div>
      )}

      <div className="legend">
        <div className="legend-item">
          <div className="dot" style={{ backgroundColor: "green" }}></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="dot" style={{ backgroundColor: "gray" }}></div>
          <span>Closed</span>
        </div>
        <div className="legend-item">
          <div className="dot" style={{ backgroundColor: "#788EB9" }}></div>
          <span>Booked</span>
        </div>
      </div>
      {showSuccessPopup && (
        <div className="bookings-success-popup">
          <div className="bookings-success-popup-content">
            <p>Desk booked successfully</p>
            <div className="progress-bar">
              <div className="progress"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChooseDesk;
