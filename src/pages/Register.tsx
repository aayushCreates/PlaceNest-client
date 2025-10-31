import React, { useState } from "react";
import {
  FaUserGraduate,
  FaBuilding,
  FaUserShield,
  FaEnvelope,
  FaLock,
  FaInfoCircle,
} from "react-icons/fa";
import { toast } from "sonner";
import type { RegisterFormType, Role } from "../types/auth.types";
import { useAuth } from "../context/AuthContext";
import { FiArrowLeft } from "react-icons/fi";

const Register: React.FC = () => {
  const [role, setRole] = useState<"STUDENT" | "COMPANY" | "COORDINATOR">(
    "STUDENT"
  );
  const [currStep, setCurrStep] = useState<number>(1);
  const [hasBacklogs, setHasBacklogs] = useState<boolean>(false);

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
      if(value === "") {
        val = undefined
      }else {
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

  const handleSubmit = async () => {
    const error = validateForm(formData, role);

    if (error) {
      toast.error(error);
      return;
    }

    try {
      console.log("Submitting form:", formData);

      if (!/^[0-9]{10}$/.test(formData.phone)) {
        toast.error("Please enter a valid 10-digit phone number");
        return;
      }

      register(formData);
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Error in registration");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEFEFE] px-4 py-5">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center">
            <FaBuilding className="text-white text-2xl" />
          </div>
          <h1 className="mt-3 text-2xl font-bold text-gray-800">PlaceNest</h1>
          <p className="text-gray-500 text-sm">AI-Enabled College Job Portal</p>
        </div>

        {currStep === 1 ? (
          <div className="bg-white w-full rounded-md shadow p-6">
            <h2 className="text-md font-semibold text-gray-800 mb-1">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Sign in to access your professional dashboard
            </p>

            {/* Role Selector */}
            <div className="flex border border-black/10 rounded-md overflow-hidden mb-4">
              <button
                type="button"
                onClick={() => {
                  setRole("STUDENT");
                  setFormData((pre) => ({ ...pre, role: "STUDENT" }));
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm ${
                  role === "STUDENT" ? "bg-gray-100 font-medium" : "bg-white"
                }`}
              >
                <FaUserGraduate /> STUDENT
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("COMPANY");
                  setFormData((pre) => ({ ...pre, role: "COMPANY" }));
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm ${
                  role === "COMPANY" ? "bg-gray-100 font-medium" : "bg-white"
                }`}
              >
                <FaBuilding /> COMPANY
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("COORDINATOR");
                  setFormData((pre) => ({ ...pre, role: "COORDINATOR" }));
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm ${
                  role === "COORDINATOR"
                    ? "bg-gray-100 font-medium"
                    : "bg-white"
                }`}
              >
                <FaUserShield /> COORDINATOR
              </button>
            </div>

            {/* Info */}
            <div className="flex items-center gap-2 text-sm bg-gray-50 border border-black/10 rounded px-3 py-2 mb-4 text-gray-600">
              {role === "STUDENT" ? (
                <>
                  <FaInfoCircle className="text-blue-500" />
                  <span>Access your job applications and career dashboard</span>
                </>
              ) : role === "COMPANY" ? (
                <>
                  <FaInfoCircle className="text-blue-500" />
                  <span>Manage job postings and recruitment pipeline</span>
                </>
              ) : (
                <>
                  <FaInfoCircle className="text-blue-500" />
                  <span>Oversee platform operations and user management</span>
                </>
              )}
            </div>

            {/* Name */}
            <div className="mb-3">
              <label className="block text-sm mb-1 text-gray-600">
                Full Name
              </label>
              <div className="flex items-center border border-black/10 rounded px-3 py-2">
                <FaEnvelope className="text-gray-400 mr-2" />
                <input
                  name="name"
                  value={formData.name}
                  type="text"
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="flex-1 outline-none text-sm text-gray-700"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="block text-sm mb-1 text-gray-600">
                Email Address
              </label>
              <div className="flex items-center border border-black/10 rounded px-3 py-2">
                <FaEnvelope className="text-gray-400 mr-2" />
                <input
                  name="email"
                  value={formData.email}
                  type="email"
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="flex-1 outline-none text-sm text-gray-700"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="mb-3">
              <label className="block text-sm mb-1 text-gray-600">Phone</label>
              <div className="flex items-center border border-black/10 rounded px-3 py-2">
                <FaEnvelope className="text-gray-400 mr-2" />
                <input
                  name="phone"
                  value={formData.phone}
                  type="text"
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  maxLength={10}
                  placeholder="Enter your phone"
                  className="flex-1 outline-none text-sm text-gray-700"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-sm mb-1 text-gray-600">
                Password
              </label>
              <div className="flex items-center border border-black/10 rounded px-3 py-2">
                <FaLock className="text-gray-400 mr-2" />
                <input
                  name="password"
                  value={formData.password}
                  type="password"
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="flex-1 outline-none text-sm text-gray-700"
                />
              </div>
            </div>

            <button
              type="button"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 font-medium mb-4 transition"
              onClick={() => setCurrStep(2)}
            >
              Next
            </button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 hover:underline">
                Login
              </a>
            </p>
          </div>
        ) : (
          <div className="w-full bg-white shadow-md rounded-2xl p-8">
            <button
              type="button"
              className="flex items-center text-sm text-blue-600 hover:underline mb-4 cursor-pointer"
              onClick={() => setCurrStep(1)}
            >
              <FiArrowLeft className="mr-1" /> Back
            </button>

            <h3 className="font-semibold text-gray-700 mb-1">
              Complete Your Profile
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Fill in the details below to finish registration
            </p>

            <div className="space-y-4">
              {/* Branch + Year */}
              {(role === "STUDENT" || role === "COORDINATOR") && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Branch <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="branch"
                      value={formData.branch ?? ""}
                      onChange={handleChange}
                      className="w-full border border-black/10 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">Select branch</option>
                      <option value="CS">CS</option>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="year"
                      value={formData.year ?? ""}
                      onChange={handleChange}
                      className="w-full border border-black/10 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">Select year</option>
                      <option value="FIRST">FIRST</option>
                      <option value="SECOND">SECOND</option>
                      <option value="THIRD">THIRD</option>
                      <option value="FOURTH">FOURTH</option>
                    </select>
                  </div>
                </div>
              )}

              {/* CGPA */}
              {(role === "STUDENT" || role === "COORDINATOR") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CGPA
                  </label>
                  <input
                    name="cgpa"
                    value={formData.cgpa ?? ""}
                    type="number"
                    onChange={handleChange}
                    placeholder="Enter your CGPA (0-10)"
                    className="w-full border border-black/10 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              )}

              {/* Backlogs */}
              {(role === "STUDENT" || role === "COORDINATOR") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Backlogs
                  </label>
                  <input
                    name="backlogs"
                    value={formData.backlogs ?? ""}
                    type="number"
                    onChange={handleChange}
                    placeholder="Enter number of backlogs"
                    className="w-full border border-black/10 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none mb-2"
                  />
                  <label className="flex items-center text-sm text-gray-600">
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
                      className="mr-2"
                    />
                    I have active backlogs
                  </label>
                </div>
              )}

              {/* Industry (for student) */}
              {role === "COMPANY" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="industry"
                    value={formData.industry ?? ""}
                    onChange={handleChange}
                    type="text"
                    placeholder="e.g., Technology, Healthcare, Finance"
                    className="w-full border border-black/10 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              )}

              {/* Company fields */}
              {role === "COMPANY" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Description{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="companyDescription"
                      value={formData.companyDescription ?? ""}
                      onChange={handleChange}
                      placeholder="Tell us about your company"
                      className="w-full border border-black/10 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="website"
                      value={formData.website ?? ""}
                      onChange={handleChange}
                      type="url"
                      placeholder="https://example.com"
                      className="w-full border border-black/10 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Founded Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="foundedYear"
                      value={formData.foundedYear ?? ""}
                      onChange={handleChange}
                      type="text"
                      placeholder="e.g., 2020"
                      className="w-full border border-black/10 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="location"
                      value={formData.location ?? ""}
                      onChange={handleChange}
                      type="text"
                      placeholder="City, Country"
                      className="w-full border border-black/10 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </>
              )}

              {/* LinkedIn URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn URL{" "}
                  {role !== "COMPANY" && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <input
                  name="linkedinUrl"
                  value={formData.linkedinUrl ?? ""}
                  onChange={handleChange}
                  type="url"
                  placeholder="https://linkedin.com/..."
                  className="w-full border border-black/10 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Resume URL */}
              {(role === "STUDENT" || role === "COORDINATOR") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resume URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="resumeUrl"
                    value={formData.resumeUrl ?? ""}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter resume URL (e.g., Google Drive link)"
                    className="w-full border border-black/10 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              )}

              <button
                type="button"
                className="w-full bg-blue-600 text-white rounded-md py-2 font-medium hover:bg-blue-700 transition-all"
                onClick={handleSubmit}
              >
                Create Account
              </button>
            </div>

            <p className="text-sm text-gray-600 text-center mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Login
              </a>
            </p>
          </div>
        )}
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

  console.log("formDataL ", formData);

  if (!name || !email || !phone || !password) {
    return "Name, email, phone, and password are required.";
  }

  if (!linkedinUrl) {
    return "LinkedIn URL is required.";
  }

  if (role === "STUDENT") {
    if (
      !branch ||
      !year ||
      cgpa === undefined ||
      backlogs === undefined ||
      !linkedinUrl ||
      !resumeUrl
    ) {
      return "All student fields are required.";
    }
  }

  if (role === "COORDINATOR") {
    if (
      !branch ||
      !year ||
      cgpa === undefined ||
      backlogs === undefined ||
      !linkedinUrl ||
      !resumeUrl
    ) {
      return "All coordinator fields are required.";
    }
  }

  if (role === "COMPANY") {
    if (
      !companyDescription ||
      !website ||
      !foundedYear ||
      !location ||
      !industry
    ) {
      return "All company fields are required.";
    }
  }

  return null;
};

export default Register;
