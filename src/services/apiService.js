const BASE_URL = "https://cashflow.botire.in";
const token = localStorage.getItem('authToken');

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

  export const fetchItems = () =>
    fetch(`${BASE_URL}/api/item`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    }).then(handleResponse);

    export const addItem = (name, type) =>
    fetch(`${BASE_URL}/api/item`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, type }),
    }).then(handleResponse);

    export const editItem = (id, name, type) =>
    fetch(`${BASE_URL}/api/item/${id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, type }),
    }).then(handleResponse);


    export const deleteItem = (id) =>
    fetch(`${BASE_URL}/api/item/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: null,
    }).then(handleResponse);
