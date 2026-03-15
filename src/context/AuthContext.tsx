import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type {
  LoginFormType,
  RegisterFormType
} from "../types/auth.types";
import axios from "axios";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";


type AuthContextTypes = {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  isAuthenticated: boolean;
  loading: boolean;
  login: (loginDetails: LoginFormType) => void;
  register: (registerDetails: RegisterFormType) => void;
  logout: () => void;
};

type JwtDecode = { exp: number };

const AuthContext = createContext<AuthContextTypes | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (authToken: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/profile`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      // If profile fetch fails (e.g. invalid token), we might want to logout
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      const decoded = jwtDecode<JwtDecode>(savedToken);
      const isExpired = decoded.exp * 1000 < Date.now();

      if (isExpired) {
        setIsAuthenticated(false);
        localStorage.removeItem("token");
        localStorage.removeItem("auth");
        setLoading(false);
      } else {
        setIsAuthenticated(true);
        setToken(savedToken);
        // Fetch full profile from backend on app load
        fetchProfile(savedToken);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (loginFormData: LoginFormType) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}/auth/login`,
        loginFormData
      );

      if (response.data.success) {
        setToken(response.data.token);
        setIsAuthenticated(true);
        localStorage.setItem("token", response.data.token);
        
        // After login, fetch the full profile to populate context
        await fetchProfile(response.data.token);
        
        toast.success(response.data.message);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        toast.error(err.response.data?.message || "Registration failed");
      } else {
        toast.error("Error in user login");
      }
    }
  };

  const register = async (registerFormData: RegisterFormType) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}/auth/register`,
        registerFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setToken(response.data.token);
        setIsAuthenticated(true);
        localStorage.setItem("token", response.data.token);

        // Fetch full profile after registration
        await fetchProfile(response.data.token);
        
        toast.success(response.data.message);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        toast.error(err.response.data?.message || "Registration failed");
      } else {
        toast.error("Error in user register");
      }
    }
  };

  const logout = async () => {
    try {
      setIsAuthenticated(false);
      setToken("");
      setUser(null);
      localStorage.removeItem("auth");
      localStorage.removeItem("token");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        toast.error(err.response.data?.message || "logout failed");
      } else {
        toast.error("Error in user logout");
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        register,
        logout,
        isAuthenticated,
        user,
        setUser,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
