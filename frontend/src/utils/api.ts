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