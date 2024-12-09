import React, { useState } from "react";

const BookDesk: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState("Romania");
  const [selectedLocation, setSelectedLocation] = useState("Bucharest");

  const countries = ["Romania", "Germany", "Italy"];
  const locations = ["Bucharest", "Cluj-Napoca", "Timișoara", "Iași"];

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

  return (
    <>
      <div className="bookDesk">
        <div className="bookDesk__title">Book a Desk</div>
        <div className="bookDesk__page">
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
        </div>
      </div>
    </>
  );
};

export default BookDesk;
