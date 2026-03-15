import React, { useState } from "react";
import {
  FaUserGraduate,
  FaBuilding,
  FaUserShield,
  FaEnvelope,
  FaLock,
  FaInfoCircle,
  FaPhoneAlt,
  FaUserAlt,
  FaGlobe,
  FaLinkedin,
  FaFileUpload,
} from "react-icons/fa";
import { toast } from "sonner";
import type { RegisterFormType, Role } from "../types/auth.types";
import { useAuth } from "../context/AuthContext";
import { FiArrowLeft, FiArrowRight, FiCheck } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [role, setRole] = useState<Role>("STUDENT");
  const [currStep, setCurrStep] = useState<number>(1);
  const [hasBacklogs, setHasBacklogs] = useState<boolean>(false);
  const navigate = useNavigate();

  const { register } = useAuth();

  const [formData, setFormData] = useState<RegisterFormType>({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "STUDENT",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    let val: any = value;

    if (type === "number") {
      if (value === "") {
        val = undefined;
      } else {
        val = Number(value);
      }
    }
    if (type === "checkbox") {
      val = (e.target as HTMLInputElement).checked;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleNext = () => {
    const { name, email, phone, password } = formData;
    if (!name || !email || !phone || !password) {
      toast.error("Please fill in all account details");
      return;
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    setCurrStep(2);
  };

  const handleSubmit = async () => {
    const error = validateForm(formData, role);

    if (error) {
      toast.error(error);
      return;
    }

    try {
      register(formData);
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Error in registration");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 overflow-hidden">
      {/* Left side: Branding (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 relative overflow-hidden items-center justify-center p-12 text-white">
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
            The Hub of <br /> Campus Careers
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Join the official college placement platform and take the first step towards your dream career. Empowered by AI, built for our community.
          </p>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/30 flex items-center justify-center border border-white/20">
                <FiCheck className="text-xl" />
              </div>
              <span className="text-lg font-medium">AI-Powered Resume Optimization</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/30 flex items-center justify-center border border-white/20">
                <FiCheck className="text-xl" />
              </div>
              <span className="text-lg font-medium">Real-time Drive Notifications</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/30 flex items-center justify-center border border-white/20">
                <FiCheck className="text-xl" />
              </div>
              <span className="text-lg font-medium">Direct Recruiter Interaction</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 overflow-y-auto max-h-screen">
        <div className="w-full max-w-xl">
          {/* Logo (Mobile Only) */}
          <div className="lg:hidden flex items-center justify-center space-x-2 mb-8">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
               <span className="text-white font-black text-xl">P</span>
             </div>
             <h1 className="text-2xl font-bold">PlaceNest</h1>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200 border border-gray-100 p-8 lg:p-10 relative">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-4 mb-10">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all duration-300 border-2 ${currStep >= 1 ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>1</div>
              <div className={`h-1 w-12 rounded-full transition-all duration-300 ${currStep >= 2 ? 'bg-blue-600' : 'bg-gray-100'}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all duration-300 border-2 ${currStep >= 2 ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>2</div>
            </div>

            {currStep === 1 ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                  <p className="text-gray-500 font-medium">Fill in your basic information to get started.</p>
                </div>

                {/* Role Selection Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: "STUDENT", label: "Student", icon: <FaUserGraduate /> },
                    { id: "COMPANY", label: "Recruiter", icon: <FaBuilding /> },
                    { id: "COORDINATOR", label: "TPO Office", icon: <FaUserShield /> },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setRole(r.id as Role);
                        setFormData((prev) => ({ ...prev, role: r.id as Role }));
                      }}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        role === r.id
                          ? "border-blue-600 bg-blue-50/50 text-blue-600 shadow-sm"
                          : "border-gray-100 bg-gray-50 hover:bg-white hover:border-blue-200 text-gray-500"
                      }`}
                    >
                      <div className="text-2xl mb-2">{r.icon}</div>
                      <span className="text-xs font-bold uppercase tracking-wider">{r.label}</span>
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Full Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                        <FaUserAlt />
                      </div>
                      <input
                        name="name"
                        value={formData.name}
                        type="text"
                        onChange={handleChange}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-medium text-gray-800"
                      />
                    </div>
                  </div>

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
                        placeholder="name@university.edu"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-medium text-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Phone Number</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                        <FaPhoneAlt />
                      </div>
                      <input
                        name="phone"
                        value={formData.phone}
                        type="text"
                        onChange={handleChange}
                        maxLength={10}
                        placeholder="10-digit mobile number"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-medium text-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                        <FaLock />
                      </div>
                      <input
                        name="password"
                        value={formData.password}
                        type="password"
                        onChange={handleChange}
                        placeholder="Choose a strong password"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-medium text-gray-800"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-4 font-bold text-lg shadow-xl shadow-blue-100 transition-all transform hover:-translate-y-1 flex items-center justify-center cursor-pointer"
                >
                  Continue Profile Setup <FiArrowRight className="ml-2" />
                </button>

                <p className="text-center text-gray-500 font-medium pt-2">
                  Already on PlaceNest?{" "}
                  <button onClick={() => navigate('/login')} className="text-blue-600 hover:underline cursor-pointer font-bold">
                    Login here
                  </button>
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <button
                    type="button"
                    onClick={() => setCurrStep(1)}
                    className="flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors mb-4 cursor-pointer"
                  >
                    <FiArrowLeft className="mr-1" /> Back to details
                  </button>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Profile</h2>
                  <p className="text-gray-500 font-medium">Add {role === 'COMPANY' ? 'company' : 'student'} specifics to finish registration.</p>
                </div>

                <div className="space-y-5">
                  {(role === "STUDENT" || role === "COORDINATOR") && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Branch</label>
                        <select
                          name="branch"
                          value={formData.branch ?? ""}
                          onChange={handleChange}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-gray-800"
                        >
                          <option value="">Select branch</option>
                          <option value="CSE">CSE</option>
                          <option value="IT">IT</option>
                          <option value="CY">CY</option>
                          <option value="EE">EE</option>
                          <option value="ME">ME</option>
                          <option value="EIC">EIC</option>
                          <option value="CE">CE</option>
                          <option value="ECE">ECE</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Year</label>
                        <select
                          name="year"
                          value={formData.year ?? ""}
                          onChange={handleChange}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-gray-800"
                        >
                          <option value="">Select year</option>
                          <option value="FIRST">First Year</option>
                          <option value="SECOND">Second Year</option>
                          <option value="THIRD">Third Year</option>
                          <option value="FOURTH">Fourth Year</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {(role === "STUDENT" || role === "COORDINATOR") && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Current CGPA</label>
                        <input
                          name="cgpa"
                          value={formData.cgpa ?? ""}
                          type="number"
                          step="0.01"
                          onChange={handleChange}
                          placeholder="0.00 to 10.00"
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Backlogs</label>
                        <input
                          name="backlogs"
                          value={formData.backlogs ?? ""}
                          type="number"
                          onChange={handleChange}
                          placeholder="Number of backlogs"
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-gray-800"
                        />
                      </div>
                    </div>
                  )}

                  {(role === "STUDENT" || role === "COORDINATOR") && (
                    <label className="flex items-center space-x-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={hasBacklogs}
                        onChange={(e) => {
                          setHasBacklogs(e.target.checked);
                          setFormData((prev) => ({
                            ...prev,
                            activeBacklogs: e.target.checked,
                          }));
                        }}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-bold text-gray-600">I currently have active backlogs</span>
                    </label>
                  )}

                  {role === "COMPANY" && (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Industry</label>
                        <div className="relative group">
                           <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                             <FiBriefcase />
                           </div>
                           <input
                            name="industry"
                            value={formData.industry ?? ""}
                            onChange={handleChange}
                            type="text"
                            placeholder="e.g. Technology, Finance, EdTech"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-gray-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Company Description</label>
                        <textarea
                          name="companyDescription"
                          value={formData.companyDescription ?? ""}
                          onChange={handleChange}
                          placeholder="Write a brief overview of your company..."
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-gray-800 min-h-[100px]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Website URL</label>
                            <div className="relative group">
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                <FaGlobe />
                              </div>
                              <input
                                name="website"
                                value={formData.website ?? ""}
                                onChange={handleChange}
                                type="url"
                                placeholder="https://..."
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-gray-800"
                              />
                            </div>
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Founded Year</label>
                            <input
                              name="foundedYear"
                              value={formData.foundedYear ?? ""}
                              onChange={handleChange}
                              type="text"
                              placeholder="e.g. 2010"
                              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-gray-800"
                            />
                         </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">LinkedIn Profile URL</label>
                    <div className="relative group">
                       <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                         <FaLinkedin />
                       </div>
                       <input
                        name="linkedinUrl"
                        value={formData.linkedinUrl ?? ""}
                        onChange={handleChange}
                        type="url"
                        placeholder="https://linkedin.com/in/..."
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-gray-800"
                      />
                    </div>
                  </div>

                  {(role === "STUDENT" || role === "COORDINATOR") && (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Resume Link (G-Drive/Hosted)</label>
                      <div className="relative group">
                         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                           <FaFileUpload />
                         </div>
                         <input
                          name="resumeUrl"
                          value={formData.resumeUrl ?? ""}
                          onChange={handleChange}
                          type="url"
                          placeholder="Link to your resume"
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-gray-800"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-4 font-bold text-lg shadow-xl shadow-blue-100 transition-all transform hover:-translate-y-1 flex items-center justify-center cursor-pointer"
                >
                  Create Your Account <FiCheck className="ml-2" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const validateForm = (formData: RegisterFormType, role: Role) => {
  const {
    name,
    email,
    phone,
    password,
    branch,
    year,
    cgpa,
    backlogs,
    industry,
    companyDescription,
    website,
    foundedYear,
    location,
    linkedinUrl,
    resumeUrl,
  } = formData;

  if (!name || !email || !phone || !password) {
    return "Account details (name, email, phone, password) are required.";
  }

  if (role === "STUDENT" || role === "COORDINATOR") {
    if (!branch || !year || cgpa === undefined || !linkedinUrl || !resumeUrl) {
      return "Please fill in all required profile fields.";
    }
    if (cgpa < 0 || cgpa > 10) {
      return "CGPA must be between 0 and 10.";
    }
  }

  if (role === "COMPANY") {
    if (!industry || !companyDescription || !website || !foundedYear) {
      return "Please fill in all company details.";
    }
  }

  return null;
};

export default Register;
