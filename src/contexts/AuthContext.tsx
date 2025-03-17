
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

interface User {
  username: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Set default auth header for all requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          // Validate token and get user info
          // For now we'll just simulate user data since we can't call the backend yet
          setUser({
            username: 'admin',
            roles: ['ADMIN']
          });
          setToken(storedToken);
        } catch (error) {
          console.error('Failed to validate token:', error);
          localStorage.removeItem('token');
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username,
        password
      });
      
      const { token } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // For now we'll just simulate the user data
      setUser({
        username,
        roles: ['ADMIN'] // This would come from the JWT in a real implementation
      });
      setToken(token);
      navigate('/dashboard');
      toast.success('Login successful!');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials and try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
    navigate('/login');
    toast.info('You have been logged out.');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isLoading, 
      login, 
      logout,
      isAuthenticated: !!token 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
