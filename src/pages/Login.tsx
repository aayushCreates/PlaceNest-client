import React, { useState } from "react";
import {
  FaBuilding,
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { FiCheck, FiInfo } from "react-icons/fi";
import type { LoginFormType } from "../types/auth.types";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormType>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((pre) => ({
      ...pre,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    try {
      await login(formData);
    } catch (err) {
      toast.error("Error in login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 overflow-hidden">
      {/* Left side: Branding (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 relative overflow-hidden items-center justify-center p-12 text-white">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full -z-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-900 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-800">
              <span className="text-blue-600 font-black text-2xl">P</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">PlaceNest</h1>
          </div>
          <h2 className="text-5xl font-extrabold mb-6 leading-tight">
            Log in to Your <br /> Future Career
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Access your personalized dashboard, track applications, and engage with top recruiters on our official college platform.
          </p>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/30 flex items-center justify-center border border-white/20">
                <FiCheck className="text-xl" />
              </div>
              <span className="text-lg font-medium">Manage Professional Profile</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/30 flex items-center justify-center border border-white/20">
                <FiCheck className="text-xl" />
              </div>
              <span className="text-lg font-medium">Real-time Placement Updates</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/30 flex items-center justify-center border border-white/20">
                <FiCheck className="text-xl" />
              </div>
              <span className="text-lg font-medium">AI Career Assistance Access</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo (Mobile Only) */}
          <div className="lg:hidden flex items-center justify-center space-x-2 mb-10">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
               <span className="text-white font-black text-xl">P</span>
             </div>
             <h1 className="text-2xl font-bold">PlaceNest</h1>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200 border border-gray-100 p-8 lg:p-10">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-500 font-medium">Enter your credentials to access your account.</p>
            </div>

            {/* Info Box */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-50 border border-blue-100 mb-8 text-blue-700 text-sm font-medium">
              <FiInfo className="shrink-0 text-lg" />
              <p>Official College Placement Portal access only.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <FaEnvelope />
                  </div>
                  <input
                    name="email"
                    value={formData.email}
                    type="email"
                    onChange={handleChange}
                    placeholder="Enter your university email"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-medium text-gray-800"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="relative">
                <div className="flex justify-between items-center mb-1.5 ml-1">
                  <label className="block text-sm font-bold text-gray-700">Password</label>
                  <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">Forgot Password?</button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <FaLock />
                  </div>
                  <input
                    name="password"
                    value={formData.password}
                    type={showPassword ? "text" : "password"}
                    onChange={handleChange}
                    placeholder="Enter your secure password"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-11 pr-12 py-3.5 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-medium text-gray-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-500 transition-colors cursor-pointer"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-4 font-bold text-lg shadow-xl shadow-blue-100 transition-all transform flex items-center justify-center cursor-pointer group ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1'}`}
              >
                {isLoading ? (
                  <>Logging In...</>
                ) : (
                  <>Log In Now <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-gray-500 font-medium">
                New to our portal?{" "}
                <button 
                  onClick={() => navigate('/register')} 
                  className="text-blue-600 hover:underline cursor-pointer font-bold"
                >
                  Create an account
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
