import {
  FiBriefcase,
  FiClock,
  FiFileText,
  FiMapPin,
  FiSearch,
  FiArrowRight,
  FiPlus,
  FiExternalLink,
  FiUpload,
  FiX,
  FiUser,
  FiCpu,
  FiGlobe,
  FiFilter
} from "react-icons/fi";
import SideBar from "../components/SideBar";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

type ScrappedJob = {
  id: string;
  title: string;
  companyName: string;
  description: string;
  requiredSkills: string[];
  allowedBatches: string[];
  allowedBranches: string[];
  salary: string;
  jobUrl: string;
  location: string;
  requiredExperience: string;
  postPlatform: string;
  postedAt: string | null;
  isDeadlineGiven: boolean;
  expiredAt: string | null;
  createdAt: string;
  updatedAt: string;
};

const OtherJobs = () => {
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<ScrappedJob[]>([]);
  const [initialJobData, setInitialJobData] = useState<ScrappedJob[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [step, setStep] = useState(1);

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
  const [isCreatingJob, setIsCreatingJob] = useState(false);

  const { user } = useAuth();

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_OTHERJOBS_API_URL}/jobs/scrapped`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (Array.isArray(response.data.data)) {
        const sortedJobs = [...response.data.data].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setInitialJobData(sortedJobs);
        setJobs(sortedJobs);
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

  const filteredJobs = useMemo(() => {
    return initialJobData.filter(job => 
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.requiredSkills?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, initialJobData]);

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
      const data = new FormData();
      data.append("image", uploadData.image);

      const res = await axios.post(
        `${import.meta.env.VITE_OTHERJOBS_API_URL}/upload`,
        data,
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
      toast.success("Image processed successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to upload image.");
    }
  };

  const handleCreateJob = async () => {
    setIsCreatingJob(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_OTHERJOBS_API_URL}/job/scrapped/data`,
        { ...formData, image: uploadedUrl },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("✅ External job added successfully!");
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
        fetchJobs();
      }
    } catch (err) {
      toast.error("Error creating job entry");
    } finally {
      setIsCreatingJob(false);
    }
  };

  const renderModal = () => (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 lg:p-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {step === 1 ? "Job Intelligence" : "Finalize Details"}
              </h2>
              <p className="text-sm text-slate-500 font-medium">Step {step} of 2</p>
            </div>
            <button 
              onClick={() => setOpenModal(false)}
              className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
            >
              <FiX />
            </button>
          </div>

          {step === 1 ? (
            <div className="space-y-6">
              {/* Image Upload Area */}
              <div className="relative group">
                <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Job Screenshot / Banner</label>
                <div className={`border-2 border-dashed rounded-[2rem] p-8 transition-all text-center
                  ${formData.image ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200 bg-slate-50 hover:border-blue-300'}`}
                >
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-2xl transition-all
                      ${formData.image ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-400 shadow-sm'}`}
                    >
                      <FiUpload />
                    </div>
                    <p className="text-sm font-bold text-slate-700">
                      {formData.image ? formData.image.name : "Drop job image here or click"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 font-medium italic">Supports JPG, PNG up to 5MB</p>
                  </div>
                </div>

                {formData.image && !uploadedUrl && (
                  <button
                    type="button"
                    onClick={() => handleUploadImage(formData)}
                    className="w-full mt-4 bg-blue-600 text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <FiCpu /> Process with AI
                  </button>
                )}

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-[10px] font-black uppercase text-blue-600 mb-1 tracking-widest">
                      <span>Analyzing...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                )}

                {uploadedUrl && (
                  <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-2 text-emerald-700 text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
                    <FiCheckCircle className="shrink-0" /> Job processed and ready!
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Creator Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Target Branch</label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    placeholder="e.g. CSE, IT"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-6 py-3.5 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-2xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!formData.name || !formData.branch || !uploadedUrl}
                  className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Next Step <FiArrowRight />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Official Job URL</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500">
                      <FiGlobe />
                    </div>
                    <input
                      type="url"
                      name="jobUrl"
                      value={formData.jobUrl}
                      onChange={handleChange}
                      placeholder="https://career.site/..."
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-slate-800"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Company Website</label>
                  <input
                    type="url"
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 outline-none focus:bg-white focus:border-blue-500 transition-all font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3.5 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-2xl transition-all cursor-pointer"
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  onClick={handleCreateJob}
                  disabled={isCreatingJob}
                  className="px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all cursor-pointer flex items-center gap-2"
                >
                  {isCreatingJob ? "Creating..." : <><FiCheckCircle /> Add to Portal</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50/50 font-sans text-slate-900">
      <SideBar />

      <main className="flex-1 ml-20 p-4 md:p-8 lg:p-12 transition-all duration-300 overflow-x-hidden">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="max-w-full overflow-hidden">
            <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100 mb-2">
              External Feed
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 truncate">Off-Campus Opportunities</h1>
            <p className="text-sm md:text-base text-slate-500 font-medium mt-1">Explore job postings from various external sources and job boards.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {user?.role === "COORDINATOR" && (
              <button
                onClick={() => setOpenModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl md:rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 cursor-pointer"
              >
                <FiPlus className="text-lg" /> Scrape Job
              </button>
            )}
          </div>
        </header>

        {/* Filter Bar */}
        <div className="bg-white rounded-3xl lg:rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-sm mb-10">
          <div className="flex items-center gap-3 mb-6 px-1">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FiSearch />
            </div>
            <h3 className="font-bold text-slate-800">Quick Search</h3>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <FiFilter />
            </div>
            <input
              type="text"
              placeholder="Filter by company, role or skills..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-4 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-medium text-sm text-slate-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Job List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 font-medium mt-4">Scouring the web for roles...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300 text-4xl">
                <FiBriefcase />
              </div>
              <h2 className="text-xl font-bold text-slate-900">No external jobs found</h2>
              <p className="text-slate-400 text-sm mt-2 max-w-xs text-center">We couldn't find any roles matching your current search criteria.</p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="mt-6 text-blue-600 font-bold hover:underline cursor-pointer"
                >
                  View all opportunities
                </button>
              )}
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="group bg-white p-6 md:p-8 rounded-3xl lg:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-100 transition-all duration-300 relative overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-start md:items-center gap-5 overflow-hidden">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-all text-xl md:text-2xl shrink-0 uppercase">
                      {job.companyName?.charAt(0) || "J"}
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h2 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                          {job.title}
                        </h2>
                        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-100 bg-blue-50 text-blue-700">
                          {job.postPlatform}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5"><FiBriefcase className="text-slate-400" /> {job.companyName}</span>
                        <span className="flex items-center gap-1.5"><FiMapPin className="text-slate-400" /> {job.location}</span>
                        <span className="flex items-center gap-1.5 text-blue-600 font-bold"><FiClock className="text-blue-400" /> {job.postedAt ? new Date(job.postedAt).toLocaleDateString() : 'Recently'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center lg:items-end shrink-0 w-full sm:w-auto">
                    <a
                      href={job.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 shadow-lg shadow-slate-200 hover:shadow-blue-100 transition-all group/btn flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Apply Externally <FiExternalLink className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </div>

                {/* Description Preview */}
                <div className="mt-6 pt-6 border-t border-slate-50">
                   <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 md:line-clamp-1 italic">
                     "{job.description}"
                   </p>
                </div>

                {/* Skills Tags */}
                {job.requiredSkills && job.requiredSkills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 bg-slate-50 text-slate-500 border border-slate-100 rounded-lg text-[10px] font-bold uppercase tracking-wider group-hover:border-blue-100 group-hover:text-blue-600 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Deadline Info */}
                {job.isDeadlineGiven && job.expiredAt && (
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-rose-500/70 uppercase tracking-widest bg-rose-50/50 w-fit px-3 py-1 rounded-full border border-rose-100/50">
                    <FiFileText /> Ends {new Date(job.expiredAt).toLocaleDateString()}
                  </div>
                )}
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
