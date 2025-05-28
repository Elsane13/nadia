
import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

// Create Authentication Context
const AuthContext = createContext();

// Mock user data - In a real app, this would come from your backend
const MOCK_USERS = [
  { 
    id: 1, 
    email: 'admin@example.com', 
    password: 'admin123', 
    name: 'Admin User',
    role: 'admin',
    position: 'HR Director'
  },
  { 
    id: 2, 
    email: 'employee@example.com', 
    password: 'employee123', 
    name: 'John Employee',
    role: 'employee',
    position: 'Software Developer'
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user data', error);
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Find user by email and password
    const matchedUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (matchedUser) {
      // Remove password from user object before storing
      const { password, ...userWithoutPassword } = matchedUser;
      
      // Store user in state and localStorage
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      toast.success(`Welcome back, ${userWithoutPassword.name}!`);
      return true;
    } else {
      toast.error('Invalid email or password');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.info('You have been logged out');
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
