// 1. THE LOGIN FUNCTION (Fix this one)
const login = async (email, password) => {
  // Use the full URL here so Vercel doesn't say "undefined"
  const response = await axios.post('https://digital-badge-system.onrender.com/api/auth/login', { 
    email, 
    password 
  });
  
  if (response.data.user) {
    setUser(response.data.user);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

// 2. THE LOGOUT FUNCTION (Clean this one)
const logout = () => {
  // REMOVE the axios.post line from here if you added it earlier!
  setUser(null);
  localStorage.removeItem('user');
};
  }
};