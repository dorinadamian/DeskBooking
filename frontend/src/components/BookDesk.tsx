import React, { useState, useEffect } from "react";
import { fetchCountries, fetchLocations, checkBookingOverlap, fetchLocationId, fetchReservations, updateBooking, deleteBooking } from "../utils/api";
import { useNavigate } from "react-router-dom";

const BookDesk: React.FC = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<{ [key: string]: string[] }>({});
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<{ from: string; to: string }>({ from: "", to: "" });
  const [showTimePicker, setShowTimePicker] = useState(true);
  const [warningMessage, setWarningMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [overlap, setOverlap] = useState<{ overlap: boolean, booking: any } | null>(null);
  const [showButtons, setShowButtons] = useState(true);
  const [showProgressBar, setShowProgressBar] = useState(true);
  const [popupType, setPopupType] = useState<"warning" | "success">("warning");

  useEffect(() => {
    if (selectedDate) {
      const now = new Date();
      const currentHour = now.getHours();
      const nowDateString = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`; // Formatează data curentă în format YYYY-M-D
      const isToday = selectedDate.toString() === nowDateString;

      if (isToday && currentHour >= 18) {
        setShowTimePicker(false);
        setWarningMessage("You can no longer book a desk for today.");
        setPopupType("warning");
        setShowPopup(true);
        setSelectedDate(null);
      } else {
        setShowTimePicker(true);
        setWarningMessage("");
        setShowPopup(false);
      }
    }
  }, [selectedDate]);

  useEffect(() => {
    if (showPopup && !showButtons) {
      setIsButtonDisabled(true);
      setShowProgressBar(true); // Afișează bara de progres când butoanele nu sunt vizibile
      const timer = setTimeout(() => {
        setShowPopup(false);
        setIsButtonDisabled(false);
      }, 4000);

      return () => clearTimeout(timer);
    } else if (showButtons) {
      setShowProgressBar(false); 
    }
  }, [showPopup, selectedTime, showButtons]);

  const handlePath = async () => {
    const idEmployee = localStorage.getItem('idEmployee');
    if (idEmployee && selectedDate && selectedTime.from && selectedTime.to) {
      const locationId = await fetchLocationId(selectedCountry, selectedCity);
      if (locationId) {
        const overlap = await checkBookingOverlap(Number(idEmployee), selectedDate, selectedTime.from, selectedTime.to, locationId);
        if (overlap.overlap) {
          setOverlap(overlap);
          setWarningMessage(`You already have a booking from ${overlap.booking.startTime} to ${overlap.booking.endTime} at ${overlap.booking.location}, ${overlap.booking.country}.`);
          setPopupType("warning");
          setShowButtons(true);
          setShowPopup(true);
          return;
        }
      }
    }
    setShowButtons(false); // Setează `showButtons` la `false` pentru alte popup-uri
    navigate('/search', { state: { selectedDate, selectedTime, selectedCountry, selectedCity } });
  };

  const handleYesClick = async () => {
    if (overlap && overlap.booking) {
      await deleteBooking(overlap.booking.id);
      setShowPopup(false);
      navigate('/search', { state: { selectedDate, selectedTime, selectedCountry, selectedCity } });
    }
  };

  const handleNoClick = () => {
    setShowPopup(false);
  };

  const isWeekday = (date: Date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // 0 = Sunday, 6 = Saturday
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const countries = await fetchCountries();
        setCountries(countries);

        const citiesByCountry = await fetchLocations();
        setCities(citiesByCountry);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const Dropdown = ({
    options,
    selectedOption,
    onOptionSelect,
    disabled = false,
  }: {
    options: string[];
    selectedOption: string;
    onOptionSelect: (option: string) => void;
    disabled?: boolean;
  }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const selectOption = (option: string) => {
      onOptionSelect(option);
      setIsOpen(false);
    };

    return (
      <div className={`dropdown ${disabled ? "disabled" : ""}`}>
        <div
          className="dropdown-header"
          onClick={!disabled ? toggleDropdown : undefined}
        >
          {selectedOption || "Select"}
          <svg
            className="dropdown-arrow"
            width="32"
            height="19"
            viewBox="0 0 32 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.5822 18.0242L0 3.40998L3.63585 0L15.5822 11.2042L27.5285 0L31.1644 3.40998L15.5822 18.0242Z"
              fill="#CCCCCC"
            />
          </svg>
        </div>
        {isOpen && (
          <ul className="dropdown-list">
            {options.map((option) => (
              <li
                key={option}
                onClick={() => selectOption(option)}
                className={`dropdown-item ${
                  option === selectedOption ? "selected" : ""
                }`}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
   
  const Calendar = () => {
    const currentDate = new Date(); 
    const daysInMonth = new Date(year, month + 1, 0).getDate(); 
    let firstDay = new Date(year, month, 1).getDay(); 
    
    if (year === 2025 && month === 0) {
      firstDay = 3; 
    }

    if (firstDay === 0) {
      firstDay = 7;
    }

    const handleDayClick = (day: number, isPast: boolean) => {
      if (!isPast) {
        const clickedDate = `${year}-${month + 1}-${day}`;
        setSelectedDate((prevDate) =>
          prevDate === clickedDate ? null : clickedDate
        );
      }
    };

    const handleNextMonth = () => {
      if (month === 11) {
        setMonth(0);
        setYear((prevYear) => prevYear + 1);
      } else {
        setMonth((prevMonth) => prevMonth + 1);
      }
    };

    const handlePrevMonth = () => {
      if (month === 0) {
        setMonth(11);
        setYear((prevYear) => prevYear - 1);
      } else {
        setMonth((prevMonth) => prevMonth - 1);
      }
    };

    return (
      <div className="calendar">
        <div className="calendar-header">
          <button onClick={handlePrevMonth}>{"<"}</button>
          <h3>
            {new Date(year, month).toLocaleString("default", { month: "long" })}{" "}
            {year}
          </h3>
          <button onClick={handleNextMonth}>{">"}</button>
        </div>
        <div className="calendar-grid">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <div key={i} className="calendar-day-name">
              {d}
            </div>
          ))}
          {Array.from({ length: firstDay - 1 }, (_, i) => (
            <div key={`empty-${i}`} className="calendar-day empty"></div>
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const date = new Date(year, month, day);
            const isPast =
              year < currentDate.getFullYear() ||
              (year === currentDate.getFullYear() &&
                month < currentDate.getMonth()) ||
              (year === currentDate.getFullYear() &&
                month === currentDate.getMonth() &&
                day < currentDate.getDate());

                const isWeekend = date.getDay() === 0 || date.getDay() === 6;

            return (
              <div
                key={i}
                className={`calendar-day ${isPast || isWeekend ? "inactive" : ""} ${
                  selectedDate === `${year}-${month + 1}-${day}` ? "selected" : ""
                }`}
                onClick={() => handleDayClick(day, isPast)}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const TimePicker = ({ selectedDate }: { selectedDate: Date }) => {
    const [availableFromHours, setAvailableFromHours] = useState<string[]>([]);
    const [availableToHours, setAvailableToHours] = useState<string[]>([]);
    const [tooltipMessage, setTooltipMessage] = useState<string>("");
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
  
    useEffect(() => {
      const now = new Date();
      const currentHour = now.getHours();
      const isToday = selectedDate.toDateString() === now.toDateString();
  
      let fromHours: string[] = [];
      if (isToday && currentHour >= 8) {
        fromHours = Array.from({ length: 19 - currentHour }, (_, i) => `${currentHour + i}:00`).filter(hour => parseInt(hour) >= currentHour);
      } else {
        fromHours = Array.from({ length: 11 }, (_, i) => `${8 + i}:00`);
      }
      setAvailableFromHours(fromHours);
    }, [selectedDate]);
  
    useEffect(() => {
      if (selectedTime.from) {
        const fromHour = parseInt(selectedTime.from);
        const toHours = Array.from({ length: 24 - fromHour }, (_, i) => `${fromHour + i}:00`).filter(hour => parseInt(hour) >= fromHour + 2 && parseInt(hour) <= 20);
        setAvailableToHours(toHours);
      } else {
        setAvailableToHours([]);
      }
    }, [selectedTime.from]);
  
    setIsButtonDisabled(!selectedTime.from || !selectedTime.to || !selectedCountry || !selectedCity);
  
    const handleMouseEnter = () => {
      if ((!selectedCountry || !selectedCity) && (!selectedTime.from || !selectedTime.to)) {
        setTooltipMessage("You must select a location and a time slot first");
      } else if (!selectedCountry && !selectedCity) {
        setTooltipMessage("You must select a location");
      } else if (!selectedTime.from || !selectedTime.to) {
        setTooltipMessage("You must select a time slot");
      } else {
        setTooltipMessage("");
      }
      setShowTooltip(true);
    };
  
    const handleMouseLeave = () => {
      setShowTooltip(false);
    };
  
    return (
      <div className="time-picker">
        <h4>Select time for {selectedDate.toDateString()}</h4>
        <label>
          From:
          <select
            value={selectedTime.from}
            onChange={(e) => {
                setSelectedTime({ ...selectedTime, from: e.target.value })
                localStorage.setItem('selectedStartTime', selectedTime.from);
              }
            }
          >
            <option value="">Select time</option>
            {availableFromHours.map(hour => (
              <option key={hour} value={hour}>{hour}</option>
            ))}
          </select>
        </label>
        <label>
          To:
          <select
            value={selectedTime.to}
            onChange={(e) =>{
                setSelectedTime({ ...selectedTime, to: e.target.value })
                localStorage.setItem('selectedEndTime', selectedTime.to);
              } 
            }
          >
            <option value="">Select time</option>
            {availableToHours.map(hour => (
              <option key={hour} value={hour}>{hour}</option>
            ))}
          </select>
        </label>
        <div className="tooltip-container"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
        <button
          onClick={() => handlePath()}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`button__timepicker ${isButtonDisabled ? "disabled" : ""}`}
          disabled={isButtonDisabled}
        >
          Search
        </button>
        {showTooltip && tooltipMessage && (
          <div className="tooltip">
            {tooltipMessage}
          </div>
        )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bookDesk" style={{ width: "100%", height: "100%" }}>
        <div className="bookDesk__title">Book a Desk</div>
        <div className="bookDesk__page">
          <div className="bookDesk__top">
            <div className="bookDesk__choose">
              <div className="bookDesk__type">
                <div className="name">Country</div>
                <Dropdown
                  options={countries}
                  selectedOption={selectedCountry}
                  onOptionSelect={(country) => {
                    setSelectedCountry(country);
                    setSelectedCity(""); 
                    localStorage.setItem('selectedCountry', country); 
                  }}
                />
              </div>
              <div className="bookDesk__type">
                <div className="name">City</div>
                <Dropdown
                  options={cities[selectedCountry] || []}
                  selectedOption={selectedCity}
                  onOptionSelect={(city) => {
                    setSelectedCity(city);
                    localStorage.setItem('selectedCity', city); 
                  }}
                  disabled={!selectedCountry}
                />
              </div>
            </div>
          </div>
          <div className="bookDesk__bottom">
            <Calendar />
            {selectedDate && (
              <div className="bookDesk__right">
                {showTimePicker && selectedDate && (
                  <TimePicker selectedDate={new Date(selectedDate)} />
                )}
              </div>
            )}
            {showPopup && (
              <div className="bookdesk-popup-overlay">
                <div className="bookdesk-popup-content">
                  <p>{warningMessage} <br></br>Do you want to delete it and continue?</p>
                  {showButtons && (
                    <div className="bookdesk-popup-buttons">
                      <button className="yes-button" onClick={handleYesClick}>Yes</button>
                      <button className="no-button" onClick={handleNoClick}>No</button>
                    </div>
                  )}
                  {showProgressBar && (
                    <div className="progress-bar">
                      <div className="progress"></div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BookDesk;
