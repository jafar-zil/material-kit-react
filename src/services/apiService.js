const BASE_URL = "https://cashflow.botire.in";

const handleResponse = async (response) => {
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'An error occurred');
    }
    return response.json();
  };
  
  export const loginUser = (email, password) =>
    fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    }).then(handleResponse);
