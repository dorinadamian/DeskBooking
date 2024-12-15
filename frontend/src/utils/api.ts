import axios from 'axios';

export const fetchEmployeeName = async (employeeId: number) => {
  try {
    const response = await axios.get(`http://localhost:5000/employees/${employeeId}`);
    const employee = response.data;
    const initials = `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`;
    return {
      firstName: employee.firstName,
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