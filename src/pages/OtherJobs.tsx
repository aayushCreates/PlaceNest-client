import {
  FiBriefcase,
  FiClock,
  FiFileText,
  FiMapPin,
  FiSearch,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import type { Job } from "../types/job.types";
import { useAuth } from "../context/AuthContext";

const OtherJobs = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");

  const [jobs, setJobs] = useState<Job[]>([]);
  const [initialJobData, setInitialJobData] = useState<Job[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [step, setStep] = useState(1); // 1 = personal info, 2 = company details

  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    image: null as File | null,
    companyName: "",
    jobUrl: "",
    companyWebsite: "",
  });

  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const branchData = ["CS", "CY", "IT", "ME", "ECE", "EIC", "EE", "CE"];
  const jobTypes = ["Internship", "PartTime", "FullTime", "Contract"];

  const{ user } = useAuth();

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_API_URL}/job/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (Array.isArray(response.data.data)) {
        setInitialJobData(response.data.data);
        setJobs(response.data.data);
      }
    } catch (err) {
      toast.error("Error in fetching jobs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleFilter = (input: string) => {
    if (input === "") {
      setJobs(initialJobData);
    } else {
      setJobs(
        initialJobData.filter((job) =>
          job.title?.toLowerCase().includes(input.toLowerCase())
        )
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUploadImage = async (uploadData: any) => {
    if (!uploadData.image) return toast.error("Please select an image first.");

    try {
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("image", uploadData.image);

      const res = await axios.post(
        `${import.meta.env.VITE_OTHERJOBS_API_URL}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setUploadProgress(percent);
          },
        }
      );

      setUploadedUrl(res.data.data.url);
      console.log("res after img upload: ", res);

      toast.success("Image uploaded successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to upload image.");
    }
  };

  const handleScrappedJob = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_OTHERJOBS_API_URL}/job/scrapped/data`,
        { ...formData, image: uploadedUrl },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("response: ", response);
      if (response.data.success) {
        toast.success("✅ Job created successfully!");
        setOpenModal(false);
        setStep(1);
        setFormData({
          name: "",
          branch: "",
          image: null,
          companyName: "",
          jobUrl: "",
          companyWebsite: "",
        });
        setUploadedUrl("");
        setUploadProgress(0);
        // Refetch jobs after creating a new one
        fetchJobs();
      }
    } catch (err) {
      toast.error("Error creating job");
    }
  };
  const handleCreateJob = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_OTHERJOBS_API_URL}/job/scrapped/data`,
        { ...formData, image: uploadedUrl },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("response: ", response);
      if (response.data.success) {
        toast.success("✅ Job created successfully!");
        setOpenModal(false);
        setStep(1);
        setFormData({
          name: "",
          branch: "",
          image: null,
          companyName: "",
          jobUrl: "",
          companyWebsite: "",
        });
        setUploadedUrl("");
        setUploadProgress(0);
        // Refetch jobs after creating a new one
        fetchJobs();
      }
    } catch (err) {
      toast.error("Error creating job");
    }
  };

  const renderModal = () => (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
          {step === 1 ? "Add Basic Details" : "Add Company Details"}
        </h2>

        {/* STEP 1 — Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            {/* Upload Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Post Image
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="block w-full text-sm border border-gray-300 rounded-md p-2"
              />

              {/* Upload Button + Progress */}
              <div className="mt-3 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleUploadImage(formData);
                  }}
                  disabled={!formData.image}
                  className={`px-4 py-2 rounded-md transition hover:cursor-pointer ${
                    formData.image
                      ? "bg-blue-500/20 text-blue-500 border border-blue-500/20"
                      : "bg-gray-500/20 text-gray-500 border border-gray-500/20 cursor-not-allowed"
                  }`}
                >
                  Upload Image
                </button>

                {/* Progress Bar */}
                {uploadProgress > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}

                {/* Uploaded URL */}
                {uploadedUrl && (
                  <p className="text-green-600 text-xs break-all">
                    ✅ Uploaded URL: {uploadedUrl}
                  </p>
                )}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>

            {/* Branch */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch
              </label>
              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                placeholder="Branch (e.g. CSE, IT)"
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setOpenModal(false);
                  setFormData({
                    name: "",
                    branch: "",
                    image: null as File | null,
                    companyName: "",
                    jobUrl: "",
                    companyWebsite: "",
                  });
                  setUploadedUrl("");
                  setUploadProgress(0);
                }}
                className="px-4 py-2 text-gray-500 hover:cursor-pointer border border-neutral-500/10 rounded-sm hover:bg-neutral-200/10 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep(2);
                  handleScrappedJob();
                }}
                disabled={!formData.name || !formData.branch || !uploadedUrl}
                className={`px-4 py-2 rounded-md transition ${
                  formData.name && formData.branch && uploadedUrl !== ""
                    ? "bg-blue-600/10 border border-blue-500/10 hover:bg-blue-700 text-blue-500"
                    : "bg-neutral-500/10 text-neutral-500 border border-neutral-400/10 cursor-not-allowed"
                }`}
              >
                Save & Next
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 — Company Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Company name"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job URL
              </label>
              <input
                type="url"
                name="jobUrl"
                value={formData.jobUrl}
                onChange={handleChange}
                placeholder="https://company.com/job"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Website
              </label>
              <input
                type="url"
                name="companyWebsite"
                value={formData.companyWebsite}
                onChange={handleChange}
                placeholder="https://company.com"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleCreateJob}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Create Job
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar />

      <main className="flex-1 pl-72 p-8">
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Job Opportunities</h1>
            <p className="text-gray-500 mb-6">
              Discover and apply for jobs that match your profile
            </p>
          </div>
          {user?.role === "COORDINATOR" && (
            <button
              onClick={() => setOpenModal(true)}
              className="h-fit bg-blue-500/10 text-blue-500 border border-blue-500/50 px-4 py-1.5 rounded-sm shadow-xs hover:cursor-pointer hover:bg-blue-500/20"
            >
              Scrappe Job via Img
            </button>
          )}
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-black/10 rounded-md p-4 mb-6 shadow-xs">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <FiSearch /> Filter Jobs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search jobs"
              className="border border-black/20 rounded-md px-3 py-2 w-full"
              onChange={(e) => handleFilter(e.target.value)}
            />
            <select className="border border-black/20 rounded-md px-3 py-2 w-full">
              {branchData.map((b, idx) => (
                <option key={idx}>{b}</option>
              ))}
            </select>
            <select className="border border-black/20 rounded-md px-3 py-2 w-full">
              {jobTypes.map((b, idx) => (
                <option key={idx}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Job List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center mt-32">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-3 text-gray-500">Loading jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <h1 className="text-2xl font-bold text-gray-400">
                No jobs available
              </h1>
            </div>
          ) : (
            jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-6 rounded-md border border-black/10 shadow-xs transition"
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-semibold text-lg text-gray-800">
                      {job.title}
                    </h2>
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                      <FiBriefcase /> {job.company?.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="px-3 py-1 rounded-sm font-medium bg-green-100 text-green-700">
                      {job.type}
                    </span>
                    <span className="flex items-center gap-1 text-gray-400">
                      <FiClock /> {job.createdAt} days ago
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-3 text-gray-600 text-sm">{job.description}</p>

                {/* Footer */}
                <div className="flex justify-between items-center mt-5 text-sm text-gray-500 flex-wrap gap-2">
                  <div className="flex gap-6 flex-wrap">
                    <span className="flex items-center gap-1">
                      <FiMapPin /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiFileText /> Deadline: {job.deadline}
                    </span>
                    <span className="font-medium">₹{job.salary}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 border border-black/10 rounded-md text-gray-700 hover:bg-gray-100 transition text-sm hover:cursor-pointer"
                      onClick={() => navigate(`/student/job/${job.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {openModal && renderModal()}
      </main>
    </div>
  );
};

export default OtherJobs;
