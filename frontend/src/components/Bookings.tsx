import React, { useState, useEffect } from "react";
import { fetchBookingsByEmployee } from "../utils/api";

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const idEmployee = localStorage.getItem('idEmployee');
      if (idEmployee) {
        const bookings = await fetchBookingsByEmployee(Number(idEmployee));
        setBookings(bookings);
      }
    };

    fetchBookings();
    console.log(bookings);
  }, []);

  return (
    <div className="bookings">
      <div className="bookings__title">Your Bookings</div>
      <div className="bookings__information">
        <div className="bookings__line">
          <span className="bookings__information1">Desk</span>
          <span className="bookings__information2">Location</span>
          <span className="bookings__information1">Date</span>
          <span className="bookings__information1">From</span>
          <span className="bookings__information1">To</span>
          <span className="bookings__information1">Actions</span>
        </div>
        <div className="bookings__table">
          {bookings.map((booking, index) => (
            <div
              className={`bookings__row ${index % 2 === 0 ? "even" : "odd"}`}
              key={booking.id}
            >
              <span className="bookings__cell1">{booking.desk}</span>
              <span className="bookings__cell2">{booking.location}</span>
              <span className="bookings__cell3">{booking.date}</span>
              <span className="bookings__cell4">{booking.from}</span>
              <span className="bookings__cell4">{booking.to}</span>
              <span className="bookings__cell4">
                <button className="edit">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 55 55"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.4583 48.125C10.1979 48.125 9.11892 47.6762 8.22135 46.7786C7.32378 45.8811 6.875 44.8021 6.875 43.5417V11.4583C6.875 10.1979 7.32378 9.11892 8.22135 8.22135C9.11892 7.32378 10.1979 6.875 11.4583 6.875H31.9115L27.3281 11.4583H11.4583V43.5417H43.5417V27.6146L48.125 23.0312V43.5417C48.125 44.8021 47.6762 45.8811 46.7786 46.7786C45.8811 47.6762 44.8021 48.125 43.5417 48.125H11.4583ZM20.625 34.375V24.6354L41.651 3.60938C42.1094 3.15104 42.625 2.80729 43.1979 2.57812C43.7708 2.34896 44.3438 2.23438 44.9167 2.23438C45.5278 2.23438 46.1102 2.34896 46.6641 2.57812C47.2179 2.80729 47.724 3.15104 48.1823 3.60938L51.3906 6.875C51.8108 7.33333 52.1354 7.83941 52.3646 8.39323C52.5937 8.94705 52.7083 9.51042 52.7083 10.0833C52.7083 10.6562 52.6033 11.2196 52.3932 11.7734C52.1832 12.3273 51.849 12.8333 51.3906 13.2917L30.3646 34.375H20.625ZM25.2083 29.7917H28.4167L41.7083 16.5L40.1042 14.8958L38.4427 13.2917L25.2083 26.526V29.7917Z"
                      fill="#1F4593"
                    />
                  </svg>
                </button>
                <button className="delete">
                  <svg
                    width="33"
                    height="33"
                    viewBox="0 0 55 55"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.0415 48.125C14.7811 48.125 13.7021 47.6762 12.8045 46.7786C11.907 45.8811 11.4582 44.8021 11.4582 43.5417V13.75H9.1665V9.16667H20.6248V6.875H34.3748V9.16667H45.8332V13.75H43.5415V43.5417C43.5415 44.8021 43.0927 45.8811 42.1952 46.7786C41.2976 47.6762 40.2186 48.125 38.9582 48.125H16.0415ZM38.9582 13.75H16.0415V43.5417H38.9582V13.75ZM20.6248 38.9583H25.2082V18.3333H20.6248V38.9583ZM29.7915 38.9583H34.3748V18.3333H29.7915V38.9583Z"
                      fill="#FF0E12"
                    />
                  </svg>
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bookings;
