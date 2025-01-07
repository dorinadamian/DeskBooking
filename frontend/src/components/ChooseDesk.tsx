import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDesksByLocation, fetchLocationId } from "../utils/api";

const ChooseDesk: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [desks, setDesks] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState(localStorage.getItem('selectedCountry') || "");
  const [selectedLocation, setSelectedLocation] = useState(localStorage.getItem('selectedLocation') || "");

  const handlePath = () => {
    navigate("/bookdesk");
  };

  const handleDotClick = (cellIndex: number) => {
    setSelectedCell(cellIndex);
  };

  useEffect(() => {
    const fetchDesks = async () => {
      if (selectedCountry && selectedLocation) {
        const locationId = await fetchLocationId(selectedCountry, selectedLocation);
        console.log(locationId);
        if (locationId) {
          const desks = await fetchDesksByLocation(locationId);
          setDesks(desks);
        }
      }
    };

    fetchDesks();
  }, [selectedCountry, selectedLocation]);

  // Împarte birourile în grupuri de câte 10
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
          <div className="office-desk">
            {[...Array(5)].map((_, rowIndex) => (
              <div key={rowIndex} className="desk-row">
                {[...Array(2)].map((_, colIndex) => {
                  const deskIndex = rowIndex + colIndex * 5;
                  const desk = group[deskIndex];
                  console.log("desks", desks);
                  return (
                    <div key={colIndex} className="desk-cell">
                      {desk && (
                        <>
                          <div
                            className="dot"
                            onClick={() => handleDotClick(desk.idDesk)}
                          ></div>
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
    </div>
  );
};

export default ChooseDesk;
