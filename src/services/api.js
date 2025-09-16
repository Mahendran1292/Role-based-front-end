const API_BASE_URL = 'http://localhost:8080';

export const getAuthToken = () => localStorage.getItem('token');

export const getUserRole = () => localStorage.getItem('role');

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const register = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/user/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await response.json();

  return { response, data };
};

export const login = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();

  console.log("Login API response:", data);

  if (response.ok && data.data?.token) {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('userId', data.data.id);
    localStorage.setItem('role', credentials.role);
  }

  return { response, data };
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('role');
};

export const isLoggedIn = () => !!getAuthToken();

export const getUserProfile = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Profile fetch error:', error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Users fetch error:', error);
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/me`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update profile: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
};

export const uploadProfilePicture = async (file) => {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/profile-picture/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  return response.json();
};
