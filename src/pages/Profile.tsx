import React, { useEffect, useState } from "react";
import { FiUser, FiCheckCircle } from "react-icons/fi";
import SideBar from "../components/SideBar";
import type { StudentProfile } from "../types/student.types";
import { toast } from "sonner";
import axios from "axios";
import { GoUnverified } from "react-icons/go";

const Profile: React.FC = () => {
  const [formData, setFormData] = useState<StudentProfile>({
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
  });
  const [isEditState, setIsEditState] = useState<boolean>(false);

  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setFormData(response.data.data);
      }
    } catch (err) {
      toast.error("Error in fetching the profile data");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(()=> {
    fetchProfile();
  }, [isEditState]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;

    let newValue: any = value;
    
    if (type === "checkbox") {
      newValue = checked;
    }

    if (["cgpa", "backlogs"].includes(name)) {
      newValue = value === "" ? "" : parseFloat(value);
    }
    setFormData((pre) => ({ ...pre, [name]: newValue }));
  };
  
  const handleEditProfile = async () => {
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
        setFormData(response.data.data);
        setIsEditState(false);
      }
    } catch (err) {
      toast.error("Error in the updation of profile data");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <main className="flex-1 p-8 ml-64">
        {/* Header */}
        <header className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-semibold">Profile</h1>
          {isEditState ? (
            <div className="flex items-center gap-3">
              <button
                className="bg-neutral-200/10 border border-black/10 text-gray-500 px-4 py-2 rounded-md text-sm hover:cursor-pointer hover:bg-neutral-200/20"
                onClick={() => setIsEditState(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:cursor-pointer hover:bg-blue-700"
                onClick={handleEditProfile}
              >
                Save Changes
              </button>
            </div>
          ) : (
            <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:cursor-pointer"
            onClick={() => setIsEditState(true)}
          >
            Edit Profile
          </button>
          )
        }
        </header>
        <p className="text-gray-600 mb-6">
          Manage your profile information and settings
        </p>

        {/* Profile Grid */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Basic Info */}
          <section className="col-span-2 bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="flex items-center gap-2 text-lg font-medium mb-1">
              <FiUser /> Basic Information
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Your personal and academic details
            </p>
            <div className="grid grid-cols-2 gap-4">
              <label className="text-sm font-medium text-gray-700">
                Full Name
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-2 py-2 text-sm"
                  onChange={handleChange}
                  disabled={!isEditState}
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Email
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-2 py-2 text-sm"
                  onChange={handleChange}
                  disabled={!isEditState}
                />
              </label>
              {/* <label className="text-sm font-medium text-gray-700">
                Roll Number
                <input
                  name="rollNo"
                  type="text"
                  value={formData.rollNo}
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-2 py-2 text-sm"
                  onChange={handleChange}
                  disabled={!isEditState}
                />
              </label> */}
              {/* <label className="text-sm font-medium text-gray-700">
                Graduation Year
                <input
                  name="year"
                  type="text"
                  value={formData.year}
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-2 py-2 text-sm"
                  onChange={handleChange}
                  disabled={!isEditState}
                />
              </label> */}
              <label className="text-sm font-medium text-gray-700">
                Department
                <input
                  name="branch"
                  type="text"
                  value={formData.branch}
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-2 py-2 text-sm"
                  onChange={handleChange}
                  disabled={!isEditState}
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Phone
                <input
                  name="phone"
                  type="telephone"
                  value={formData.phone}
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-2 py-2 text-sm"
                  onChange={handleChange}
                  disabled={!isEditState}
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                CGPA
                <input
                  name="cgpa"
                  step="0.01"
                  type="number"
                  value={formData.cgpa}
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-2 py-2 text-sm"
                  onChange={handleChange}
                  disabled={!isEditState}
                />
              </label>
              <label className="flex items-center text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={formData.activeBacklog}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          activeBacklogs: e.target.checked,
                        }));
                      }}
                      className="mr-2"
                      disabled={!isEditState}
                    />
                    I have active backlogs
                  </label>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Backlogs
                  <input
                    name="backlogs"
                    value={formData.backlogs}
                    type="number"
                    onChange={handleChange}
                    placeholder="Enter number of backlogs"
                    className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none mb-2"
                    disabled={!isEditState}
                  />
                  </label>
            </div>
          </section>

          {/* Account Status */}
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-1">Account Status</h3>
            <p className="text-sm text-gray-600 mb-4">
              Your profile verification status
            </p>
            {
              formData.verifiedProfile ? (
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-md text-sm mb-4 border border-green-500/20">
              <FiCheckCircle className="text-green-500 h-5 w-5" />
              Profile Verified
            </div>
            ) : (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-2 rounded-md text-sm mb-4 border border-red-500/20">
              <GoUnverified className="text-red-500 h-5 w-5" />
              Profile Not Verified
            </div>
            )
            }
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resume URL
                  </label>
                  <input
                    name="resumeUrl"
                    value={formData.resumeUrl ?? ""}
                    onChange={handleChange}
                    type="text"
                    disabled={!isEditState}
                    placeholder="Enter resume URL (e.g., Google Drive link)"
                    className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
          </section>
        </div>

        {/* About Me */}
        <section className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium mb-1">About Me</h3>
          <p className="text-sm text-gray-600 mb-3">
            Tell recruiters about yourself
          </p>
          <textarea
            name="description"
            value={formData.description || ""}
            className="w-full min-h-[80px] rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm resize-none"
            disabled={!isEditState}
            onChange={handleChange}
          />
        </section>

        {/* Skills */}
        {/* <section className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-1">Skills</h3>
          <p className="text-sm text-gray-600 mb-3">
            Add your technical and soft skills
          </p>
          <div className="flex flex-wrap gap-2">
            {["React", "Node.js", "Python", "JavaScript", "TypeScript"].map(
              (skill) => (
                <span
                  key={skill}
                  className="bg-blue-50 text-gray-700 px-3 py-1 rounded-sm text-sm border border-gray-600/20"
                >
                  {skill}
                </span>
              )
            )}
          </div>
        </section> */}
      </main>
    </div>
  );
};

export default Profile;
