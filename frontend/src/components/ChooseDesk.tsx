import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ChooseDesk: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCell, setSelectedCell] = useState<number | null>(null);

  const handlePath = () => {
    navigate("/bookdesk");
  };

  const handleDotClick = (cellIndex: number) => {
    setSelectedCell(cellIndex);
  };

//   const closeModal = () => {
//     setSelectedCell(null);
//   };


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
        <div className="office-desk">
          {[...Array(5)].map((_, rowIndex) => (
            <div key={rowIndex} className="desk-row">
              {[...Array(2)].map((_, colIndex) => {
                const cellIndex = 100 + rowIndex * 2 + colIndex;
                return (
                  <div key={colIndex} className="desk-cell">
                    <div
                      className="dot"
                      onClick={() => handleDotClick(cellIndex)}
                    ></div>
                    <span className="desk-number">{cellIndex}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="office-desk">
          {[...Array(5)].map((_, rowIndex) => (
            <div key={rowIndex} className="desk-row">
              {[...Array(2)].map((_, colIndex) => {
                const cellIndex = 110 + rowIndex * 2 + colIndex;
                return (
                  <div key={colIndex} className="desk-cell">
                    <div
                      className="dot"
                      onClick={() => handleDotClick(cellIndex)}
                    ></div>
                    <span className="desk-number">{cellIndex}</span>
                  </div>
                );
              })}
            </div>
          ))}

          {/* {selectedCell !== null && (
            <div className="modal">
              <div className="modal-content">
                <h3>Cell {selectedCell} Details</h3>
                <p>You clicked on cell {selectedCell}.</p>
                <button onClick={closeModal}>Close</button>
              </div>
            </div>
          )} */}
        </div>

        <div className="office-desk">
          {[...Array(5)].map((_, rowIndex) => (
            <div key={rowIndex} className="desk-row">
              {[...Array(2)].map((_, colIndex) => {
                const cellIndex = 120 + rowIndex * 2 + colIndex;
                return (
                  <div key={colIndex} className="desk-cell">
                    <div
                      className="dot"
                      onClick={() => handleDotClick(cellIndex)}
                    ></div>
                    <span className="desk-number">{cellIndex}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="office-desk">
          {[...Array(5)].map((_, rowIndex) => (
            <div key={rowIndex} className="desk-row">
              {[...Array(2)].map((_, colIndex) => {
                const cellIndex = 130 + rowIndex * 2 + colIndex;
                return (
                  <div key={colIndex} className="desk-cell">
                    <div
                      className="dot"
                      onClick={() => handleDotClick(cellIndex)}
                    ></div>
                    <span className="desk-number">{cellIndex}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChooseDesk;
