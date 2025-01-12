import axios from 'axios';

export const fetchEmployeeName = async (employeeId: number) => {
  try {
    const response = await axios.get(`http://localhost:5000/employees/${employeeId}/details`);
    const employee = response.data;
    const initials = `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`;
    return {
      firstName: employee.firstName,
      lastName: employee.lastName,
      department: employee.department,
      role: employee.role,
      manager: employee.manager,
      initials: initials
    };
  } catch (error) {
    console.error("Error fetching employee data:", error);
    return {
      firstName: "",
      initials: ""
    };
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post('http://localhost:5000/login', { email, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Login failed");
    } else {
      throw new Error("Login failed");
    }
  }
};

export const fetchCountries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/locations/countries');
      return response.data;
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
};

export const fetchLocations = async () => {
  try {
    const response = await axios.get("http://localhost:5000/locations");
    const locations = response.data;
    const locationsByCountry = locations.reduce((acc: { [key: string]: string[] }, location: { country: string, city: string }) => {
      if (!acc[location.country]) {
        acc[location.country] = [];
      }
      acc[location.country].push(location.city);
      return acc;
    }, {});
    return locationsByCountry;
  } catch (error) {
    console.error("Error fetching locations:", error);
    return {};
  }
};

export const fetchLocationId = async (country: string, city: string) => {
  try {
    const response = await axios.get(`http://localhost:5000/locations/id`, {
      params: { country, city }
    });
    return response.data.idLocation;
  } catch (error) {
    console.error("Error fetching location ID:", error);
    return null;
  }
};

export const fetchBookingsByEmployee = async (employeeId: number) => {
  try {
    const response = await axios.get(`http://localhost:5000/bookings/employee/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
};

export const fetchDesksByLocation = async (locationId: number) => {
  try {
    const response = await axios.get(`http://localhost:5000/desks/location/${locationId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching desks:", error);
    return [];
  }
};

export const fetchReservations = async (bookingDate: string, startTime: string, endTime: string, locationId: number) => {
  try {
    const response = await axios.get(`http://localhost:5000/bookings/filter`, {
      params: { bookingDate, startTime, endTime, locationId }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return [];
  }
};

export const checkBookingOverlap = async (employeeId: number, bookingDate: string, startTime: string, endTime: string, locationId: number) => {
  try {
    const response = await axios.get('http://localhost:5000/bookings/check-overlap', {
      params: { employeeId, bookingDate, startTime, endTime, locationId }
    });
    return response.data;
  } catch (error) {
    console.error("Error checking booking overlap:", error);
    return { overlap: false };
  }
};

export const updateBooking = async (bookingId: number, bookingDate: string, startTime: string, endTime: string, deskId: number) => {
  try {
    const response = await axios.put(`http://localhost:5000/bookings/${bookingId}`, {
      bookingDate,
      startTime,
      endTime,
      deskId
    });
    return response.data;
  } catch (error) {
    console.error("Error updating booking:", error);
    return null;
  }
};

export const deleteBooking = async (bookingId: number) => {
  try {
    const response = await axios.delete(`http://localhost:5000/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting booking:", error);
    return null;
  }
};