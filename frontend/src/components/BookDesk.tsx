import React, { useState, useEffect } from "react";
import { fetchCountries, fetchLocations } from '../utils/api';

const BookDesk: React.FC = () => {
  const [countries, setCountries] = useState<string[]>([]);
  const [locations, setLocations] = useState<{ [key: string]: string[] }>({});
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(true);
  const [warningMessage, setWarningMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const countries = await fetchCountries();
        setCountries(countries);

        const locationsByCountry = await fetchLocations();
        console.log("locationsByCountry", locationsByCountry);
        setLocations(locationsByCountry);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    console.log("fetchData", locations);
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
        <div className="dropdown-header" onClick={!disabled ? toggleDropdown : undefined}>
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
                className={`dropdown-item ${option === selectedOption ? "selected" : ""}`}
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
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());

    const currentDate = new Date(); // Data curentă
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Numărul de zile din lună
    let firstDay = new Date(year, month, 1).getDay(); // Prima zi a lunii (0 = Duminică, 1 = Luni, etc.)

    // Ajustare pentru 1 ianuarie 2025
    if (year === 2025 && month === 0) {
      firstDay = 3; // 3 corespunde zilei de miercuri
    }

    // Dacă prima zi este 0 (Duminică), mutăm la 7 pentru a începe cu Luni
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
            const isPast =
              year < currentDate.getFullYear() ||
              (year === currentDate.getFullYear() &&
                month < currentDate.getMonth()) ||
              (year === currentDate.getFullYear() &&
                month === currentDate.getMonth() &&
                day < currentDate.getDate());

            return (
              <div
                key={i}
                className={`calendar-day ${
                  isPast ? "inactive" : ""
                } ${selectedDate === `${year}-${month + 1}-${day}` ? "selected" : ""}`}
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

  useEffect(() => {
    if (selectedDate) {
      const now = new Date();
      const currentHour = now.getHours();
      const nowDateString = now.toLocaleDateString("en-CA"); // Extrage doar partea de dată în format YYYY-MM-DD
      const isToday = selectedDate.toString() === nowDateString;

      if (isToday && currentHour >= 18) {
        setShowTimePicker(false);
        setWarningMessage("You can no longer book a desk for today.");
        setShowPopup(true);
        setSelectedDate(null);
      } else {
        setShowTimePicker(true);
        setWarningMessage("");
        setShowPopup(false);
      }
    }
  }, [selectedDate, warningMessage, showTimePicker]);

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 4000); // Dispare după 4 secunde
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const TimePicker = ({ selectedDate }: { selectedDate: Date }) => {
    const [selectedTime, setSelectedTime] = useState<{ from: string; to: string }>({ from: "", to: "" });
    const [availableFromHours, setAvailableFromHours] = useState<string[]>([]);
    const [availableToHours, setAvailableToHours] = useState<string[]>([]);

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
      console.log("now", now.toDateString());
      console.log("selectedDate", selectedDate.toDateString());
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

    const isButtonDisabled = !selectedTime.from || !selectedTime.to;

    return (
      <div className="time-picker">
        <h4>Select time for {selectedDate.toDateString()}</h4>
        <label>
          From:
          <select
            value={selectedTime.from}
            onChange={(e) => setSelectedTime({ ...selectedTime, from: e.target.value })}
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
            onChange={(e) => setSelectedTime({ ...selectedTime, to: e.target.value })}
          >
            <option value="">Select time</option>
            {availableToHours.map(hour => (
              <option key={hour} value={hour}>{hour}</option>
            ))}
          </select>
        </label>
        <button
          className={`button__timepicker ${isButtonDisabled ? "disabled" : ""}`}
          disabled={isButtonDisabled}>
          Search
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="bookDesk">
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
                    setSelectedLocation(""); // Reset location when country changes
                  }}
                />
              </div>
              <div className="bookDesk__type">
                <div className="name">Location</div>
                <Dropdown
                  options={locations[selectedCountry] || []}
                  selectedOption={selectedLocation}
                  onOptionSelect={setSelectedLocation}
                  disabled={!selectedCountry}
                />
              </div>
            </div>
          </div>
          <div className="bookDesk__bottom">
            <Calendar />
            {selectedDate && (
              <div className="bookDesk__right">
                {showTimePicker && selectedDate && <TimePicker selectedDate={new Date(selectedDate)} />}
              </div>
            )}
            {showPopup && (
              <div className="popup">
                <p>{warningMessage}</p>
                <div className="progress-bar">
                  <div className="progress"></div>
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
