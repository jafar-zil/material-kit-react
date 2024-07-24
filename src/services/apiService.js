const BASE_URL = 'https://cashflow.botire.in';

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
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  }).then(handleResponse);
  
export const registerUser = (data) =>
  fetch(`${BASE_URL}/api/register`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(handleResponse);

  export const logoutUser = () => {
    const token = localStorage.getItem('authToken');
    return fetch(`${BASE_URL}/api/logout`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).then(handleResponse);
  };

export const fetchItems = () => {
  const token = localStorage.getItem('authToken');
  return fetch(`${BASE_URL}/api/item`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Dynamically retrieve the token
    },
  }).then(handleResponse);
};

export const addItem = (name, type) => {
  const token = localStorage.getItem('authToken');
  return fetch(`${BASE_URL}/api/item`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, type }),
  }).then(handleResponse);
};

export const editItem = (id, name, type) => {
  const token = localStorage.getItem('authToken');
  return fetch(`${BASE_URL}/api/item/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, type }),
  }).then(handleResponse);
};

export const deleteItem = (id) => {
  const token = localStorage.getItem('authToken');
  return fetch(`${BASE_URL}/api/item/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: null,
  }).then(handleResponse);
};

export const fetchIncomes = (payload) => {
  const token = localStorage.getItem('authToken');
  return fetch(`${BASE_URL}/api/datatable/income`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  }).then(handleResponse);
};

export const addIncome = (incomeData) => {
  const token = localStorage.getItem('authToken');
  return fetch(`${BASE_URL}/api/income`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(incomeData),
  }).then(handleResponse);
};

export const editIncome = (id, incomeData) => {
  const token = localStorage.getItem('authToken');
  return fetch(`${BASE_URL}/api/income/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(incomeData),
  }).then(handleResponse)
};

export const deleteIncome = (id) => {
  const token = localStorage.getItem('authToken');
  return fetch(`${BASE_URL}/api/income/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: null,
  }).then(handleResponse)
};

export const fetchExpenses = (payload) => {
  const token = localStorage.getItem('authToken');
  return fetch(`${BASE_URL}/api/datatable/expense`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  }).then(handleResponse);
};

export const addExpense = (expenseData) => {
  const token = localStorage.getItem('authToken');
  return fetch(`${BASE_URL}/api/expense`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(expenseData),
  }).then(handleResponse);
};

export const editExpense = (id, expenseData) => {
  const token = localStorage.getItem('authToken');
  return fetch(`${BASE_URL}/api/expense/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(expenseData),
  }).then(handleResponse)
};

export const deleteExpense = (id) => {
  const token = localStorage.getItem('authToken');
  return fetch(`${BASE_URL}/api/expense/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: null,
  }).then(handleResponse)
};