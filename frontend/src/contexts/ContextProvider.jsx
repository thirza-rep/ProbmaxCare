import { createContext, useContext, useState, useEffect } from "react";

const StateContext = createContext({
  user: null,
  token: null,
  notification: null,
  setUser: () => { },
  setToken: () => { },
  setNotification: () => { }
})

export const ContextProvider = ({ children }) => {
  // Initialize user from localStorage if available
  const [user, _setUser] = useState(() => {
    const savedUser = localStorage.getItem('USER_DATA');
    try {
      return savedUser ? JSON.parse(savedUser) : {};
    } catch (e) {
      console.error('Error parsing saved user data:', e);
      return {};
    }
  });

  const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
  const [notification, _setNotification] = useState('');

  // Wrapper to save user to localStorage
  const setUser = (user) => {
    _setUser(user);
    if (user && Object.keys(user).length > 0) {
      localStorage.setItem('USER_DATA', JSON.stringify(user));
      console.log('User data saved to localStorage:', user);
    } else {
      localStorage.removeItem('USER_DATA');
      console.log('User data cleared from localStorage');
    }
  }

  const setToken = (token) => {
    _setToken(token)
    if (token) {
      localStorage.setItem('ACCESS_TOKEN', token);
      console.log('Token saved to localStorage');
    } else {
      localStorage.removeItem('ACCESS_TOKEN');
      localStorage.removeItem('USER_DATA'); // Clear user data when token is cleared
      console.log('Token and user data cleared from localStorage');
    }
  }

  const setNotification = (message) => {
    _setNotification(message);

    setTimeout(() => {
      _setNotification('')
    }, 5000)
  }

  return (
    <StateContext.Provider value={{
      user,
      setUser,
      token,
      setToken,
      notification,
      setNotification
    }}>
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);

