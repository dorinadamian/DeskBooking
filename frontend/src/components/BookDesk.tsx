import React, { useState } from "react";

const BookDesk: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState("Romania");
  const [selectedLocation, setSelectedLocation] = useState("Bucharest");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<{
    from: string;
    to: string;
  }>({ from: "", to: "" });

  const countries = ["Romania", "Italy"];
  const locations = ["Bucharest", "Timișoara", "Iași"];

  const Dropdown = ({
    options,
    selectedOption,
    onOptionSelect,
  }: {
    options: string[];
    selectedOption: string;
    onOptionSelect: (option: string) => void;
  }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const selectOption = (option: string) => {
      onOptionSelect(option);
      setIsOpen(false);
    };

    return (
      <div className="dropdown">
        <div className="dropdown-header" onClick={toggleDropdown}>
          {selectedOption}
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
  

  // const TimePicker = () => {
  //   const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  //   return (
  //     <div className="time-picker">
  //       <h4>Select time for {selectedDate}</h4>
  //       <label >
  //         From:
  //         <select
  //           value={selectedTime.from}
  //           onChange={(e) =>
  //             setSelectedTime({ ...selectedTime, from: e.target.value })
  //           }
  //         >
  //           <option value="">Select time</option>
  //           {hours.map((hour) => (
  //             <option key={hour} value={hour}>
  //               {hour}
  //             </option>
  //           ))}
  //         </select>
  //       </label>
  //       <label>
  //         To:
  //         <select
  //           value={selectedTime.to}
  //           onChange={(e) =>
  //             setSelectedTime({ ...selectedTime, to: e.target.value })
  //           }
  //         >
  //           <option value="">Select time</option>
  //           {hours.map((hour) => (
  //             <option key={hour} value={hour}>
  //               {hour}
  //             </option>
  //           ))}
  //         </select>
  //       </label>

  //       <button className="button__timepicker">Search</button>
  //     </div>
  //   );
  // };

  const TimePicker = () => {
    const [selectedTime, setSelectedTime] = useState<{ from: string; to: string }>(
      { from: "", to: "" }
    );
  
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  
    const isButtonDisabled = !selectedTime.from || !selectedTime.to;
  
    return (
      <div className="time-picker">
        <h4>Select time for {selectedDate}</h4>
        <label>
          From:
          <select
            className="time-picker-select from"
            value={selectedTime.from}
            onChange={(e) =>
              setSelectedTime({ ...selectedTime, from: e.target.value })
            }
          >
            <option value="">Select time</option>
            {hours.map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </select>
        </label>
        <label>
          To:
          <select
            className="time-picker-select to"
            value={selectedTime.to}
            onChange={(e) =>
              setSelectedTime({ ...selectedTime, to: e.target.value })
            }
          >
            <option value="">Select time</option>
            {hours.map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </select>
        </label>
  
        <button
          className={`button__timepicker ${isButtonDisabled ? "disabled" : ""}`}
          disabled={isButtonDisabled}
        >
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
          <div className="bookDesk__left">
            <div className="bookDesk__choose">
              <div className="bookDesk__type">
                <div className="name">Country</div>
                <Dropdown
                  options={countries}
                  selectedOption={selectedCountry}
                  onOptionSelect={setSelectedCountry}
                />
              </div>
              <div className="bookDesk__type">
                <div className="name">Location</div>
                <Dropdown
                  options={locations}
                  selectedOption={selectedLocation}
                  onOptionSelect={setSelectedLocation}
                />
              </div>
            </div>
            <Calendar />
          </div>

          {selectedDate && (
            <div className="bookDesk__right">
              <TimePicker />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BookDesk;
