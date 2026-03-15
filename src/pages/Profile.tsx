import React, { useEffect, useState } from "react";
import { 
  FiUser, 
  FiCheckCircle, 
  FiBriefcase, 
  FiBookOpen, 
  FiAward, 
  FiFileText,
  FiEdit3,
  FiSave,
  FiX
} from "react-icons/fi";
import SideBar from "../components/SideBar";
import { toast } from "sonner";
import axios from "axios";
import { GoUnverified } from "react-icons/go";
import { useAuth } from "../context/AuthContext";

const Profile: React.FC = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    branch: "",
    year: "",
    cgpa: 0,
    activeBacklog: false,
    backlogs: 0,
    resumeUrl: "",
    description: "",
    verifiedProfile: false,
    website: "",
    industry: "",
    founded: "",
    location: "",
    linkedinUrl: "",
  });
  const [isEditState, setIsEditState] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        branch: user.branch || "",
        year: user.year || "",
        cgpa: user.cgpa || 0,
        activeBacklog: user.activeBacklog || false,
        backlogs: user.backlogs || 0,
        resumeUrl: user.resumeUrl || "",
        description: user.description || "",
        verifiedProfile: user.verifiedProfile || false,
        website: user.website || "",
        industry: user.industry || "",
        founded: user.founded || "",
        location: user.location || "",
        linkedinUrl: user.linkedinUrl || "",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    let newValue: any = value;

    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      newValue = e.target.checked;
    }

    if (["cgpa", "backlogs"].includes(name)) {
      newValue = value === "" ? "" : parseFloat(value);
    }

    setFormData((pre) => ({ ...pre, [name]: newValue }));
  };

  const handleEditProfile = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_API_URL}/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUser(response.data.data);
        setIsEditState(false);
        toast.success("Profile updated successfully");
      }
    } catch (err) {
      toast.error("Error updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50 font-sans text-slate-900">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <main className="flex-1 ml-20 p-4 md:p-8 lg:p-12 transition-all duration-300 overflow-x-hidden">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 lg:mb-10">
          <div className="max-w-full overflow-hidden">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 truncate">User Profile</h1>
            <p className="text-sm md:text-base text-slate-500 font-medium mt-1">Manage your account information and preferences.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {isEditState ? (
              <>
                <button
                  className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold text-xs md:text-sm hover:bg-slate-50 transition-all cursor-pointer whitespace-nowrap"
                  onClick={() => setIsEditState(false)}
                >
                  <FiX /> Cancel
                </button>
                <button
                  disabled={isLoading}
                  className="flex items-center gap-2 px-5 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-2xl bg-blue-600 text-white font-bold text-xs md:text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 cursor-pointer disabled:opacity-70 whitespace-nowrap"
                  onClick={handleEditProfile}
                >
                  {isLoading ? "Saving..." : <><FiSave /> Save Changes</>}
                </button>
              </>
            ) : (
              <button
                className="flex items-center gap-2 px-5 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-2xl bg-slate-900 text-white font-bold text-xs md:text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 cursor-pointer whitespace-nowrap"
                onClick={() => setIsEditState(true)}
              >
                <FiEdit3 /> Edit Profile
              </button>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column: Form Fields */}
          <div className="xl:col-span-2 space-y-6 lg:space-y-8">
            {/* Basic Info Card */}
            <section className="bg-white rounded-3xl lg:rounded-[2.5rem] p-6 md:p-8 lg:p-10 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg shrink-0">
                  <FiUser />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold">Personal Details</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Basic Information</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs md:text-sm font-bold text-slate-700 ml-1">
                    {user?.role === "COMPANY" ? "Company Name" : "Full Name"}
                  </label>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    className={`w-full rounded-xl md:rounded-2xl border px-4 py-2.5 md:py-3 text-sm font-medium transition-all outline-none 
                      ${isEditState ? "bg-white border-blue-200 focus:ring-4 focus:ring-blue-50" : "bg-slate-50 border-transparent text-slate-500 cursor-not-allowed"}`}
                    onChange={handleChange}
                    readOnly={!isEditState}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs md:text-sm font-bold text-slate-700 ml-1">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    className="w-full rounded-xl md:rounded-2xl border border-transparent bg-slate-50 px-4 py-2.5 md:py-3 text-sm font-medium text-slate-400 cursor-not-allowed outline-none"
                    readOnly
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs md:text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    className={`w-full rounded-xl md:rounded-2xl border px-4 py-2.5 md:py-3 text-sm font-medium transition-all outline-none 
                      ${isEditState ? "bg-white border-blue-200 focus:ring-4 focus:ring-blue-50" : "bg-slate-50 border-transparent text-slate-500 cursor-not-allowed"}`}
                    onChange={handleChange}
                    readOnly={!isEditState}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs md:text-sm font-bold text-slate-700 ml-1">Location</label>
                  <input
                    name="location"
                    type="text"
                    value={formData.location}
                    className={`w-full rounded-xl md:rounded-2xl border px-4 py-2.5 md:py-3 text-sm font-medium transition-all outline-none 
                      ${isEditState ? "bg-white border-blue-200 focus:ring-4 focus:ring-blue-50" : "bg-slate-50 border-transparent text-slate-500 cursor-not-allowed"}`}
                    onChange={handleChange}
                    readOnly={!isEditState}
                  />
                </div>
              </div>
            </section>

            {/* Role Specific Info Card */}
            <section className="bg-white rounded-3xl lg:rounded-[2.5rem] p-6 md:p-8 lg:p-10 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg shrink-0">
                  {user?.role === "COMPANY" ? <FiBriefcase /> : <FiBookOpen />}
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold">{user?.role === "COMPANY" ? "Company Information" : "Academic Details"}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user?.role === "COMPANY" ? "Professional" : "Education"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                {user?.role === "COMPANY" ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="block text-xs md:text-sm font-bold text-slate-700 ml-1">Industry</label>
                      <input
                        name="industry"
                        type="text"
                        value={formData.industry}
                        className={`w-full rounded-xl md:rounded-2xl border px-4 py-2.5 md:py-3 text-sm font-medium transition-all outline-none 
                          ${isEditState ? "bg-white border-blue-200 focus:ring-4 focus:ring-blue-50" : "bg-slate-50 border-transparent text-slate-500 cursor-not-allowed"}`}
                        onChange={handleChange}
                        readOnly={!isEditState}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs md:text-sm font-bold text-slate-700 ml-1">Website</label>
                      <input
                        name="website"
                        type="text"
                        value={formData.website}
                        className={`w-full rounded-xl md:rounded-2xl border px-4 py-2.5 md:py-3 text-sm font-medium transition-all outline-none 
                          ${isEditState ? "bg-white border-blue-200 focus:ring-4 focus:ring-blue-50" : "bg-slate-50 border-transparent text-slate-500 cursor-not-allowed"}`}
                        onChange={handleChange}
                        readOnly={!isEditState}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs md:text-sm font-bold text-slate-700 ml-1">Founded Year</label>
                      <input
                        name="founded"
                        type="text"
                        value={formData.founded}
                        className={`w-full rounded-xl md:rounded-2xl border px-4 py-2.5 md:py-3 text-sm font-medium transition-all outline-none 
                          ${isEditState ? "bg-white border-blue-200 focus:ring-4 focus:ring-blue-50" : "bg-slate-50 border-transparent text-slate-500 cursor-not-allowed"}`}
                        onChange={handleChange}
                        readOnly={!isEditState}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1.5">
                      <label className="block text-xs md:text-sm font-bold text-slate-700 ml-1">Department / Branch</label>
                      <input
                        name="branch"
                        type="text"
                        value={formData.branch}
                        className={`w-full rounded-xl md:rounded-2xl border px-4 py-2.5 md:py-3 text-sm font-medium transition-all outline-none 
                          ${isEditState ? "bg-white border-blue-200 focus:ring-4 focus:ring-blue-50" : "bg-slate-50 border-transparent text-slate-500 cursor-not-allowed"}`}
                        onChange={handleChange}
                        readOnly={!isEditState}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs md:text-sm font-bold text-slate-700 ml-1">Current CGPA</label>
                      <input
                        name="cgpa"
                        type="number"
                        step="0.01"
                        value={formData.cgpa}
                        className={`w-full rounded-xl md:rounded-2xl border px-4 py-2.5 md:py-3 text-sm font-medium transition-all outline-none 
                          ${isEditState ? "bg-white border-blue-200 focus:ring-4 focus:ring-blue-50" : "bg-slate-50 border-transparent text-slate-500 cursor-not-allowed"}`}
                        onChange={handleChange}
                        readOnly={!isEditState}
                      />
                    </div>
                    <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 items-center pt-2">
                       <label className="flex items-center gap-3 p-4 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer group h-full">
                        <input
                          type="checkbox"
                          checked={formData.activeBacklog}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              activeBacklog: e.target.checked,
                            }));
                          }}
                          className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          disabled={!isEditState}
                        />
                        <span className="text-xs md:text-sm font-bold text-slate-600">Active Backlogs</span>
                      </label>
                      <div className="space-y-1.5">
                        <label className="block text-xs md:text-sm font-bold text-slate-700 ml-1">Total Backlogs</label>
                        <input
                          name="backlogs"
                          value={formData.backlogs}
                          type="number"
                          className={`w-full rounded-xl md:rounded-2xl border px-4 py-2.5 md:py-3 text-sm font-medium transition-all outline-none 
                            ${isEditState ? "bg-white border-blue-200 focus:ring-4 focus:ring-blue-50" : "bg-slate-50 border-transparent text-slate-500 cursor-not-allowed"}`}
                          onChange={handleChange}
                          readOnly={!isEditState}
                        />
                      </div>
                    </div>
                  </>
                )}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block text-xs md:text-sm font-bold text-slate-700 ml-1">LinkedIn Profile URL</label>
                  <input
                    name="linkedinUrl"
                    type="url"
                    value={formData.linkedinUrl}
                    className={`w-full rounded-xl md:rounded-2xl border px-4 py-2.5 md:py-3 text-sm font-medium transition-all outline-none 
                      ${isEditState ? "bg-white border-blue-200 focus:ring-4 focus:ring-blue-50" : "bg-slate-50 border-transparent text-slate-500 cursor-not-allowed"}`}
                    onChange={handleChange}
                    readOnly={!isEditState}
                    placeholder="https://linkedin.com/..."
                  />
                </div>
              </div>
            </section>

            {/* About Me Section */}
            <section className="bg-white rounded-3xl lg:rounded-[2.5rem] p-6 md:p-8 lg:p-10 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg shrink-0">
                  <FiEdit3 />
                </div>
                <h3 className="text-lg md:text-xl font-bold">About {user?.role === "COMPANY" ? "the Company" : "Me"}</h3>
              </div>
              <textarea
                name="description"
                value={formData.description || ""}
                rows={4}
                className={`w-full rounded-xl md:rounded-2xl border px-4 py-4 text-sm font-medium transition-all outline-none resize-none 
                  ${isEditState ? "bg-white border-blue-200 focus:ring-4 focus:ring-blue-50" : "bg-slate-50 border-transparent text-slate-500 cursor-not-allowed"}`}
                disabled={!isEditState}
                onChange={handleChange}
                placeholder="Write a brief overview..."
              />
            </section>
          </div>

          {/* Right Column: Status & Resume */}
          <div className="space-y-6 lg:space-y-8">
            {/* Account Status Card */}
            <section className="bg-white rounded-3xl lg:rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-sm">
              <h3 className="text-lg md:text-xl font-bold mb-6">Profile Status</h3>
              
              <div className="space-y-6">
                <div className={`flex flex-col items-center justify-center p-6 md:p-8 rounded-3xl border-2 border-dashed transition-all
                  ${formData.verifiedProfile 
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                    : "bg-rose-50 border-rose-200 text-rose-700"}`}
                >
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-2xl md:text-3xl mb-4 shadow-sm
                    ${formData.verifiedProfile ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}
                  >
                    {formData.verifiedProfile ? <FiCheckCircle /> : <GoUnverified />}
                  </div>
                  <p className="font-black uppercase tracking-widest text-[10px] md:text-xs text-center">
                    {formData.verifiedProfile ? "Verified Account" : "Verification Pending"}
                  </p>
                  <p className="text-center text-[9px] md:text-[10px] font-bold mt-2 opacity-60 leading-relaxed">
                    {formData.verifiedProfile 
                      ? "Your profile has been verified by the TPO Office." 
                      : "Please contact the TPO Office for account verification."}
                  </p>
                </div>

                {user?.role !== "COMPANY" && (
                  <div className="p-1">
                    <label className="block text-xs md:text-sm font-bold text-slate-700 mb-3 ml-1 flex items-center gap-2">
                       <FiFileText className="text-blue-600" /> Resume Link
                    </label>
                    <div className="relative group">
                       <input
                        name="resumeUrl"
                        value={formData.resumeUrl ?? ""}
                        onChange={handleChange}
                        type="url"
                        disabled={!isEditState}
                        placeholder="Link to your resume"
                        className={`w-full rounded-xl md:rounded-2xl border px-4 py-3 md:py-3.5 text-[10px] md:text-xs font-bold transition-all outline-none truncate
                          ${isEditState ? "bg-white border-blue-200 focus:ring-4 focus:ring-blue-50" : "bg-slate-50 border-transparent text-blue-600 underline cursor-pointer"}`}
                        onClick={() => !isEditState && formData.resumeUrl && window.open(formData.resumeUrl, '_blank')}
                      />
                      {!isEditState && formData.resumeUrl && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] md:text-[10px] font-black uppercase text-blue-400">Open</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
